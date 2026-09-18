from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsModerator
from apps.businesses.models import Business, BusinessVerification
from apps.community.models import CommunityReport
from apps.investigations.models import EvidenceConnection
from apps.notifications.utils import notify

from .models import AuditLog
from .serializers import (
    AuditLogSerializer,
    ModeratorConnectionSerializer,
    ModeratorReportSerializer,
    ModeratorVerificationSerializer,
)
from .utils import log_action


class PendingReportsQueueView(generics.ListAPIView):
    """GET /api/moderation/reports/ — Moderator > Pending Reports Queue."""

    serializer_class = ModeratorReportSerializer
    permission_classes = [IsModerator]
    queryset = CommunityReport.objects.filter(status=CommunityReport.PENDING)


class PendingVerificationsQueueView(generics.ListAPIView):
    """GET /api/moderation/verifications/ — Moderator > Verification Requests Queue."""

    serializer_class = ModeratorVerificationSerializer
    permission_classes = [IsModerator]
    queryset = BusinessVerification.objects.filter(status=BusinessVerification.PENDING)


class VerificationDecisionView(APIView):
    """POST /api/moderation/verifications/{id}/decision/ — { approve: bool }"""

    permission_classes = [IsModerator]

    def post(self, request, pk):
        verification = get_object_or_404(BusinessVerification, pk=pk)
        approve = bool(request.data.get("approve"))
        verification.status = BusinessVerification.APPROVED if approve else BusinessVerification.REJECTED
        verification.reviewed_by = request.user
        verification.reviewed_at = timezone.now()
        verification.save()

        verification.business.verification_status = Business.VERIFIED if approve else Business.NEEDS_INFO
        verification.business.save(update_fields=["verification_status"])

        log_action(request.user, f"verification_{verification.status}", "BusinessVerification", verification.id)
        if verification.business.owner:
            notify(
                verification.business.owner,
                kind="system",
                title=f"Verification {verification.status}",
                body=f"{verification.business.name} verification was {verification.status}.",
            )
        return Response(ModeratorVerificationSerializer(verification).data)


class PendingConnectionsQueueView(generics.ListAPIView):
    """GET /api/moderation/connections/ — Moderator > AI-Suggested Connections Queue."""

    serializer_class = ModeratorConnectionSerializer
    permission_classes = [IsModerator]
    queryset = EvidenceConnection.objects.filter(status=EvidenceConnection.PENDING)


class ConnectionDecisionView(APIView):
    """POST /api/moderation/connections/{id}/decision/ — { confirm: bool }"""

    permission_classes = [IsModerator]

    def post(self, request, pk):
        connection = get_object_or_404(EvidenceConnection, pk=pk)
        confirm = bool(request.data.get("confirm"))
        connection.status = EvidenceConnection.CONFIRMED if confirm else EvidenceConnection.REJECTED
        connection.connection_type = EvidenceConnection.MODERATOR_CONFIRMED if confirm else connection.connection_type
        connection.reviewed_by = request.user
        connection.save()
        log_action(request.user, f"connection_{connection.status}", "EvidenceConnection", connection.id)
        return Response(ModeratorConnectionSerializer(connection).data)


class AuditLogListView(generics.ListAPIView):
    """GET /api/moderation/audit-log/"""

    serializer_class = AuditLogSerializer
    permission_classes = [IsModerator]
    queryset = AuditLog.objects.all()
