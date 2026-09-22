from rest_framework import serializers

from .models import AIAnalysisLog, AnalysisSnapshot, EvidenceConnection, Evidence, Identifier, Investigation, RiskSignal


class IdentifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Identifier
        fields = ["id", "type", "value"]


class EvidenceSerializer(serializers.ModelSerializer):
    """Matches lib/types.ts `EvidenceItem`."""

    file_name = serializers.SerializerMethodField()

    class Meta:
        model = Evidence
        fields = ["id", "type", "file", "file_name", "text_value", "category", "extracted_data", "analysis_provider", "analyzed_at", "uploaded_at"]
        read_only_fields = ["id", "extracted_data", "analysis_provider", "analyzed_at", "uploaded_at"]

    def get_file_name(self, obj):
        if obj.file_name:
            return obj.file_name
        if obj.file:
            return obj.file.name.split("/")[-1]
        return obj.text_value[:60]


class RiskSignalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskSignal
        fields = ["id", "label", "severity", "category", "score_impact", "detected_by"]


class AnalysisSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisSnapshot
        fields = ["version", "risk_score", "risk_level", "summary", "signal_count", "evidence_count", "provider", "created_at"]


class InvestigationListSerializer(serializers.ModelSerializer):
    """Slim shape for the "My Investigations" list."""

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Investigation
        fields = ["id", "title", "subject_type", "status", "risk_score", "risk_level", "created_at", "image_url"]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class InvestigationDetailSerializer(InvestigationListSerializer):
    """Full shape matching lib/types.ts `Investigation` — used on the trust
    report / read-only detail page."""

    identifiers = IdentifierSerializer(many=True, read_only=True)
    evidence = EvidenceSerializer(many=True, read_only=True)
    risk_signals = RiskSignalSerializer(many=True, read_only=True)
    analysis_history = AnalysisSnapshotSerializer(many=True, read_only=True)

    class Meta(InvestigationListSerializer.Meta):
        fields = InvestigationListSerializer.Meta.fields + [
            "summary",
            "subject_name",
            "subject_phone",
            "subject_email",
            "subject_url",
            "notes",
            "identifiers",
            "evidence",
            "risk_signals",
            "needs_reanalysis",
            "analysis_version",
            "last_analyzed_at",
            "analysis_provider",
            "website_snapshot",
            "analysis_history",
        ]


class InvestigationCreateSerializer(serializers.ModelSerializer):
    """POST /api/investigations/ — the merged "Subject & Details" step."""

    class Meta:
        model = Investigation
        fields = [
            "id",
            "title",
            "subject_type",
            "subject_name",
            "subject_phone",
            "subject_email",
            "subject_url",
            "notes",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        return Investigation.objects.create(**validated_data)


class EvidenceConnectionSerializer(serializers.ModelSerializer):
    """Powers the Evidence Relationship Graph."""

    related_investigation_title = serializers.CharField(source="investigation.title", read_only=True)
    related_investigation_risk = serializers.CharField(source="investigation.risk_level", read_only=True)
    identifier_value = serializers.CharField(source="identifier.value", read_only=True)

    class Meta:
        model = EvidenceConnection
        fields = [
            "id",
            "identifier_value",
            "investigation",
            "related_investigation_title",
            "related_investigation_risk",
            "connection_type",
            "confidence_score",
            "status",
        ]


class AIAnalysisLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalysisLog
        fields = ["id", "feature_type", "model_used", "confidence_score", "created_at"]
