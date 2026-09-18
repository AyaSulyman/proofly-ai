from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User
from .serializers import (
    ChangePasswordSerializer,
    NotificationPreferencesSerializer,
    RegisterSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — public sign-up for Consumer or Business."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
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
