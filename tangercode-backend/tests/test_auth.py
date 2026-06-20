import pytest
from django.contrib.auth import get_user_model
from apps.users.models import ActivityLog
from apps.users.permissions import IsSuperAdmin, IsEditorOrAbove, IsContributorOrAbove

User = get_user_model()


class TestLoginEndpoint:
    """Tests for POST /api/v1/admin/auth/login/"""

    def test_login_success(self, api_client, superadmin_user):
        response = api_client.post(
            "/api/v1/admin/auth/login/",
            {"email": "superadmin@test.com", "password": "SuperAdmin123!"},
            format="json",
        )
        assert response.status_code == 200
        data = response.json()
        assert "access" in data
        assert "refresh" in data
        assert data["user"]["email"] == "superadmin@test.com"
        assert data["user"]["role"] == "super_admin"

    def test_login_wrong_password(self, api_client, superadmin_user):
        response = api_client.post(
            "/api/v1/admin/auth/login/",
            {"email": "superadmin@test.com", "password": "WrongPass!"},
            format="json",
        )
        assert response.status_code == 400

    def test_login_nonexistent_user(self, api_client, db):
        response = api_client.post(
            "/api/v1/admin/auth/login/",
            {"email": "ghost@test.com", "password": "Whatever123!"},
            format="json",
        )
        assert response.status_code == 400

    def test_login_missing_fields(self, api_client):
        response = api_client.post(
            "/api/v1/admin/auth/login/",
            {"email": "test@test.com"},
            format="json",
        )
        assert response.status_code == 400

    def test_login_creates_activity_log(self, api_client, superadmin_user):
        response = api_client.post(
            "/api/v1/admin/auth/login/",
            {"email": "superadmin@test.com", "password": "SuperAdmin123!"},
            format="json",
        )
        assert response.status_code == 200
        assert ActivityLog.objects.filter(
            user=superadmin_user, action=ActivityLog.Action.LOGIN
        ).exists()


class TestTokenRefresh:
    """Tests for POST /api/v1/admin/auth/refresh/"""

    def test_refresh_success(self, api_client, auth_tokens):
        response = api_client.post(
            "/api/v1/admin/auth/refresh/",
            {"refresh": auth_tokens["refresh"]},
            format="json",
        )
        assert response.status_code == 200
        assert "access" in response.json()

    def test_refresh_invalid_token(self, api_client):
        response = api_client.post(
            "/api/v1/admin/auth/refresh/",
            {"refresh": "invalid-token"},
            format="json",
        )
        assert response.status_code == 401


class TestLogoutEndpoint:
    """Tests for POST /api/v1/admin/auth/logout/"""

    def test_logout_success(self, api_client, auth_tokens):
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {auth_tokens['access']}")
        response = api_client.post(
            "/api/v1/admin/auth/logout/",
            {"refresh": auth_tokens["refresh"]},
            format="json",
        )
        assert response.status_code == 200

    def test_logout_blacklists_refresh(self, api_client, auth_tokens):
        # Logout
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {auth_tokens['access']}")
        api_client.post(
            "/api/v1/admin/auth/logout/",
            {"refresh": auth_tokens["refresh"]},
            format="json",
        )
        # Try to refresh with blacklisted token
        api_client.credentials()
        response = api_client.post(
            "/api/v1/admin/auth/refresh/",
            {"refresh": auth_tokens["refresh"]},
            format="json",
        )
        assert response.status_code == 401

    def test_logout_requires_auth(self, api_client):
        response = api_client.post(
            "/api/v1/admin/auth/logout/",
            {"refresh": "some-token"},
            format="json",
        )
        assert response.status_code == 401


class TestMeEndpoint:
    """Tests for GET/PATCH /api/v1/admin/auth/me/"""

    def test_get_me(self, api_client, auth_tokens):
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {auth_tokens['access']}")
        response = api_client.get("/api/v1/admin/auth/me/")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "superadmin@test.com"
        assert data["role"] == "super_admin"

    def test_patch_me(self, api_client, auth_tokens):
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {auth_tokens['access']}")
        response = api_client.patch(
            "/api/v1/admin/auth/me/",
            {"first_name": "Updated", "phone": "+212600000000"},
            format="json",
        )
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "Updated"
        assert data["phone"] == "+212600000000"

    def test_me_requires_auth(self, api_client):
        response = api_client.get("/api/v1/admin/auth/me/")
        assert response.status_code == 401


class TestChangePassword:
    """Tests for POST /api/v1/admin/auth/change-password/"""

    def test_change_password_success(self, api_client, auth_tokens):
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {auth_tokens['access']}")
        response = api_client.post(
            "/api/v1/admin/auth/change-password/",
            {"old_password": "SuperAdmin123!", "new_password": "NewSecurePass1234!"},
            format="json",
        )
        assert response.status_code == 200

    def test_change_password_wrong_old(self, api_client, auth_tokens):
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {auth_tokens['access']}")
        response = api_client.post(
            "/api/v1/admin/auth/change-password/",
            {"old_password": "WrongOldPass", "new_password": "NewSecurePass1234!"},
            format="json",
        )
        assert response.status_code == 400

    def test_change_password_too_short(self, api_client, auth_tokens):
        api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {auth_tokens['access']}")
        response = api_client.post(
            "/api/v1/admin/auth/change-password/",
            {"old_password": "SuperAdmin123!", "new_password": "short"},
            format="json",
        )
        assert response.status_code == 400

    def test_change_password_requires_auth(self, api_client):
        response = api_client.post(
            "/api/v1/admin/auth/change-password/",
            {"old_password": "x", "new_password": "y"},
            format="json",
        )
        assert response.status_code == 401


class TestPasswordReset:
    """Tests for POST /api/v1/admin/auth/password-reset/"""

    def test_reset_request(self, api_client, superadmin_user):
        response = api_client.post(
            "/api/v1/admin/auth/password-reset/",
            {"email": "superadmin@test.com"},
            format="json",
        )
        assert response.status_code == 200
        data = response.json()
        assert "uid" in data
        assert "token" in data

    def test_reset_nonexistent_email(self, api_client, db):
        response = api_client.post(
            "/api/v1/admin/auth/password-reset/",
            {"email": "noone@test.com"},
            format="json",
        )
        assert response.status_code == 200
        data = response.json()
        assert data["detail"] == "If the email exists, a reset link has been sent"
        assert "uid" not in data

    def test_reset_confirm_and_login(self, api_client, superadmin_user):
        # Request reset
        reset_response = api_client.post(
            "/api/v1/admin/auth/password-reset/",
            {"email": "superadmin@test.com"},
            format="json",
        )
        data = reset_response.json()

        # Confirm reset
        confirm_response = api_client.post(
            "/api/v1/admin/auth/password-reset/confirm/",
            {
                "uid": data["uid"],
                "token": data["token"],
                "new_password": "NewPass12345!Complex",
            },
            format="json",
        )
        assert confirm_response.status_code == 200

        # Login with new password
        login_response = api_client.post(
            "/api/v1/admin/auth/login/",
            {"email": "superadmin@test.com", "password": "NewPass12345!Complex"},
            format="json",
        )
        assert login_response.status_code == 200

    def test_reset_confirm_invalid_token(self, api_client, db):
        response = api_client.post(
            "/api/v1/admin/auth/password-reset/confirm/",
            {"uid": "MQ", "token": "invalid-token", "new_password": "NewPass12345!"},
            format="json",
        )
        assert response.status_code == 400


class TestPermissions:
    """Tests for custom permission classes"""

    def test_superadmin_permission(self, superadmin_user):
        assert IsSuperAdmin().has_permission(
            type("Req", (), {"user": superadmin_user})(), None
        )

    def test_editor_cannot_superadmin(self, editor_user):
        assert not IsSuperAdmin().has_permission(
            type("Req", (), {"user": editor_user})(), None
        )

    def test_contributor_cannot_editor(self, contributor_user):
        assert not IsEditorOrAbove().has_permission(
            type("Req", (), {"user": contributor_user})(), None
        )

    def test_editor_is_editor_or_above(self, editor_user):
        assert IsEditorOrAbove().has_permission(
            type("Req", (), {"user": editor_user})(), None
        )

    def test_contributor_is_contributor_or_above(self, contributor_user):
        assert IsContributorOrAbove().has_permission(
            type("Req", (), {"user": contributor_user})(), None
        )

    def test_anonymous_denied(self):
        from django.contrib.auth.models import AnonymousUser

        anon = AnonymousUser()
        assert not IsSuperAdmin().has_permission(type("Req", (), {"user": anon})(), None)
        assert not IsEditorOrAbove().has_permission(type("Req", (), {"user": anon})(), None)
        assert not IsContributorOrAbove().has_permission(type("Req", (), {"user": anon})(), None)
