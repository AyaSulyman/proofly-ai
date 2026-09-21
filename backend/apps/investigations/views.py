from io import BytesIO

from django.db import transaction
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from apps.accounts.permissions import IsOwnerOrModerator
from apps.moderation.utils import log_action
from apps.notifications.utils import notify

from . import ai_client, risk_engine
from .models import AIAnalysisLog, Evidence, EvidenceConnection, Identifier, Investigation
from .serializers import (
    AIAnalysisLogSerializer,
    EvidenceConnectionSerializer,
    EvidenceSerializer,
    IdentifierSerializer,
    InvestigationCreateSerializer,
    InvestigationDetailSerializer,
    InvestigationListSerializer,
)


class InvestigationListCreateView(generics.ListCreateAPIView):
    """GET /api/investigations/ — "My Investigations" list.
    POST /api/investigations/ — Step 1: Subject & Details."""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return InvestigationCreateSerializer if self.request.method == "POST" else InvestigationListSerializer

    def get_queryset(self):
        qs = Investigation.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get("status")
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def perform_create(self, serializer):
        investigation = serializer.save(user=self.request.user)
        # Auto-create an Identifier row for any subject contact details
        # given on the Details step, so search/connections can key off them.
        for type_, value in [
            (Identifier.PHONE, investigation.subject_phone),
            (Identifier.EMAIL, investigation.subject_email),
            (Identifier.URL, investigation.subject_url),
        ]:
            if value:
                Identifier.objects.create(investigation=investigation, type=type_, value=value)
        log_action(self.request.user, "investigation_created", "Investigation", investigation.id)


class InvestigationDetailView(generics.RetrieveUpdateAPIView):
    """GET /api/investigations/{id}/ — Trust Report / read-only detail page."""

    serializer_class = InvestigationDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrModerator]
    queryset = Investigation.objects.all()

    def get_serializer_class(self):
        return InvestigationCreateSerializer if self.request.method in ("PATCH", "PUT") else InvestigationDetailSerializer


class IdentifierListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/investigations/{investigation_id}/identifiers/"""

    serializer_class = IdentifierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Identifier.objects.filter(
            investigation_id=self.kwargs["investigation_id"], investigation__user=self.request.user
        ).order_by("id")

    def perform_create(self, serializer):
        investigation = get_object_or_404(Investigation, pk=self.kwargs["investigation_id"], user=self.request.user)
        serializer.save(investigation=investigation)


class EvidenceListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/investigations/{investigation_id}/evidence/ — Step 2:
    Evidence Upload page (each "Add Screenshot/Image/Document/URL/Note"
    click, plus real file drag-and-drop, posts here)."""

    serializer_class = EvidenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Evidence.objects.filter(investigation_id=self.kwargs["investigation_id"], investigation__user=self.request.user)

    def perform_create(self, serializer):
        investigation = get_object_or_404(Investigation, pk=self.kwargs["investigation_id"], user=self.request.user)
        evidence = serializer.save(investigation=investigation)
        if not evidence.file_name and evidence.file:
            evidence.file_name = evidence.file.name.split("/")[-1]
            evidence.save(update_fields=["file_name"])


class EvidenceDetailView(generics.DestroyAPIView):
    """DELETE /api/investigations/{investigation_id}/evidence/{id}/ — remove
    an evidence row before running analysis."""

    serializer_class = EvidenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Evidence.objects.filter(
            investigation_id=self.kwargs["investigation_id"], investigation__user=self.request.user
        )


class IdentifierDetailView(generics.DestroyAPIView):
    serializer_class = IdentifierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Identifier.objects.filter(
            investigation_id=self.kwargs["investigation_id"], investigation__user=self.request.user
        )


class InvestigationPdfView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, investigation_id):
        investigation = get_object_or_404(Investigation, pk=investigation_id, user=request.user)
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        y = 750
        lines = [
            "Proofly Investigation Report", investigation.title,
            f"Status: {investigation.get_status_display()}",
            f"Subject: {investigation.get_subject_type_display()}",
            f"Risk: {investigation.risk_level or 'Not assessed'} ({investigation.risk_score if investigation.risk_score is not None else 'N/A'})",
            "", "Summary:", investigation.summary or "No summary available.", "", "Identifiers:",
            *[f"- {item.get_type_display()}: {item.value}" for item in investigation.identifiers.all()],
        ]
        for line in lines:
            for wrapped in [line[i:i + 90] for i in range(0, max(len(line), 1), 90)]:
                pdf.drawString(54, y, wrapped)
                y -= 16
                if y < 54:
                    pdf.showPage()
                    y = 750
        pdf.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f"proofly-{investigation.id}.pdf")


class RunAIReviewView(APIView):
    """POST /api/investigations/{id}/ai-review/ — Step 3: "Confirm All &
    Run Analysis". Runs AI extraction on each evidence item and returns the
    extracted fields for the person to confirm/edit, WITHOUT yet computing
    the risk score (that happens in /analyze/ once they confirm)."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, investigation_id):
        investigation = get_object_or_404(Investigation, id=investigation_id, user=request.user)
        results = []
        for evidence in investigation.evidence.all():
            extraction = ai_client.extract_evidence(evidence)
            evidence.extracted_data = extraction.get("extractedData", {})
            evidence.save(update_fields=["extracted_data"])
            AIAnalysisLog.objects.create(
                investigation=investigation,
                evidence=evidence,
                feature_type=AIAnalysisLog.EXTRACTION,
                model_used="proofly-ai-service" if extraction else "local-fallback",
                response_payload=extraction,
            )
            results.append(EvidenceSerializer(evidence, context={"request": request}).data)
        return Response({"evidence": results})


class AnalyzeInvestigationView(APIView):
    """POST /api/investigations/{id}/analyze/ — the "Processing" step.
    Runs risk-language analysis, finds connections to other investigations,
    computes the deterministic risk score, generates a summary, and marks
    the investigation completed. This is the single endpoint the frontend's
    processing screen polls/awaits before redirecting to the trust report."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, investigation_id):
        investigation = get_object_or_404(Investigation, id=investigation_id, user=request.user)
        investigation.status = Investigation.ANALYZING
        investigation.save(update_fields=["status"])

        # 1. Risk language detection across notes + evidence text.
        candidate_keys = ai_client.analyze_investigation_text(investigation)
        AIAnalysisLog.objects.create(
            investigation=investigation,
            feature_type=AIAnalysisLog.LANGUAGE_ANALYSIS,
            response_payload={"candidateSignalKeys": candidate_keys},
        )

        # 2. Cross-investigation connections via shared identifiers.
        matches = ai_client.find_similar_investigations(investigation)
        for match in matches:
            EvidenceConnection.objects.get_or_create(
                identifier=match["identifier"],
                investigation=match["other_investigation"],
                defaults={
                    "connection_type": EvidenceConnection.AI_SUGGESTED,
                    "confidence_score": match["confidence"],
                    "status": EvidenceConnection.PENDING,
                },
            )
        AIAnalysisLog.objects.create(
            investigation=investigation,
            feature_type=AIAnalysisLog.SIMILARITY,
            response_payload={"matchCount": len(matches)},
        )

        # 3. Deterministic risk scoring (never decided by the AI itself).
        result = risk_engine.compute_risk(investigation, candidate_keys)

        # 4. Human-readable summary.
        investigation.summary = ai_client.summarize_investigation(investigation)
        investigation.status = Investigation.COMPLETED
        investigation.save(update_fields=["summary", "status"])
        AIAnalysisLog.objects.create(
            investigation=investigation,
            feature_type=AIAnalysisLog.SUMMARY,
            response_payload={"summary": investigation.summary},
        )

        log_action(request.user, "investigation_analyzed", "Investigation", investigation.id)
        notify(
            request.user,
            kind="investigation",
            title=(
                f"High risk detected — {investigation.title}" if result.level == "high"
                else f"Investigation completed — {investigation.title}"
            ),
            body=f"Your investigation completed with a risk score of {result.score}/100. Review the full report.",
            related_entity_type="Investigation",
            related_entity_id=investigation.id,
        )

        return Response(
            InvestigationDetailSerializer(investigation, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )


class EvidenceGraphView(generics.ListAPIView):
    """GET /api/investigations/{id}/graph/ — Evidence Relationship Graph tab."""

    serializer_class = EvidenceConnectionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrModerator]

    def get_queryset(self):
        user = self.request.user
        qs = EvidenceConnection.objects.filter(identifier__investigation_id=self.kwargs["investigation_id"])
        if user.is_superuser or user.role_name in ("moderator", "super_admin"):
            return qs
        return qs.filter(identifier__investigation__user=user)
