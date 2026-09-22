from .models import Notification


def notify(user, *, kind: str, title: str, body: str = "", related_entity_type: str = "", related_entity_id: str = ""):
    """Creates a Notification row for `user`. Called from other apps
    (investigations, community, disputes) whenever something happens that
    the person should be told about. Kept as a plain function (rather than
    signals) so the call sites stay easy to trace."""
    if user is None:
        return None
    return Notification.objects.create(
        user=user,
        kind=kind,
        title=title,
        body=body,
        related_entity_type=related_entity_type,
        related_entity_id=str(related_entity_id) if related_entity_id else "",
    )
