from rest_framework import serializers

from .models import CommunityReport, Review


class CommunityReportSerializer(serializers.ModelSerializer):
    """Matches lib/types.ts `CommunityReport`."""

    investigation_id = serializers.PrimaryKeyRelatedField(source="investigation", read_only=True)
    subject_name = serializers.CharField(source="investigation.title", read_only=True)

    class Meta:
        model = CommunityReport
        fields = [
            "id",
            "investigation_id",
            "category",
            "description",
            "status",
            "subject_name",
            "created_at",
        ]
        read_only_fields = ["id", "status", "subject_name", "created_at"]


class CommunityReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityReport
        fields = ["investigation", "category", "description"]

    def create(self, validated_data):
        request = self.context["request"]
        return CommunityReport.objects.create(reporter=request.user, **validated_data)


class CommunityReportDecisionSerializer(serializers.ModelSerializer):
    """Used by moderators to approve/reject (see apps.moderation)."""

    class Meta:
        model = CommunityReport
        fields = ["status", "moderator_note"]


class MyReviewSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source="business.name", read_only=True)
    business_id = serializers.PrimaryKeyRelatedField(source="business", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "business_id", "business_name", "rating", "comment", "created_at"]
