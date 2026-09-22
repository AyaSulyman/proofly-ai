from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import Role, User
from . import ai_client
from .models import AIAnalysisLog, Evidence, Identifier, Investigation
from .website_analyzer import normalize_public_url


class InvestigationOwnershipTests(TestCase):
    def setUp(self):
        role = Role.objects.create(name=Role.CONSUMER)
        self.owner = User.objects.create_user("owner@example.com", "Password123!", full_name="Owner", role=role)
        self.other = User.objects.create_user("other@example.com", "Password123!", full_name="Other", role=role)
        self.investigation = Investigation.objects.create(user=self.owner, title="Private", subject_type="seller")
        self.identifier = Identifier.objects.create(investigation=self.investigation, type="email", value="private@example.com")
        self.evidence = Evidence.objects.create(investigation=self.investigation, type="text", text_value="private")
        self.client = APIClient()
        self.client.force_authenticate(self.other)

    def test_nested_resources_cannot_be_read_created_or_deleted_by_other_user(self):
        base = f"/api/investigations/{self.investigation.id}"
        self.assertEqual(self.client.get(base + "/identifiers/").data["count"], 0)
        self.assertEqual(self.client.post(base + "/identifiers/", {"type": "phone", "value": "123"}, format="json").status_code, 404)
        self.assertEqual(self.client.delete(base + f"/evidence/{self.evidence.id}/").status_code, 404)
        self.assertTrue(Evidence.objects.filter(pk=self.evidence.id).exists())

    def test_owner_can_download_pdf(self):
        self.client.force_authenticate(self.owner)
        response = self.client.get(f"/api/investigations/{self.investigation.id}/pdf/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/pdf")


class InvestigationReanalysisTests(TestCase):
    def setUp(self):
        role = Role.objects.create(name=Role.CONSUMER)
        self.user = User.objects.create_user("analyst@example.com", "Password123!", full_name="Analyst", role=role)
        self.investigation = Investigation.objects.create(
            user=self.user, title="Global seller", subject_type="business", notes="Pay upfront outside the platform"
        )
        self.evidence = Evidence.objects.create(investigation=self.investigation, type="text", text_value="Pay upfront")
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.analysis_patch = patch(
            "apps.investigations.ai_client.analyze_investigation_text",
            side_effect=lambda investigation, website_snapshot=None: (
                ["advance_payment_requested", "off_platform_request"]
                if "upfront" in investigation.notes.lower()
                else [],
                "openai:gpt-5.6-luna",
            ),
        )
        self.summary_patch = patch(
            "apps.investigations.ai_client.summarize_investigation",
            return_value="AI-generated neutral evidence summary.",
        )
        self.analysis_patch.start()
        self.summary_patch.start()
        self.addCleanup(self.analysis_patch.stop)
        self.addCleanup(self.summary_patch.stop)

    def test_new_evidence_marks_completed_analysis_stale_and_score_can_decrease(self):
        endpoint = f"/api/investigations/{self.investigation.id}/analyze/"
        first = self.client.post(endpoint, {}, format="json")
        self.assertEqual(first.status_code, 200)
        first_score = first.data["risk_score"]
        self.assertEqual(first.data["analysis_version"], 1)

        self.client.delete(f"/api/investigations/{self.investigation.id}/evidence/{self.evidence.id}/")
        self.investigation.notes = "ordinary business conversation"
        self.investigation.save(update_fields=["notes"])
        self.investigation.refresh_from_db()
        self.assertTrue(self.investigation.needs_reanalysis)

        second = self.client.post(endpoint, {}, format="json")
        self.assertEqual(second.status_code, 200)
        self.assertLess(second.data["risk_score"], first_score)
        self.assertEqual(second.data["analysis_version"], 2)
        self.assertEqual(len(second.data["analysis_history"]), 2)

    def test_ai_provider_failure_is_visible_and_does_not_create_fake_analysis(self):
        self.analysis_patch.stop()
        with patch(
            "apps.investigations.ai_client.analyze_investigation_text",
            side_effect=ai_client.AIProviderError(
                "AI quota unavailable.", 503, "credit_balance_exhausted"
            ),
        ):
            response = self.client.post(
                f"/api/investigations/{self.investigation.id}/analyze/",
                {},
                format="json",
            )
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.data["code"], "credit_balance_exhausted")
        self.investigation.refresh_from_db()
        self.assertEqual(self.investigation.analysis_version, 0)
        self.assertEqual(self.investigation.status, Investigation.DRAFT)

    def test_ai_review_records_the_real_provider(self):
        extraction = {
            "extractedData": {"paymentRequest": "Pay upfront"},
            "candidateSignalKeys": ["advance_payment_requested"],
        }
        with patch("apps.investigations.ai_client.extract_evidence", return_value=extraction):
            response = self.client.post(
                f"/api/investigations/{self.investigation.id}/ai-review/",
                {},
                format="json",
            )
            repeated = self.client.post(
                f"/api/investigations/{self.investigation.id}/ai-review/",
                {},
                format="json",
            )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(repeated.status_code, 200)
        log = AIAnalysisLog.objects.get(feature_type=AIAnalysisLog.EXTRACTION)
        self.assertEqual(log.model_used, "openai:gpt-5.6-luna")
        self.evidence.refresh_from_db()
        self.assertEqual(self.evidence.analysis_provider, "openai:gpt-5.6-luna")

    def test_website_url_normalization_rejects_credentials_and_non_http_schemes(self):
        self.assertEqual(normalize_public_url("example.com"), "https://example.com")
        with self.assertRaises(ValueError):
            normalize_public_url("file:///etc/passwd")
        with self.assertRaises(ValueError):
            normalize_public_url("https://user:secret@example.com")
