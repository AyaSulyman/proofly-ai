"""
Deterministic risk engine.

Per the BRD: "AI is used only to explain detected signals, never to invent
the final score."

This module owns the actual point values and risk thresholds.
apps.investigations.ai_client supplies candidate signals extracted from
evidence, while backend checks can supply technical signals. This engine
turns those signals into an auditable risk score.
"""

from dataclasses import dataclass

from .models import EvidenceConnection, Investigation, RiskSignal


# key -> (severity, category, score impact, displayed label)
SIGNAL_WEIGHTS = {
    "advance_payment_requested": (
        "high",
        RiskSignal.PAYMENT,
        20,
        "Advance payment requested outside platform",
    ),
    "urgency_language": (
        "high",
        RiskSignal.CONTENT,
        15,
        "Urgency / pressure language detected",
    ),
    "price_below_market": (
        "high",
        RiskSignal.CONTENT,
        15,
        "Price significantly below market average",
    ),
    "new_account": (
        "medium",
        RiskSignal.TECHNICAL,
        10,
        "Account or listing created very recently",
    ),
    "low_engagement": (
        "medium",
        RiskSignal.TECHNICAL,
        8,
        "Low engagement relative to claimed activity",
    ),
    "reused_images": (
        "medium",
        RiskSignal.CONTENT,
        10,
        "Product images reused from other listings",
    ),
    "off_platform_request": (
        "medium",
        RiskSignal.CONTENT,
        8,
        "Requests to move communication off-platform",
    ),
    "website_unreachable": (
        "medium",
        RiskSignal.TECHNICAL,
        15,
        "Website domain could not be resolved",
    ),
    "website_scan_inconclusive": (
        "low",
        RiskSignal.TECHNICAL,
        5,
        "Automated website inspection was inconclusive",
    ),
    "insecure_website": (
        "medium",
        RiskSignal.TECHNICAL,
        12,
        "Website connection is not securely protected",
    ),
    "password_form_without_https": (
        "high",
        RiskSignal.TECHNICAL,
        25,
        "Password form is served without HTTPS",
    ),
    "missing_security_headers": (
        "low",
        RiskSignal.TECHNICAL,
        5,
        "Recommended website security headers are missing",
    ),
    "impersonation_language": (
        "high",
        RiskSignal.CONTENT,
        18,
        "Possible impersonation or false identity language detected",
    ),
}


# Applied once when one or more confirmed relationships exist.
CONNECTION_SCORE_IMPACT = 25

# Reserved for a future verified-business relationship.
VERIFIED_BUSINESS_DISCOUNT = -20

LOW_THRESHOLD = 34
MEDIUM_THRESHOLD = 67


@dataclass
class RiskResult:
    score: int
    level: str
    signals_created: int


def _level_for_score(score: int) -> str:
    """Convert a numeric score into the configured risk level."""

    if score >= MEDIUM_THRESHOLD:
        return Investigation.HIGH

    if score >= LOW_THRESHOLD:
        return Investigation.MEDIUM

    return Investigation.LOW


def apply_candidate_signals(
    investigation: Investigation,
    candidate_keys: list[str],
) -> int:
    """Persist recognized candidate signals.

    Duplicate candidate keys and duplicate labels are ignored. The return
    value is the number of RiskSignal rows created.
    """

    created_count = 0
    existing_labels = set(
        investigation.risk_signals.values_list(
            "label",
            flat=True,
        )
    )

    for key in dict.fromkeys(candidate_keys):
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

        existing_labels.add(label)
        created_count += 1

    return created_count


def compute_risk(
    investigation: Investigation,
    candidate_signal_keys: list[str] | None = None,
) -> RiskResult:
    """Recompute and persist an investigation's risk assessment.

    Processing steps:

    1. Remove findings automatically created by previous analyses.
    2. Convert recognized AI/backend candidate keys into fixed signals.
    3. Include remaining manually created signals in the score.
    4. Add network risk only for confirmed relationships to medium- or
       high-risk investigations.
    5. Clamp the score to 0–100 and derive the final risk level.
    """

    # Rebuild automatic findings on every run. This allows a later score to
    # decrease if evidence is corrected or removed.
    investigation.risk_signals.filter(
        detected_by__in=["ai", "backend_rule"],
    ).delete()

    candidate_keys = list(
        dict.fromkeys(candidate_signal_keys or [])
    )

    signals_created = apply_candidate_signals(
        investigation,
        candidate_keys,
    )

    # Include newly generated signals and any manually retained signals.
    score = sum(
        investigation.risk_signals.values_list(
            "score_impact",
            flat=True,
        )
    )

    # A shared identifier alone is not enough to increase the score.
    # The relationship must be confirmed and the related investigation
    # must already have a medium or high risk assessment.
    connection_count = (
        EvidenceConnection.objects.filter(
            identifier__investigation=investigation,
            status=EvidenceConnection.CONFIRMED,
            investigation__risk_level__in=[
                Investigation.MEDIUM,
                Investigation.HIGH,
            ],
        )
        .exclude(investigation=investigation)
        .values("investigation_id")
        .distinct()
        .count()
    )

    if connection_count > 0:
        score += CONNECTION_SCORE_IMPACT

        RiskSignal.objects.create(
            investigation=investigation,
            label=(
                f"Linked to {connection_count} confirmed "
                "higher-risk investigation(s)"
            ),
            severity="high",
            category=RiskSignal.NETWORK,
            score_impact=CONNECTION_SCORE_IMPACT,
            detected_by="backend_rule",
        )

        signals_created += 1

    score = max(0, min(100, score))
    level = _level_for_score(score)

    investigation.risk_score = score
    investigation.risk_level = level
    investigation.save(
        update_fields=[
            "risk_score",
            "risk_level",
        ]
    )

    return RiskResult(
        score=score,
        level=level,
        signals_created=signals_created,
    )