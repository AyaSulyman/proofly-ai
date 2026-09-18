from rest_framework import serializers

from apps.businesses.models import BusinessVerification
from apps.community.models import CommunityReport
from apps.investigations.models import EvidenceConnection

from .models import AuditLog


class ModeratorReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.CharField(source="reporter.full_name", read_only=True)
    investigation_title = serializers.CharField(source="investigation.title", read_only=True)

    class Meta:
        model = CommunityReport
        fields = ["id", "category", "description", "status", "reporter_name", "investigation_title", "created_at"]


class ModeratorVerificationSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source="business.name", read_only=True)

    class Meta:
        model = BusinessVerification
        fields = ["id", "business", "business_name", "document", "status", "created_at"]


class ModeratorConnectionSerializer(serializers.ModelSerializer):
    identifier_value = serializers.CharField(source="identifier.value", read_only=True)
    source_investigation = serializers.CharField(source="identifier.investigation.title", read_only=True)
    target_investigation = serializers.CharField(source="investigation.title", read_only=True)

    class Meta:
        model = EvidenceConnection
        fields = [
            "id",
            "identifier_value",
            "source_investigation",
            "target_investigation",
            "confidence_score",
            "status",
        ]


class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.full_name", read_only=True, default="System")

    class Meta:
        model = AuditLog
        fields = ["id", "actor_name", "action", "entity_type", "entity_id", "metadata", "created_at"]
