from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Permission, Role, RolePermission, User


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ["id", "code", "description"]
    search_fields = ["code"]


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ["id", "role", "permission"]
    list_filter = ["role"]


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    ordering = ["-created_at"]
    list_display = ["email", "full_name", "role", "is_verified", "is_active", "is_staff", "created_at"]
    list_filter = ["role", "is_verified", "is_active", "is_staff"]
    search_fields = ["email", "full_name"]
    readonly_fields = ["id", "created_at", "updated_at"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("full_name", "phone", "location", "image", "role")}),
        (
            "Status",
            {
                "fields": (
                    "is_verified",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "two_factor_enabled",
                )
            },
        ),
        (
            "Notification preferences",
            {
                "fields": (
                    "notify_investigation_completed",
                    "notify_report_status",
                    "notify_dispute_activity",
                    "notify_new_connections",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "full_name", "role", "password1", "password2"),
            },
        ),
    )
