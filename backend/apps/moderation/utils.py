from .models import AuditLog


def log_action(actor, action: str, entity_type: str, entity_id, metadata: dict | None = None):
    """Writes one AuditLog row. Called from other apps any time a
    moderation- or security-relevant action happens (investigation created,
    report approved/rejected, dispute message sent, sign-in, etc.)."""
    return AuditLog.objects.create(
        actor=actor if getattr(actor, "is_authenticated", False) else None,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        metadata=metadata or {},
    )
