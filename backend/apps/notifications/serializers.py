from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    read = serializers.BooleanField(source="is_read")

    class Meta:
        model = Notification
        fields = ["id", "kind", "title", "body", "read", "created_at"]
