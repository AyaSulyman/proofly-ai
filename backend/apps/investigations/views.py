from io import BytesIO

import requests
from django.db import transaction
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsOwnerOrModerator
from apps.moderation.utils import log_action
from apps.notifications.utils import notify

from . import ai_client, risk_engine
from .models import (
    AIAnalysisLog,
    AnalysisSnapshot,
    Evidence,
    EvidenceConnection,
    Identifier,
    Investigation,
)
from .serializers import (
    EvidenceConnectionSerializer,
    EvidenceSerializer,
    IdentifierSerializer,
    InvestigationCreateSerializer,
    InvestigationDetailSerializer,
    InvestigationListSerializer,
)
from .website_analyzer import inspect_website


class InvestigationListCreateView(generics.ListCreateAPIView):
    """List the authenticated user's investigations or create one."""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return InvestigationCreateSerializer

        return InvestigationListSerializer

    def get_queryset(self):
        queryset = Investigation.objects.filter(
            user=self.request.user,
        )

        status_param = self.request.query_params.get("status")

        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset.order_by("-created_at")

    def perform_create(self, serializer):
        investigation = serializer.save(user=self.request.user)

        # Store subject contact details as identifiers so Proofly can detect
        # relationships between investigations.
        identifiers = [
            (Identifier.PHONE, investigation.subject_phone),
            (Identifier.EMAIL, investigation.subject_email),
            (Identifier.URL, investigation.subject_url),
        ]

        for identifier_type, value in identifiers:
            value = (value or "").strip()

            if value:
                Identifier.objects.get_or_create(
                    investigation=investigation,
                    type=identifier_type,
                    value=value,
                )

        log_action(
            self.request.user,
            "investigation_created",
            "Investigation",
            investigation.id,
        )


class InvestigationDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve or update an investigation owned by the current user."""

    serializer_class = InvestigationDetailSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrModerator,
    ]
    queryset = Investigation.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PATCH", "PUT"):
            return InvestigationCreateSerializer

        return InvestigationDetailSerializer

    def perform_update(self, serializer):
        serializer.save(needs_reanalysis=True)


class IdentifierListCreateView(generics.ListCreateAPIView):
    """List or add identifiers belonging to an investigation."""

    serializer_class = IdentifierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Identifier.objects.filter(
            investigation_id=self.kwargs["investigation_id"],
            investigation__user=self.request.user,
        ).order_by("id")

    def perform_create(self, serializer):
        investigation = get_object_or_404(
            Investigation,
            pk=self.kwargs["investigation_id"],
            user=self.request.user,
        )

        serializer.save(investigation=investigation)

        Investigation.objects.filter(
            pk=investigation.pk,
        ).update(
            needs_reanalysis=investigation.analysis_version > 0,
        )


class EvidenceListCreateView(generics.ListCreateAPIView):
    """List or add evidence belonging to an investigation."""

    serializer_class = EvidenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Evidence.objects.filter(
            investigation_id=self.kwargs["investigation_id"],
            investigation__user=self.request.user,
        ).order_by("uploaded_at")

    def perform_create(self, serializer):
        investigation = get_object_or_404(
            Investigation,
            pk=self.kwargs["investigation_id"],
            user=self.request.user,
        )

        evidence = serializer.save(investigation=investigation)

        if not evidence.file_name and evidence.file:
            evidence.file_name = evidence.file.name.split("/")[-1]
            evidence.save(update_fields=["file_name"])

        Investigation.objects.filter(
            pk=investigation.pk,
        ).update(
            needs_reanalysis=investigation.analysis_version > 0,
        )


class EvidenceDetailView(generics.DestroyAPIView):
    """Delete evidence only when it belongs to the authenticated user."""

    serializer_class = EvidenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Evidence.objects.filter(
            investigation_id=self.kwargs["investigation_id"],
            investigation__user=self.request.user,
        )

    def perform_destroy(self, instance):
        investigation_id = instance.investigation_id

        super().perform_destroy(instance)

        Investigation.objects.filter(
            pk=investigation_id,
            analysis_version__gt=0,
        ).update(needs_reanalysis=True)


class IdentifierDetailView(generics.DestroyAPIView):
    """Delete an identifier only when its investigation belongs to the user."""

    serializer_class = IdentifierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Identifier.objects.filter(
            investigation_id=self.kwargs["investigation_id"],
            investigation__user=self.request.user,
        )

    def perform_destroy(self, instance):
        investigation_id = instance.investigation_id

        super().perform_destroy(instance)

        Investigation.objects.filter(
            pk=investigation_id,
            analysis_version__gt=0,
        ).update(needs_reanalysis=True)


class InvestigationPdfView(APIView):
    """Download an authenticated user's investigation report as a PDF."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, investigation_id):
        investigation = get_object_or_404(
            Investigation,
            pk=investigation_id,
            user=request.user,
        )

        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        y = 750

        risk_score = (
            investigation.risk_score
            if investigation.risk_score is not None
            else "N/A"
        )

        lines = [
            "Proofly Investigation Report",
            investigation.title,
            f"Status: {investigation.get_status_display()}",
            f"Subject: {investigation.get_subject_type_display()}",
            (
                f"Risk: {investigation.risk_level or 'Not assessed'} "
                f"({risk_score})"
            ),
            "",
            "Summary:",
            investigation.summary or "No summary available.",
            "",
            "Identifiers:",
            *[
                f"- {item.get_type_display()}: {item.value}"
                for item in investigation.identifiers.all()
            ],
        ]

        for line in lines:
            wrapped_lines = [
                line[index:index + 90]
                for index in range(0, max(len(line), 1), 90)
            ]

            for wrapped_line in wrapped_lines:
                pdf.drawString(54, y, wrapped_line)
                y -= 16

                if y < 54:
                    pdf.showPage()
                    y = 750

        pdf.save()
        buffer.seek(0)

        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f"proofly-{investigation.id}.pdf",
        )


class RunAIReviewView(APIView):
    """Extract structured information from every evidence item.

    This step performs AI extraction but does not calculate the final score.
    Scoring happens after the user confirms the review and calls /analyze/.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, investigation_id):
        investigation = get_object_or_404(
            Investigation,
            id=investigation_id,
            user=request.user,
        )

        try:
            with transaction.atomic():
                results = []

                for evidence in investigation.evidence.all():
                    # Reuse analysis only when the evidence was analyzed using
                    # the currently configured model.
                    if (
                        evidence.analysis_provider
                        == ai_client.provider_label()
                        and evidence.analyzed_at
                    ):
                        results.append(
                            EvidenceSerializer(
                                evidence,
                                context={"request": request},
                            ).data
                        )
                        continue

                    extraction = ai_client.extract_evidence(evidence)

                    evidence.extracted_data = extraction.get(
                        "extractedData",
                        {},
                    )
                    evidence.analysis_provider = ai_client.provider_label()
                    evidence.analyzed_at = timezone.now()
                    evidence.save(
                        update_fields=[
                            "extracted_data",
                            "analysis_provider",
                            "analyzed_at",
                        ]
                    )

                    AIAnalysisLog.objects.create(
                        investigation=investigation,
                        evidence=evidence,
                        feature_type=AIAnalysisLog.EXTRACTION,
                        model_used=ai_client.provider_label(),
                        response_payload=extraction,
                    )

                    results.append(
                        EvidenceSerializer(
                            evidence,
                            context={"request": request},
                        ).data
                    )

        except ai_client.AIProviderError as exc:
            return Response(
                {
                    "detail": str(exc),
                    "code": exc.code,
                },
                status=exc.status_code,
            )

        return Response({"evidence": results})


class AnalyzeInvestigationView(APIView):
    """Analyze evidence, inspect websites and calculate a risk report."""

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, investigation_id):
        investigation = get_object_or_404(
            Investigation,
            id=investigation_id,
            user=request.user,
        )

        investigation.status = Investigation.ANALYZING
        investigation.save(update_fields=["status"])

        website_warning = ""
        website_keys = []

        # Prefer the main subject URL. If it was not supplied during the
        # first step, inspect the most recently submitted URL evidence.
        website_url = (investigation.subject_url or "").strip()

        if not website_url:
            url_evidence = (
                investigation.evidence
                .filter(type="url")
                .exclude(text_value="")
                .order_by("-uploaded_at")
                .first()
            )

            if url_evidence:
                website_url = url_evidence.text_value.strip()

        if website_url:
            try:
                snapshot, website_keys = inspect_website(website_url)

                snapshot["reachable"] = True
                snapshot["scanStatus"] = "completed"

                investigation.website_snapshot = snapshot

            except requests.Timeout as exc:
                website_warning = str(exc)

                investigation.website_snapshot = {
                    "requestedUrl": website_url,
                    "reachable": None,
                    "scanStatus": "inconclusive",
                    "error": (
                        "The automated website inspection timed out. "
                        "This does not mean the website is unavailable."
                    ),
                }

                website_keys.append(
                    "website_scan_inconclusive"
                )

            except ValueError as exc:
                website_warning = str(exc)

                if "could not be resolved" in website_warning.lower():
                    scan_status = "unresolved"
                    reachable = False
                    website_keys.append("website_unreachable")
                else:
                    scan_status = "inconclusive"
                    reachable = None
                    website_keys.append(
                        "website_scan_inconclusive"
                    )

                investigation.website_snapshot = {
                    "requestedUrl": website_url,
                    "reachable": reachable,
                    "scanStatus": scan_status,
                    "error": website_warning,
                }

            except requests.RequestException as exc:
                website_warning = str(exc)

                investigation.website_snapshot = {
                    "requestedUrl": website_url,
                    "reachable": None,
                    "scanStatus": "inconclusive",
                    "error": (
                        "The automated website inspection could not "
                        "complete its request. This does not prove that "
                        "the website is unavailable."
                    ),
                }

                website_keys.append(
                    "website_scan_inconclusive"
                )

        else:
            investigation.website_snapshot = {}

        # Ask the configured model to classify the complete evidence packet.
        try:
            candidate_keys, provider = (
                ai_client.analyze_investigation_text(
                    investigation,
                    investigation.website_snapshot,
                )
            )

        except ai_client.AIProviderError as exc:
            transaction.set_rollback(True)

            return Response(
                {
                    "detail": str(exc),
                    "code": exc.code,
                },
                status=exc.status_code,
            )

        # Include candidate keys produced while extracting individual
        # evidence items.
        extraction_payloads = investigation.ai_logs.filter(
            feature_type=AIAnalysisLog.EXTRACTION,
        ).values_list(
            "response_payload",
            flat=True,
        )

        for extraction in extraction_payloads:
            if isinstance(extraction, dict):
                candidate_keys.extend(
                    extraction.get(
                        "candidateSignalKeys",
                        [],
                    )
                )

        # Include deterministic signals from the website scanner.
        candidate_keys.extend(website_keys)

        # Preserve order while removing duplicate keys.
        candidate_keys = list(dict.fromkeys(candidate_keys))

        AIAnalysisLog.objects.create(
            investigation=investigation,
            feature_type=AIAnalysisLog.LANGUAGE_ANALYSIS,
            model_used=provider,
            response_payload={
                "candidateSignalKeys": candidate_keys,
                "websiteWarning": website_warning,
                "websiteSnapshot": investigation.website_snapshot,
            },
        )

        # Find shared identifiers. Relationships begin as pending and do not
        # add points until confirmed.
        matches = ai_client.find_similar_investigations(
            investigation
        )

        for match in matches:
            EvidenceConnection.objects.get_or_create(
                identifier=match["identifier"],
                investigation=match["other_investigation"],
                defaults={
                    "connection_type": (
                        EvidenceConnection.AI_SUGGESTED
                    ),
                    "confidence_score": match["confidence"],
                    "status": EvidenceConnection.PENDING,
                },
            )

        AIAnalysisLog.objects.create(
            investigation=investigation,
            feature_type=AIAnalysisLog.SIMILARITY,
            response_payload={
                "matchCount": len(matches),
            },
        )

        # Calculate the deterministic score.
        result = risk_engine.compute_risk(
            investigation,
            candidate_keys,
        )

        # Generate a human-readable, evidence-grounded explanation.
        try:
            investigation.summary = (
                ai_client.summarize_investigation(
                    investigation
                )
            )

        except ai_client.AIProviderError as exc:
            transaction.set_rollback(True)

            return Response(
                {
                    "detail": str(exc),
                    "code": exc.code,
                },
                status=exc.status_code,
            )

        investigation.status = Investigation.COMPLETED
        investigation.analysis_version += 1
        investigation.last_analyzed_at = timezone.now()
        investigation.analysis_provider = provider
        investigation.needs_reanalysis = False

        investigation.save(
            update_fields=[
                "summary",
                "status",
                "analysis_version",
                "last_analyzed_at",
                "analysis_provider",
                "needs_reanalysis",
                "website_snapshot",
            ]
        )

        AnalysisSnapshot.objects.create(
            investigation=investigation,
            version=investigation.analysis_version,
            risk_score=result.score,
            risk_level=result.level,
            summary=investigation.summary,
            signal_count=investigation.risk_signals.count(),
            evidence_count=investigation.evidence.count(),
            provider=provider,
        )

        AIAnalysisLog.objects.create(
            investigation=investigation,
            feature_type=AIAnalysisLog.SUMMARY,
            model_used=provider,
            response_payload={
                "summary": investigation.summary,
            },
        )

        log_action(
            request.user,
            "investigation_analyzed",
            "Investigation",
            investigation.id,
        )

        notification_title = (
            f"High risk detected — {investigation.title}"
            if result.level == Investigation.HIGH
            else f"Investigation completed — {investigation.title}"
        )

        notify(
            request.user,
            kind="investigation",
            title=notification_title,
            body=(
                "Your investigation completed with a risk score "
                f"of {result.score}/100. Review the full report."
            ),
            related_entity_type="Investigation",
            related_entity_id=investigation.id,
        )

        return Response(
            InvestigationDetailSerializer(
                investigation,
                context={"request": request},
            ).data,
            status=status.HTTP_200_OK,
        )


class EvidenceGraphView(generics.ListAPIView):
    """Return relationship graph data visible to authorized users."""

    serializer_class = EvidenceConnectionSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrModerator,
    ]

    def get_queryset(self):
        user = self.request.user

        queryset = EvidenceConnection.objects.filter(
            identifier__investigation_id=(
                self.kwargs["investigation_id"]
            )
        )

        if (
            user.is_superuser
            or user.role_name in ("moderator", "super_admin")
        ):
            return queryset.order_by("-created_at")

        return queryset.filter(
            identifier__investigation__user=user,
        ).order_by("-created_at")