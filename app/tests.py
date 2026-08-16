from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse


class AuthFlowTests(TestCase):
    def test_signup_creates_profile_and_logs_user_in(self):
        response = self.client.post(
            reverse("signup"),
            {
                "username": "alice",
                "email": "alice@example.com",
                "password1": "StrongPass123!",
                "password2": "StrongPass123!",
            },
            follow=True,
        )

        self.assertEqual(response.status_code, 200)
        user = get_user_model().objects.get(username="alice")
        self.assertTrue(user.is_authenticated)
        self.assertTrue(hasattr(user, "profile"))

    def test_login_works_for_registered_user(self):
        user = get_user_model().objects.create_user(
            username="bob",
            email="bob@example.com",
            password="StrongPass123!",
        )
        user.profile.save()

        response = self.client.post(
            reverse("login"),
            {"username": "bob", "password": "StrongPass123!"},
            follow=True,
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.wsgi_request.user.is_authenticated)
