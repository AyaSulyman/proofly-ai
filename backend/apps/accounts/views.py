from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import (
    ChangePasswordSerializer,
    EmailSerializer,
    ForgotPasswordSerializer,
    NotificationPreferencesSerializer,
    RegisterSerializer,
    UserSerializer,
    UserUpdateSerializer,
    ResetPasswordSerializer,
    VerifyEmailSerializer,
)


def _send_account_link(user, purpose: str):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    if purpose == "verify":
        url = f"{settings.FRONTEND_URL}/verify-email?uid={uid}&token={token}"
        subject = "Verify your Proofly email"
    else:
        url = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"
        subject = "Reset your Proofly password"
    send_mail(subject, f"Open this secure link to continue: {url}", settings.DEFAULT_FROM_EMAIL, [user.email])


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — public sign-up for Consumer or Business."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        _send_account_link(user, "verify")
        return Response(UserSerializer(user, context={"request": request}).data, status=status.HTTP_201_CREATED)


class ProofyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds the user object to the login response so the frontend doesn't
    need a second round trip to populate the app shell (avatar, name, role)."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user, context=self.context).data
        return data


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — { email, password } -> { access, refresh, user }."""

    serializer_class = ProofyTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/me/ — Settings > Profile tab."""

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        return UserUpdateSerializer if self.request.method in ("PATCH", "PUT") else UserSerializer


class NotificationPreferencesView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/me/notification-preferences/ — Settings > Profile
    tab's notification toggle rows."""

    serializer_class = NotificationPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """POST /api/auth/me/change-password/ — Settings > Security tab."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated."})


class TwoFactorToggleView(APIView):
    """POST /api/auth/me/two-factor/ — { enabled: bool }."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        enabled = bool(request.data.get("enabled"))
        request.user.two_factor_enabled = enabled
        request.user.save(update_fields=["two_factor_enabled"])
        return Response({"twoFactorEnabled": enabled})


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email__iexact=serializer.validated_data["email"].strip()).first()
        if user:
            _send_account_link(user, "reset")
        return Response({"detail": "If that email is registered, a reset link has been sent."})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(pk=force_str(urlsafe_base64_decode(serializer.validated_data["uid"])))
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            user = None
        if not user or not default_token_generator.check_token(user, serializer.validated_data["token"]):
            return Response({"token": ["This reset link is invalid or has expired."]}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response({"detail": "Password reset successfully."})


class ResendVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email__iexact=serializer.validated_data["email"].strip()).first()
        if user and not user.is_verified:
            _send_account_link(user, "verify")
        return Response({"detail": "If the account needs verification, a new email has been sent."})


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(pk=force_str(urlsafe_base64_decode(serializer.validated_data["uid"])))
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            user = None
        if not user or not default_token_generator.check_token(user, serializer.validated_data["token"]):
            return Response({"token": ["This verification link is invalid or has expired."]}, status=status.HTTP_400_BAD_REQUEST)
        if not user.is_verified:
            user.is_verified = True
            user.save(update_fields=["is_verified"])
        return Response({"detail": "Email verified successfully."})
