from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import Role, User
from .models import Evidence, Identifier, Investigation


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
