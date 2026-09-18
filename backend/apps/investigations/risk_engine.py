"""
Deterministic risk engine.

Per the BRD: "AI is used only to explain detected signals, never to invent
the final score." This module owns the actual point values and thresholds;
apps.investigations.ai_client only supplies *candidate* signals (extracted
from evidence / detected in text), which this engine turns into scored
RiskSignal rows.
"""

from dataclasses import dataclass

from .models import EvidenceConnection, Investigation, RiskSignal

# label -> (severity, category, score_impact)
SIGNAL_WEIGHTS = {
    "advance_payment_requested": ("high", RiskSignal.PAYMENT, 20, "Advance payment requested outside platform"),
    "urgency_language": ("high", RiskSignal.CONTENT, 15, "Urgency / pressure language detected"),
    "price_below_market": ("high", RiskSignal.CONTENT, 15, "Price significantly below market average"),
    "new_account": ("medium", RiskSignal.TECHNICAL, 10, "Account or listing created very recently"),
    "low_engagement": ("medium", RiskSignal.TECHNICAL, 8, "Low engagement relative to claimed activity"),
    "reused_images": ("medium", RiskSignal.CONTENT, 10, "Product images reused from other listings"),
    "off_platform_request": ("medium", RiskSignal.CONTENT, 8, "Requests to move communication off-platform"),
}

CONNECTION_SCORE_IMPACT = 25  # "prior related reports +25" per BRD example
VERIFIED_BUSINESS_DISCOUNT = -20  # "verified business -20" per BRD example

LOW_THRESHOLD = 34
MEDIUM_THRESHOLD = 67


@dataclass
class RiskResult:
    score: int
    level: str
    signals_created: int


def _level_for_score(score: int) -> str:
    if score >= MEDIUM_THRESHOLD:
        return Investigation.HIGH
    if score >= LOW_THRESHOLD:
        return Investigation.MEDIUM
    return Investigation.LOW


def apply_candidate_signals(investigation: Investigation, candidate_keys: list[str]) -> int:
    """Creates RiskSignal rows for each recognized candidate key (deduped)
    and returns the total score impact."""
    total = 0
    existing_labels = set(investigation.risk_signals.values_list("label", flat=True))
    for key in candidate_keys:
        weight = SIGNAL_WEIGHTS.get(key)
        if not weight:
            continue
        severity, category, impact, label = weight
        if label in existing_labels:
            continue
        RiskSignal.objects.create(
            investigation=investigation,
            label=label,
            severity=severity,
            category=category,
            score_impact=impact,
            detected_by="ai",
        )
        total += impact
        existing_labels.add(label)
    return total


def compute_risk(investigation: Investigation, candidate_signal_keys: list[str] | None = None) -> RiskResult:
    """Recomputes and persists risk_score / risk_level for an investigation.

    1. Turns AI-detected candidate signals into scored RiskSignal rows
       (fixed weights defined above — the AI never sets the score itself).
    2. Adds points for confirmed/pending connections to other
       investigations (network risk).
    3. Clamps to 0-100 and derives a risk_level from fixed thresholds.
    """
    score = 0
    signals_created = 0

    if candidate_signal_keys:
        score += apply_candidate_signals(investigation, candidate_signal_keys)
        signals_created = len(candidate_signal_keys)

    # Re-sum from persisted signals so re-running analysis is idempotent
    # rather than double-counting.
    score = sum(investigation.risk_signals.values_list("score_impact", flat=True))

    connection_count = EvidenceConnection.objects.filter(
        identifier__investigation=investigation
    ).exclude(status=EvidenceConnection.REJECTED).count()
    if connection_count:
        score += CONNECTION_SCORE_IMPACT
        RiskSignal.objects.get_or_create(
            investigation=investigation,
            label=f"Linked to {connection_count} other flagged investigation(s)",
            defaults={"severity": "high", "category": RiskSignal.NETWORK, "score_impact": CONNECTION_SCORE_IMPACT, "detected_by": "backend_rule"},
        )

    score = max(0, min(100, score))
    level = _level_for_score(score)

    investigation.risk_score = score
    investigation.risk_level = level
    investigation.save(update_fields=["risk_score", "risk_level"])

    return RiskResult(score=score, level=level, signals_created=signals_created)
