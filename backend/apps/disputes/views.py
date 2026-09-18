from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.moderation.utils import log_action
from apps.notifications.utils import notify

from .models import Dispute, DisputeMessage
from .serializers import DisputeDetailSerializer, DisputeListSerializer, DisputeMessageCreateSerializer


def _role_in_dispute(user, dispute: Dispute) -> str | None:
    if dispute.report.reporter_id == user.id:
        return DisputeMessage.REPORTER
    if dispute.business.owner_id == user.id:
        return DisputeMessage.BUSINESS
    return None


class MyDisputesView(generics.ListAPIView):
    """GET /api/disputes/ — visible to both the reporter and the business owner."""

    serializer_class = DisputeListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Dispute.objects.filter(Q(report__reporter=user) | Q(business__owner=user)).distinct()


class DisputeDetailView(generics.RetrieveAPIView):
    """GET /api/disputes/{id}/ — the two-sided thread."""

    serializer_class = DisputeDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Dispute.objects.all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if not (_role_in_dispute(user, obj) or user.is_superuser or user.role_name in ("moderator", "super_admin")):
            raise PermissionDenied("You are not a party to this dispute.")
        return obj


class DisputeMessageCreateView(APIView):
    """POST /api/disputes/{id}/messages/ — either side replies; status flips
    to "awaiting" whichever side didn't just speak."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        dispute = get_object_or_404(Dispute, pk=pk)
        role = _role_in_dispute(request.user, dispute)
        if not role:
            raise PermissionDenied("You are not a party to this dispute.")

        serializer = DisputeMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = DisputeMessage.objects.create(
            dispute=dispute, author=request.user, author_role=role, **serializer.validated_data
        )

        dispute.status = Dispute.AWAITING_CUSTOMER if role == DisputeMessage.BUSINESS else Dispute.AWAITING_BUSINESS
        dispute.save(update_fields=["status"])

        other_user = dispute.business.owner if role == DisputeMessage.REPORTER else dispute.report.reporter
        if other_user:
            notify(
                other_user,
                kind="dispute",
                title="New response on your dispute",
                body=f"{request.user.full_name} responded on dispute #{str(dispute.id)[:8]}.",
            )
        log_action(request.user, "dispute_message_sent", "Dispute", dispute.id)

        return Response(DisputeDetailSerializer(dispute).data, status=status.HTTP_201_CREATED)


class DisputeResolveView(APIView):
    """POST /api/disputes/{id}/resolve/ — "Mark as Resolved" button."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        dispute = get_object_or_404(Dispute, pk=pk)
        if not _role_in_dispute(request.user, dispute):
            raise PermissionDenied("You are not a party to this dispute.")
        dispute.status = Dispute.RESOLVED
        dispute.resolved_at = timezone.now()
        dispute.save(update_fields=["status", "resolved_at"])
        log_action(request.user, "dispute_resolved", "Dispute", dispute.id)
        return Response(DisputeDetailSerializer(dispute).data)
