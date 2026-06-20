import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def superadmin_user(db):
    return User.objects.create_user(
        email="superadmin@test.com",
        password="SuperAdmin123!",
        first_name="Super",
        last_name="Admin",
        role="super_admin",
        is_staff=True,
        is_superuser=True,
    )


@pytest.fixture
def editor_user(db):
    return User.objects.create_user(
        email="editor@test.com",
        password="Editor12345!",
        first_name="Editor",
        last_name="User",
        role="editor",
        is_staff=True,
    )


@pytest.fixture
def contributor_user(db):
    return User.objects.create_user(
        email="contributor@test.com",
        password="Contrib123!",
        first_name="Contrib",
        last_name="User",
        role="contributor",
    )


@pytest.fixture
def auth_tokens(api_client, superadmin_user):
    response = api_client.post(
        "/api/v1/admin/auth/login/",
        {"email": "superadmin@test.com", "password": "SuperAdmin123!"},
        format="json",
    )
    assert response.status_code == 200
    return response.json()
