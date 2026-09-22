from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import Role, User
from .models import Business


class BusinessSearchAndReviewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        role = Role.objects.create(name=Role.CONSUMER)
        self.user = User.objects.create_user("user@example.com", "Password123!", full_name="User", role=role)
        self.company = Business.objects.create(name="TechWorld", website="techworld.test", phone="123", email="hi@tech.test", category="Electronics", location="Sidon", is_individual=False)
        self.seller = Business.objects.create(name="Maya Seller", category="Design", is_individual=True)

    def test_combined_search_filters(self):
        response = self.client.get("/api/businesses/?q=techworld&type=website")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(str(response.data["results"][0]["id"]), str(self.company.id))
        self.assertEqual(self.client.get("/api/businesses/?q=maya&type=business").data["count"], 0)
        self.assertEqual(self.client.get("/api/businesses/?q=%20SIDON%20").data["count"], 1)

    def test_review_requires_authentication(self):
        url = f"/api/businesses/{self.company.id}/reviews/"
        self.assertEqual(self.client.post(url, {"rating": 5, "comment": "Great"}, format="json").status_code, 401)
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.post(url, {"rating": 5, "comment": "Great"}, format="json").status_code, 201)
