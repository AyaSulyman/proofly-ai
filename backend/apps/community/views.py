from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from apps.investigations.models import Investigation
from apps.moderation.utils import log_action
from apps.notifications.utils import notify

from .models import CommunityReport, Review
from .serializers import (
    CommunityReportCreateSerializer,
    CommunityReportDecisionSerializer,
    CommunityReportSerializer,
    MyReviewSerializer,
)


class MyReportsView(generics.ListCreateAPIView):
    """GET/POST /api/community/reports/ — "My Reports" list + "Submit Report" form."""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return CommunityReportCreateSerializer if self.request.method == "POST" else CommunityReportSerializer

    def get_queryset(self):
        return CommunityReport.objects.filter(reporter=self.request.user)

    def perform_create(self, serializer):
        investigation = serializer.validated_data["investigation"]
        if investigation.user_id != self.request.user.id:
            raise PermissionDenied("You can only report from your own investigation.")
        report = serializer.save(reporter=self.request.user)
        log_action(self.request.user, "report_submitted", "CommunityReport", report.id)


class ReportDetailView(generics.RetrieveAPIView):
    serializer_class = CommunityReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = CommunityReport.objects.all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user

        is_moderator = (
            user.is_superuser
            or user.role_name in ("moderator", "super_admin")
        )

        if obj.reporter_id != user.id and not is_moderator:
            raise PermissionDenied(
                "You can only view your own reports."
            )

        return obj


class ReportDecisionView(generics.UpdateAPIView):
    """PATCH /api/community/reports/{id}/decision/ — moderator approve/reject.
    See apps.moderation for the moderator-facing queue view of this same data."""

    serializer_class = CommunityReportDecisionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = CommunityReport.objects.all()

    def perform_update(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role_name in ("moderator", "super_admin")):
            raise PermissionDenied("Only moderators can decide on reports.")
        report = serializer.save(moderator=user, reviewed_at=timezone.now())
        log_action(user, f"report_{report.status}", "CommunityReport", report.id)
        notify(
            report.reporter,
            kind="report",
            title=f"Report {report.status}",
            body=f"Your report on {report.investigation.title} was {report.status}.",
        )


class MyReviewsView(generics.ListAPIView):
    """GET /api/community/reviews/mine/ — Reviews page 'My Reviews' panel."""

    serializer_class = MyReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(reviewer=self.request.user)
