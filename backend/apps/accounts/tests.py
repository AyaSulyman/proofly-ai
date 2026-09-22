from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.test import TestCase
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient

from .models import Role, User


class AuthenticationFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_accepts_camel_case_and_login(self):
        response = self.client.post("/api/auth/register/", {"fullName": "Aya Test", "email": "aya@example.com", "password": "StrongPass123!", "confirmPassword": "StrongPass123!", "role": "consumer"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.get().full_name, "Aya Test")
        self.assertEqual(len(mail.outbox), 1)
        login = self.client.post("/api/auth/login/", {"email": "aya@example.com", "password": "StrongPass123!"}, format="json")
        self.assertEqual(login.status_code, 200)
        self.assertIn("access", login.data)

    def test_password_reset_token_is_secure_and_single_use(self):
        role = Role.objects.create(name=Role.CONSUMER)
        user = User.objects.create_user("reset@example.com", "OldPass123!", full_name="Reset User", role=role)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        payload = {"uid": uid, "token": token, "newPassword": "NewPass123!", "confirmPassword": "NewPass123!"}
        self.assertEqual(self.client.post("/api/auth/reset-password/", payload, format="json").status_code, 200)
        self.assertEqual(self.client.post("/api/auth/reset-password/", payload, format="json").status_code, 400)
