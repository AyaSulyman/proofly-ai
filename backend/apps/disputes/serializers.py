from rest_framework import serializers

from .models import Dispute, DisputeMessage


class DisputeMessageSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = DisputeMessage
        fields = ["id", "author_role", "author_name", "text", "attachment", "created_at"]
        read_only_fields = ["id", "author_name", "created_at"]


class DisputeListSerializer(serializers.ModelSerializer):
    """Matches lib/types.ts `Dispute` (without messages) — "My Disputes" list."""

    subject_name = serializers.CharField(source="business.name", read_only=True)

    class Meta:
        model = Dispute
        fields = ["id", "report", "subject_name", "status", "created_at", "resolved_at"]


class DisputeDetailSerializer(DisputeListSerializer):
    messages = DisputeMessageSerializer(many=True, read_only=True)

    class Meta(DisputeListSerializer.Meta):
        fields = DisputeListSerializer.Meta.fields + ["messages"]


class DisputeMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisputeMessage
        fields = ["text", "attachment"]
