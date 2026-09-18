from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    """ERD entity: AUDIT_LOG — every moderation/security-relevant action,
    written via apps.moderation.utils.log_action() from other apps."""

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="audit_logs", on_delete=models.SET_NULL, null=True
    )
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=64)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.action} on {self.entity_type}:{self.entity_id}"
