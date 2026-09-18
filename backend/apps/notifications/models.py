import uuid

from django.conf import settings
from django.db import models


class Notification(models.Model):
    """ERD entity: NOTIFICATION."""

    INVESTIGATION = "investigation"
    REPORT = "report"
    DISPUTE = "dispute"
    REVIEW = "review"
    SYSTEM = "system"
    KIND_CHOICES = [
        (INVESTIGATION, "Investigation"), (REPORT, "Report"), (DISPUTE, "Dispute"),
        (REVIEW, "Review"), (SYSTEM, "System"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="notifications", on_delete=models.CASCADE)
    kind = models.CharField(max_length=16, choices=KIND_CHOICES, default=SYSTEM)
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    related_entity_type = models.CharField(max_length=50, blank=True)
    related_entity_id = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
