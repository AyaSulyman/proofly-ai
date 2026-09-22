import uuid

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class Role(models.Model):
    """ERD entity: ROLE. Drives RBAC across the whole platform."""

    CONSUMER = "consumer"
    BUSINESS = "business"
    MODERATOR = "moderator"
    SUPER_ADMIN = "super_admin"

    NAME_CHOICES = [
        (CONSUMER, "Consumer"),
        (BUSINESS, "Business"),
        (MODERATOR, "Moderator"),
        (SUPER_ADMIN, "Super Admin"),
    ]

    name = models.CharField(max_length=32, choices=NAME_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()


class Permission(models.Model):
    """ERD entity: PERMISSION."""

    code = models.CharField(max_length=64, unique=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.code


class RolePermission(models.Model):
    """ERD entity: ROLE_PERMISSION (junction table for RBAC)."""

    role = models.ForeignKey(Role, related_name="role_permissions", on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, related_name="role_permissions", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("role", "permission")


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_verified", True)
        if not extra_fields.get("role"):
            role, _ = Role.objects.get_or_create(name=Role.SUPER_ADMIN)
            extra_fields["role"] = role
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """ERD entity: USER."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=32, blank=True)
    location = models.CharField(max_length=150, blank=True)
    role = models.ForeignKey(Role, related_name="users", on_delete=models.PROTECT, null=True)
    image = models.ImageField(upload_to="avatars/", null=True, blank=True)

    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Notification preferences (flattened for simplicity; a dedicated
    # NotificationPreference model would be the next step if these grow).
    notify_investigation_completed = models.BooleanField(default=True)
    notify_report_status = models.BooleanField(default=True)
    notify_dispute_activity = models.BooleanField(default=True)
    notify_new_connections = models.BooleanField(default=False)
    two_factor_enabled = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email

    @property
    def role_name(self):
        return self.role.name if self.role else None

    def has_permission(self, code: str) -> bool:
        if self.is_superuser:
            return True
        if not self.role:
            return False
        return RolePermission.objects.filter(role=self.role, permission__code=code).exists()
