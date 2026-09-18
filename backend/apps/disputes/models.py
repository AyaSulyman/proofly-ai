import uuid

from django.conf import settings
from django.db import models


class Dispute(models.Model):
    """ERD entity: DISPUTE."""

    OPEN = "open"
    AWAITING_BUSINESS = "awaiting_business"
    AWAITING_CUSTOMER = "awaiting_customer"
    UNDER_REVIEW = "under_review"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"
    STATUS_CHOICES = [
        (OPEN, "Open"),
        (AWAITING_BUSINESS, "Awaiting Business"),
        (AWAITING_CUSTOMER, "Awaiting Customer"),
        (UNDER_REVIEW, "Under Review"),
        (RESOLVED, "Resolved"),
        (DISMISSED, "Dismissed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey("community.CommunityReport", related_name="disputes", on_delete=models.CASCADE)
    business = models.ForeignKey("businesses.Business", related_name="disputes", on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=AWAITING_BUSINESS)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Dispute #{str(self.id)[:8]} — {self.business.name}"


class DisputeMessage(models.Model):
    """ERD entity: DISPUTE_RESPONSE."""

    REPORTER = "reporter"
    BUSINESS = "business"
    AUTHOR_ROLE_CHOICES = [(REPORTER, "Reporter"), (BUSINESS, "Business")]

    dispute = models.ForeignKey(Dispute, related_name="messages", on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="dispute_messages", on_delete=models.CASCADE)
    author_role = models.CharField(max_length=10, choices=AUTHOR_ROLE_CHOICES)
    text = models.TextField()
    attachment = models.FileField(upload_to="dispute_attachments/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Message on dispute {self.dispute_id} by {self.author_role}"
