from django.contrib.auth import password_validation
from rest_framework import serializers

from .models import Role, User


class UserSerializer(serializers.ModelSerializer):
    """Matches the frontend's `currentUser` shape in lib/mock-data.ts."""

    role = serializers.CharField(source="role_name", read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "location",
            "role",
            "image_url",
            "is_verified",
            "created_at",
            "notify_investigation_completed",
            "notify_report_status",
            "notify_dispute_activity",
            "notify_new_connections",
            "two_factor_enabled",
        ]
        read_only_fields = ["id", "email", "role", "is_verified", "created_at"]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class UserUpdateSerializer(serializers.ModelSerializer):
    """Profile tab on Settings — full name / phone / location / photo."""

    class Meta:
        model = User
        fields = ["full_name", "phone", "location", "image"]


class NotificationPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "notify_investigation_completed",
            "notify_report_status",
            "notify_dispute_activity",
            "notify_new_connections",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    # Frontend only offers Consumer/Business self-registration; Moderator
    # and Super Admin accounts are created via the Django admin.
    role = serializers.ChoiceField(
        choices=[Role.CONSUMER, Role.BUSINESS], default=Role.CONSUMER, write_only=True
    )

    class Meta:
        model = User
        fields = ["full_name", "email", "password", "confirm_password", "role"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        password_validation.validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        role_name = validated_data.pop("role")
        role, _ = Role.objects.get_or_create(name=role_name)
        password = validated_data.pop("password")
        user = User(role=role, **validated_data)
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError({"confirm_new_password": "Passwords do not match."})
        password_validation.validate_password(attrs["new_password"])
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        password_validation.validate_password(attrs["new_password"])
        return attrs


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyEmailSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
