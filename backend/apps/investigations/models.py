import uuid

from django.conf import settings
from django.db import models


class Investigation(models.Model):
    """ERD entity: INVESTIGATION, with TRUST_REPORT's fields (risk_level,
    risk_score, summary) folded directly onto this model — the frontend
    always reads/writes them together (one investigation -> one report),
    so a separate 1:1 table added no value. See ERD docx for the original
    fully-normalized design."""

    SELLER = "seller"
    LISTING = "listing"
    WEBSITE = "website"
    BUSINESS = "business"
    FREELANCER = "freelancer"
    RENTAL = "rental"
    MESSAGE = "message"
    OTHER = "other"
    SUBJECT_CHOICES = [
        (SELLER, "Seller"), (LISTING, "Listing"), (WEBSITE, "Website"), (BUSINESS, "Business"),
        (FREELANCER, "Freelancer"), (RENTAL, "Rental"), (MESSAGE, "Message"), (OTHER, "Other"),
    ]

    DRAFT, ANALYZING, COMPLETED = "draft", "analyzing", "completed"
    STATUS_CHOICES = [(DRAFT, "Draft"), (ANALYZING, "Analyzing"), (COMPLETED, "Completed")]

    LOW, MEDIUM, HIGH = "low", "medium", "high"
    RISK_CHOICES = [(LOW, "Low"), (MEDIUM, "Medium"), (HIGH, "High")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="investigations", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    subject_type = models.CharField(max_length=16, choices=SUBJECT_CHOICES)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=DRAFT)

    # Free-form subject details captured on the "Details" step.
    subject_name = models.CharField(max_length=255, blank=True)
    subject_phone = models.CharField(max_length=32, blank=True)
    subject_email = models.CharField(max_length=255, blank=True)
    subject_url = models.CharField(max_length=500, blank=True)
    notes = models.TextField(blank=True)

    # Populated once analysis completes (by apps.investigations.risk_engine).
    risk_score = models.PositiveSmallIntegerField(null=True, blank=True)
    risk_level = models.CharField(max_length=8, choices=RISK_CHOICES, null=True, blank=True)
    summary = models.TextField(blank=True)

    image = models.ImageField(upload_to="investigation_subjects/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Identifier(models.Model):
    """ERD entity: IDENTIFIER — indexed for cross-investigation matching."""

    PHONE = "phone"
    EMAIL = "email"
    DOMAIN = "domain"
    USERNAME = "username"
    URL = "url"
    SOCIAL_HANDLE = "social_handle"
    TYPE_CHOICES = [
        (PHONE, "Phone"), (EMAIL, "Email"), (DOMAIN, "Domain"),
        (USERNAME, "Username"), (URL, "URL"), (SOCIAL_HANDLE, "Social Handle"),
    ]

    investigation = models.ForeignKey(Investigation, related_name="identifiers", on_delete=models.CASCADE)
    type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    value = models.CharField(max_length=255, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type}: {self.value}"


class Evidence(models.Model):
    """ERD entity: EVIDENCE."""

    SCREENSHOT = "screenshot"
    IMAGE = "image"
    DOCUMENT = "document"
    URL = "url"
    TEXT = "text"
    TYPE_CHOICES = [
        (SCREENSHOT, "Screenshot"), (IMAGE, "Image"), (DOCUMENT, "Document"),
        (URL, "URL"), (TEXT, "Text"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    investigation = models.ForeignKey(Investigation, related_name="evidence", on_delete=models.CASCADE)
    type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    file = models.FileField(upload_to="evidence/", null=True, blank=True)
    # For type=url or type=text, the value lives here instead of a file.
    text_value = models.TextField(blank=True)
    file_name = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=32, blank=True)
    extracted_data = models.JSONField(default=dict, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["uploaded_at"]
        verbose_name_plural = "evidence"

    def __str__(self):
        return self.file_name or self.text_value[:40] or f"Evidence {self.id}"


class RiskSignal(models.Model):
    """ERD entity: RISK_SIGNAL."""

    LOW, MEDIUM, HIGH = "low", "medium", "high"
    SEVERITY_CHOICES = [(LOW, "Low"), (MEDIUM, "Medium"), (HIGH, "High")]

    PAYMENT = "Payment"
    CONTENT = "Content"
    TECHNICAL = "Technical"
    NETWORK = "Network"
    CATEGORY_CHOICES = [
        (PAYMENT, "Payment"), (CONTENT, "Content"), (TECHNICAL, "Technical"), (NETWORK, "Network"),
    ]

    investigation = models.ForeignKey(Investigation, related_name="risk_signals", on_delete=models.CASCADE)
    label = models.CharField(max_length=255)
    severity = models.CharField(max_length=8, choices=SEVERITY_CHOICES)
    category = models.CharField(max_length=16, choices=CATEGORY_CHOICES)
    score_impact = models.SmallIntegerField(default=0)
    detected_by = models.CharField(
        max_length=16,
        choices=[("ai", "AI"), ("backend_rule", "Backend Rule")],
        default="backend_rule",
    )

    def __str__(self):
        return self.label


class EvidenceConnection(models.Model):
    """ERD entity: EVIDENCE_CONNECTION — powers the Evidence Relationship Graph."""

    PENDING, CONFIRMED, REJECTED = "pending", "confirmed", "rejected"
    STATUS_CHOICES = [(PENDING, "Pending"), (CONFIRMED, "Confirmed"), (REJECTED, "Rejected")]

    AI_SUGGESTED = "ai_suggested"
    MODERATOR_CONFIRMED = "moderator_confirmed"
    CONNECTION_TYPE_CHOICES = [(AI_SUGGESTED, "AI Suggested"), (MODERATOR_CONFIRMED, "Moderator Confirmed")]

    identifier = models.ForeignKey(Identifier, related_name="connections", on_delete=models.CASCADE)
    investigation = models.ForeignKey(
        Investigation, related_name="connections", on_delete=models.CASCADE,
        help_text="The *other* investigation this identifier also appears in.",
    )
    connection_type = models.CharField(max_length=24, choices=CONNECTION_TYPE_CHOICES, default=AI_SUGGESTED)
    confidence_score = models.FloatField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="reviewed_connections", on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.identifier} -> Investigation {self.investigation_id}"


class AIAnalysisLog(models.Model):
    """ERD entity: AI_ANALYSIS_LOG — every call Django makes to the FastAPI
    AI service is recorded here for auditability/debugging."""

    EXTRACTION = "extraction"
    LANGUAGE_ANALYSIS = "language_analysis"
    SIMILARITY = "similarity"
    SUMMARY = "summary"
    FEATURE_CHOICES = [
        (EXTRACTION, "Extraction"), (LANGUAGE_ANALYSIS, "Language Analysis"),
        (SIMILARITY, "Similarity"), (SUMMARY, "Summary"),
    ]

    investigation = models.ForeignKey(Investigation, related_name="ai_logs", on_delete=models.CASCADE)
    evidence = models.ForeignKey(Evidence, related_name="ai_logs", on_delete=models.SET_NULL, null=True, blank=True)
    feature_type = models.CharField(max_length=24, choices=FEATURE_CHOICES)
    model_used = models.CharField(max_length=100, blank=True)
    request_payload = models.JSONField(default=dict, blank=True)
    response_payload = models.JSONField(default=dict, blank=True)
    confidence_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.feature_type} for investigation {self.investigation_id}"
