import uuid

from django.conf import settings
from django.db import models


class Business(models.Model):
    """ERD entity: BUSINESS. Also represents individual sellers/freelancers
    (see `is_individual`) since the frontend's search/profile pages treat
    both the same way — only the avatar shape differs."""

    UNVERIFIED = "unverified"
    PENDING = "pending"
    NEEDS_INFO = "needs_info"
    VERIFIED = "verified"
    VERIFICATION_CHOICES = [
        (UNVERIFIED, "Unverified"),
        (PENDING, "Pending"),
        (NEEDS_INFO, "Needs Info"),
        (VERIFIED, "Verified"),
    ]

    LOW, MEDIUM, HIGH = "low", "medium", "high"
    RISK_CHOICES = [(LOW, "Low"), (MEDIUM, "Medium"), (HIGH, "High")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="businesses", on_delete=models.SET_NULL, null=True, blank=True
    )
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=120, blank=True)
    is_individual = models.BooleanField(
        default=False, help_text="True for an individual seller/freelancer rather than a company."
    )
    website = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    location = models.CharField(max_length=150, blank=True)
    image = models.ImageField(upload_to="business_logos/", null=True, blank=True)

    verification_status = models.CharField(max_length=16, choices=VERIFICATION_CHOICES, default=UNVERIFIED)

    # Cached/derived fields recomputed by the risk engine + review signals
    # (kept denormalized here so search/list views stay fast — see
    # apps.investigations.risk_engine for what writes to these).
    risk_score = models.PositiveSmallIntegerField(default=0)
    risk_level = models.CharField(max_length=8, choices=RISK_CHOICES, default=LOW)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    response_rate = models.CharField(max_length=64, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "businesses"

    def __str__(self):
        return self.name

    def recompute_review_stats(self):
        from django.db.models import Avg, Count

        agg = self.reviews.aggregate(avg=Avg("rating"), count=Count("id"))
        self.rating = round(agg["avg"] or 0, 2)
        self.review_count = agg["count"] or 0
        self.save(update_fields=["rating", "review_count"])


class BusinessVerification(models.Model):
    """ERD entity: BUSINESS_VERIFICATION."""

    PENDING = "pending"
    NEEDS_INFO = "needs_info"
    APPROVED = "approved"
    REJECTED = "rejected"
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (NEEDS_INFO, "Needs Info"),
        (APPROVED, "Approved"),
        (REJECTED, "Rejected"),
    ]

    business = models.ForeignKey(Business, related_name="verifications", on_delete=models.CASCADE)
    document = models.FileField(upload_to="verification_docs/")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=PENDING)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="reviewed_verifications", on_delete=models.SET_NULL, null=True, blank=True
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Verification for {self.business.name} ({self.status})"
