from rest_framework.permissions import BasePermission, SAFE_METHODS

from apps.accounts.models import Role


class IsConsumer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role_name == Role.CONSUMER)


class IsBusinessOwner(BasePermission):
    """Allows access to users with the 'business' role. Object-level checks
    (does this user own *this* business) live on the relevant view."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role_name == Role.BUSINESS)


class IsModerator(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.role_name in (Role.MODERATOR, Role.SUPER_ADMIN) or user.is_superuser)
        )


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and (user.role_name == Role.SUPER_ADMIN or user.is_superuser))


class IsOwnerOrModerator(BasePermission):
    """Object-level: the request.user must own the object (via `.user` or
    `.owner` attribute) or be a moderator/admin. Used for investigations,
    reports, disputes — things a consumer creates but a moderator can
    still review."""

    owner_field = "user"

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.role_name in (Role.MODERATOR, Role.SUPER_ADMIN):
            return True
        owner = getattr(obj, self.owner_field, None)
        return owner == user


class ReadOnlyOrModerator(BasePermission):
    """GET is open to anyone; writes require moderator/admin. Used for
    endpoints like business verification decisions."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and (user.role_name in (Role.MODERATOR, Role.SUPER_ADMIN) or user.is_superuser))
