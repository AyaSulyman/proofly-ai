import uuid

from django.conf import settings
from django.db import models


class Review(models.Model):
    """ERD entity: REVIEW."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey("businesses.Business", related_name="reviews", on_delete=models.CASCADE)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="reviews", on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    is_flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.rating}★ review of {self.business.name} by {self.reviewer.email}"


class CommunityReport(models.Model):
    """ERD entity: REPORT. (Named CommunityReport in code to avoid clashing
    with Django's admin LogEntry / generic 'report' terminology.)"""

    NON_DELIVERY = "non_delivery"
    PAYMENT_ISSUE = "payment_issue"
    COUNTERFEIT = "counterfeit"
    IDENTITY_CONCERN = "identity_concern"
    SUSPICIOUS_WEBSITE = "suspicious_website"
    OTHER = "other"
    CATEGORY_CHOICES = [
        (NON_DELIVERY, "Non-delivery"),
        (PAYMENT_ISSUE, "Payment issue"),
        (COUNTERFEIT, "Counterfeit item"),
        (IDENTITY_CONCERN, "Identity concern"),
        (SUSPICIOUS_WEBSITE, "Suspicious website"),
        (OTHER, "Other"),
    ]

    PENDING, APPROVED, REJECTED = "pending", "approved", "rejected"
    STATUS_CHOICES = [(PENDING, "Pending"), (APPROVED, "Approved"), (REJECTED, "Rejected")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    investigation = models.ForeignKey(
        "investigations.Investigation", related_name="community_reports", on_delete=models.CASCADE
    )
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="community_reports", on_delete=models.CASCADE)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=PENDING)
    moderator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="moderated_reports",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    moderator_note = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Report #{str(self.id)[:8]} — {self.get_category_display()}"
