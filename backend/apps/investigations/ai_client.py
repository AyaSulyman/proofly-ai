"""
Thin HTTP client for the FastAPI AI microservice (../ai_service).

Every call is wrapped so that if the AI service is unreachable (not yet
built/running, network hiccup, timeout), Django falls back to a simple
local heuristic instead of failing the whole "run analysis" request. This
keeps the Django backend independently testable and keeps the product
usable in degraded mode — matching the BRD's reliability requirement
("AI failures degrade gracefully").
"""

import logging
import re

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

TIMEOUT = 8  # seconds — AI calls run inside the "processing" step, keep it snappy

URGENCY_PATTERNS = [
    r"\bhurry\b", r"\blimited time\b", r"\bact now\b", r"\bpay now\b",
    r"\bother buyers?\b", r"\bwon'?t last\b", r"\bfinal offer\b",
]
ADVANCE_PAYMENT_PATTERNS = [
    r"\bwire transfer\b", r"\bwestern union\b", r"\bgift card\b",
    r"\bpay (first|upfront|in advance)\b", r"\boutside (the )?(app|platform)\b",
]


def _post(path: str, payload: dict) -> dict | None:
    try:
        resp = requests.post(f"{settings.AI_SERVICE_URL}{path}", json=payload, timeout=TIMEOUT)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as exc:
        logger.warning("AI service call to %s failed, using local fallback: %s", path, exc)
        return None


def _local_text_signals(text: str) -> list[str]:
    text_lower = (text or "").lower()
    keys = []
    if any(re.search(p, text_lower) for p in URGENCY_PATTERNS):
        keys.append("urgency_language")
    if any(re.search(p, text_lower) for p in ADVANCE_PAYMENT_PATTERNS):
        keys.append("advance_payment_requested")
        keys.append("off_platform_request")
    return keys


def extract_evidence(evidence) -> dict:
    """POST /extract — pulls structured fields + candidate risk-signal keys
    out of one evidence item (screenshot/text/url)."""
    text = evidence.text_value or evidence.file_name or ""
    result = _post("/extract", {"type": evidence.type, "text": text, "fileName": evidence.file_name})
    if result is not None:
        return result
    return {
        "extractedData": {"note": "Analyzed locally (AI service offline)"},
        "candidateSignalKeys": _local_text_signals(text),
    }


def analyze_investigation_text(investigation) -> list[str]:
    """POST /analyze-risk — scans notes + evidence text for risk language."""
    combined_text = " ".join(
        [investigation.notes]
        + list(investigation.evidence.values_list("text_value", flat=True))
    )
    result = _post("/analyze-risk", {"text": combined_text})
    if result is not None:
        return result.get("candidateSignalKeys", [])
    return _local_text_signals(combined_text)


def find_similar_investigations(investigation) -> list[dict]:
    """POST /similarity — cross-references this investigation's identifiers
    against everything else in the DB. Implemented directly against the DB
    (exact identifier match) rather than the AI service for the MVP;
    embedding-based *fuzzy* similarity is the AI service's job once wired up."""
    from .models import Identifier

    matches = []
    for ident in investigation.identifiers.all():
        others = Identifier.objects.filter(value__iexact=ident.value).exclude(investigation=investigation)
        for other in others:
            matches.append({"identifier": ident, "other_investigation": other.investigation, "confidence": 0.95})
    return matches


def summarize_investigation(investigation) -> str:
    """POST /summarize — plain-language summary of the completed analysis."""
    signals = list(investigation.risk_signals.values_list("label", flat=True))
    result = _post("/summarize", {"title": investigation.title, "riskLevel": investigation.risk_level, "signals": signals})
    if result is not None:
        return result.get("summary", "")

    if not signals:
        return "No significant risk signals were detected in the evidence provided."
    top = ", ".join(s.lower() for s in signals[:3])
    return (
        f"This investigation shows {investigation.risk_level} risk based on {len(signals)} signal(s), "
        f"including {top}. Review the full evidence before making a decision."
    )
