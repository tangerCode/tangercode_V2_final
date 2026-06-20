import pytest

from apps.services.models import Service, ServiceTranslation, PricingTier
from apps.portfolio.models import Project, ProjectImage
from apps.blog.models import BlogPost, BlogPostTranslation, BlogCategory, BlogTag
from apps.testimonials.models import Testimonial
from apps.faq.models import FAQ, FAQCategory
from apps.messages_app.models import ContactMessage
from apps.core.models import SiteConfig, PageSEO
from apps.languages.models import Language
from apps.users.models import ActivityLog, User


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------


class TestAdminAuth:
    def test_anonymous_denied(self, api_client):
        r = api_client.get("/api/v1/admin/services/")
        assert r.status_code == 401

    def test_invalid_token(self, api_client):
        api_client.credentials(HTTP_AUTHORIZATION="Bearer invalid-token")
        r = api_client.get("/api/v1/admin/services/")
        assert r.status_code == 401

    def test_contributor_denied_on_restricted(self, api_client, auth_as_contributor):
        r = api_client.get("/api/v1/admin/users/")
        assert r.status_code == 403


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------


class TestServiceAdminAPI:
    BASE = "/api/v1/admin/services"

    def test_list(self, api_client, auth_as_editor, admin_service_data):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200
        assert r.json()["count"] >= 1

    def test_detail(self, api_client, auth_as_editor, admin_service_data):
        r = api_client.get(f"{self.BASE}/{admin_service_data.pk}/")
        assert r.status_code == 200
        assert r.json()["icon"] == "code"

    def test_create(self, api_client, auth_as_editor, language_fr, technology):
        payload = {
            "icon": "globe",
            "featured": True,
            "order": 1,
            "is_active": True,
            "technologies": [technology.pk],
            "translations": [
                {"language": language_fr.pk, "title": "API Test", "short_description": "Desc test"}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201
        assert r.json()["icon"] == "globe"
        assert len(r.json()["translations"]) == 1

    def test_create_with_pricing_tiers(self, api_client, auth_as_editor, language_fr):
        payload = {
            "icon": "gift",
            "is_active": True,
            "translations": [
                {"language": language_fr.pk, "title": "Full Test", "short_description": "Complete"}
            ],
            "pricing_tiers": [
                {
                    "code": "starter",
                    "price_mad": "5000.00",
                    "is_active": True,
                    "translations": [
                        {"language": language_fr.pk, "name": "Start", "features": ["A", "B"]}
                    ],
                }
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201
        assert len(r.json()["pricing_tiers"]) == 1

    def test_update(self, api_client, auth_as_editor, admin_service_data):
        r = api_client.patch(f"{self.BASE}/{admin_service_data.pk}/", {"featured": False}, format="json")
        assert r.status_code == 200
        assert r.json()["featured"] is False

    def test_duplicate(self, api_client, auth_as_editor, admin_service_data):
        r = api_client.post(f"{self.BASE}/{admin_service_data.pk}/duplicate/")
        assert r.status_code == 201
        assert "(copie)" in r.json()["translations"][0]["title"]

    def test_delete(self, api_client, auth_as_editor, language_fr):
        svc = Service.objects.create(icon="temp", is_active=True)
        r = api_client.delete(f"{self.BASE}/{svc.pk}/")
        assert r.status_code == 204

    def test_cannot_deactivate_with_active_tiers(self, api_client, auth_as_editor, language_fr):
        svc = Service.objects.create(icon="locked")
        ServiceTranslation.objects.create(service=svc, language=language_fr, title="Locked", short_description="D")
        PricingTier.objects.create(service=svc, code="starter", is_active=True)
        r = api_client.patch(f"{self.BASE}/{svc.pk}/", {"is_active": False}, format="json")
        assert r.status_code == 400


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------


class TestProjectAdminAPI:
    BASE = "/api/v1/admin/projects"

    def test_list(self, api_client, auth_as_editor, admin_project_data):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_detail(self, api_client, auth_as_editor, admin_project_data):
        r = api_client.get(f"{self.BASE}/{admin_project_data.pk}/")
        assert r.status_code == 200
        assert r.json()["client_name"] == "Corp"

    def test_create(self, api_client, auth_as_editor, language_fr):
        payload = {
            "client_name": "NewCorp",
            "category": "website",
            "year": 2025,
            "is_active": True,
            "translations": [
                {"language": language_fr.pk, "title": "Projet API", "short_description": "Desc"}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_update(self, api_client, auth_as_editor, admin_project_data):
        r = api_client.patch(f"{self.BASE}/{admin_project_data.pk}/", {"client_name": "UpdatedCorp"}, format="json")
        assert r.status_code == 200
        assert r.json()["client_name"] == "UpdatedCorp"

    def test_add_image(self, api_client, auth_as_editor, admin_project_data):
        r = api_client.post(f"{self.BASE}/{admin_project_data.pk}/images/", {"alt_text": "Screenshot", "order": 1}, format="json")
        assert r.status_code in (201, 400)

    def test_cannot_delete_with_testimonials(self, api_client, auth_as_editor, admin_project_data, language_fr):
        from apps.testimonials.models import Testimonial
        Testimonial.objects.create(client_name="X", client_company="Y", project=admin_project_data)
        r = api_client.delete(f"{self.BASE}/{admin_project_data.pk}/")
        assert r.status_code == 422


# ---------------------------------------------------------------------------
# Blog Posts
# ---------------------------------------------------------------------------


class TestBlogPostAdminAPI:
    BASE = "/api/v1/admin/blog/posts"

    def test_list(self, api_client, auth_as_editor, admin_blog_data):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200
        assert r.json()["count"] >= 1

    def test_detail(self, api_client, auth_as_editor, admin_blog_data):
        r = api_client.get(f"{self.BASE}/{admin_blog_data.pk}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_editor, language_fr):
        payload = {
            "status": "draft",
            "translations": [
                {"language": language_fr.pk, "title": "New Post", "excerpt": "Excerpt", "content": "<p>Hello</p>"}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_update(self, api_client, auth_as_editor, admin_blog_data):
        r = api_client.patch(f"{self.BASE}/{admin_blog_data.pk}/", {"featured": True}, format="json")
        assert r.status_code == 200

    def test_publish_draft(self, api_client, auth_as_editor, admin_blog_data):
        r = api_client.post(f"{self.BASE}/{admin_blog_data.pk}/publish/")
        assert r.status_code == 200
        assert r.json()["status"] == "published"

    def test_archive(self, api_client, auth_as_editor, admin_blog_data):
        admin_blog_data.status = "published"
        admin_blog_data.save()
        r = api_client.post(f"{self.BASE}/{admin_blog_data.pk}/archive/")
        assert r.status_code == 200
        assert r.json()["status"] == "archived"

    def test_contributor_sees_only_own_posts(self, api_client, auth_as_contributor, admin_blog_data, admin_contributor_post):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200
        ids = [p["id"] for p in r.json()["results"]]
        assert admin_contributor_post.pk in ids
        assert admin_blog_data.pk not in ids

    def test_contributor_auto_set_author(self, api_client, auth_as_contributor, language_fr):
        payload = {
            "translations": [
                {"language": language_fr.pk, "title": "My Post", "excerpt": "X"}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201
        post = BlogPost.objects.get(pk=r.json()["id"])
        assert post.author.role == "contributor"

    def test_cannot_publish_without_translations(self, api_client, auth_as_editor, language_fr):
        post = BlogPost.objects.create(author=None, status="draft")
        r = api_client.post(f"{self.BASE}/{post.pk}/publish/")
        assert r.status_code == 400


# ---------------------------------------------------------------------------
# Blog Categories & Tags
# ---------------------------------------------------------------------------


class TestBlogCategoryAdminAPI:
    BASE = "/api/v1/admin/blog/categories"

    def test_list(self, api_client, auth_as_editor, admin_blog_data):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_editor, language_fr):
        payload = {
            "color": "#FF5500",
            "is_active": True,
            "translations": [
                {"language": language_fr.pk, "name": "SEO"}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_update(self, api_client, auth_as_editor, admin_blog_data):
        cat = BlogCategory.objects.first()
        r = api_client.patch(f"{self.BASE}/{cat.pk}/", {"color": "#000000"}, format="json")
        assert r.status_code == 200


class TestBlogTagAdminAPI:
    BASE = "/api/v1/admin/blog/tags"

    def test_list(self, api_client, auth_as_editor, admin_blog_data):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_editor, language_fr):
        payload = {
            "translations": [
                {"language": language_fr.pk, "name": "Python"}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_update(self, api_client, auth_as_editor, admin_blog_data):
        tag = BlogTag.objects.first()
        r = api_client.patch(f"{self.BASE}/{tag.pk}/", {}, format="json")
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# Pricing Tiers
# ---------------------------------------------------------------------------


class TestPricingTierAdminAPI:
    BASE = "/api/v1/admin/pricing"

    def test_list(self, api_client, auth_as_editor, admin_service_data):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_editor, admin_service_data, language_fr):
        payload = {
            "service": admin_service_data.pk,
            "code": "pro",
            "price_mad": "15000.00",
            "is_active": True,
            "translations": [
                {"language": language_fr.pk, "name": "Pro", "features": ["X", "Y"]}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_update(self, api_client, auth_as_editor, admin_service_data, language_fr):
        tier = PricingTier.objects.create(service=admin_service_data, code="premium", is_active=True)
        r = api_client.patch(f"{self.BASE}/{tier.pk}/", {"price_mad": "99999.00"}, format="json")
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# Testimonials
# ---------------------------------------------------------------------------


class TestTestimonialAdminAPI:
    BASE = "/api/v1/admin/testimonials"

    def test_list(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_editor, language_fr):
        payload = {
            "client_name": "Jean",
            "client_company": "ACME",
            "rating": 5,
            "is_active": True,
            "translations": [
                {"language": language_fr.pk, "content": "Excellent travail !"}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_update(self, api_client, auth_as_editor, language_fr):
        t = Testimonial.objects.create(client_name="Old", client_company="Corp", rating=4, is_active=True)
        r = api_client.patch(f"{self.BASE}/{t.pk}/", {"rating": 5}, format="json")
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# FAQ
# ---------------------------------------------------------------------------


class TestFAQAdminAPI:
    BASE = "/api/v1/admin/faq"

    def test_list(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_editor, language_fr):
        cat = FAQCategory.objects.create(slug="general")
        payload = {
            "category": cat.pk,
            "is_active": True,
            "translations": [
                {"language": language_fr.pk, "question": "Comment ?", "answer": "Voici."}
            ],
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_update(self, api_client, auth_as_editor, language_fr):
        cat = FAQCategory.objects.create(slug="billing")
        faq = FAQ.objects.create(category=cat, is_active=True)
        r = api_client.patch(f"{self.BASE}/{faq.pk}/", {"order": 99}, format="json")
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# Technologies
# ---------------------------------------------------------------------------


class TestTechnologyAdminAPI:
    BASE = "/api/v1/admin/technologies"

    def test_list(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_editor):
        payload = {"name": "Vue.js", "category": "frontend", "color": "#4FC08D", "is_active": True}
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_update(self, api_client, auth_as_editor, technology):
        r = api_client.patch(f"{self.BASE}/{technology.pk}/", {"color": "#FF0000"}, format="json")
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# Contact Messages
# ---------------------------------------------------------------------------


class TestContactMessageAdminAPI:
    BASE = "/api/v1/admin/messages"

    @pytest.fixture(autouse=True)
    def _create_message(self, admin_service_data):
        self.message = ContactMessage.objects.create(
            name="Test User", email="t@t.com", subject="Hello", message="World"
        )

    def test_list(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_detail(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/{self.message.pk}/")
        assert r.status_code == 200

    def test_patch_status(self, api_client, auth_as_editor):
        r = api_client.patch(f"{self.BASE}/{self.message.pk}/", {"status": "read"}, format="json")
        assert r.status_code == 200
        assert r.json()["status"] == "read"

    def test_reply(self, api_client, auth_as_editor):
        r = api_client.post(f"{self.BASE}/{self.message.pk}/reply/", {"reply_content": "Thanks!"}, format="json")
        assert r.status_code == 200
        self.message.refresh_from_db()
        assert self.message.status == "replied"

    def test_stats(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/stats/")
        assert r.status_code == 200
        assert "total" in r.json()


# ---------------------------------------------------------------------------
# Site Config
# ---------------------------------------------------------------------------


class TestSiteConfigAdminAPI:
    BASE = "/api/v1/admin/config/site/"

    def test_get(self, api_client, auth_as_superadmin, site_config_data):
        r = api_client.get(self.BASE)
        assert r.status_code == 200

    def test_patch(self, api_client, auth_as_superadmin, site_config_data):
        r = api_client.patch(self.BASE, {"site_name": "TC V2"}, format="json")
        assert r.status_code == 200
        assert r.json()["site_name"] == "TC V2"

    def test_editor_denied(self, api_client, auth_as_editor, site_config_data):
        r = api_client.get(self.BASE)
        assert r.status_code == 403


# ---------------------------------------------------------------------------
# Languages
# ---------------------------------------------------------------------------


class TestLanguageAdminAPI:
    BASE = "/api/v1/admin/languages"

    def test_list(self, api_client, auth_as_superadmin):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_patch(self, api_client, auth_as_superadmin, language_fr):
        r = api_client.patch(f"{self.BASE}/{language_fr.pk}/", {"is_active": False}, format="json")
        assert r.status_code == 200
        assert r.json()["is_active"] is False

    def test_editor_denied(self, api_client, auth_as_editor, language_fr):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 403


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------


class TestUserAdminAPI:
    BASE = "/api/v1/admin/users"

    def test_list(self, api_client, auth_as_superadmin):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_superadmin):
        payload = {
            "email": "newadmin@test.com",
            "password": "NewAdmin123456!",
            "first_name": "New",
            "last_name": "Admin",
            "role": "editor",
            "is_staff": True,
        }
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_detail(self, api_client, auth_as_superadmin, editor_user):
        r = api_client.get(f"{self.BASE}/{editor_user.pk}/")
        assert r.status_code == 200

    def test_update(self, api_client, auth_as_superadmin, editor_user):
        r = api_client.patch(f"{self.BASE}/{editor_user.pk}/", {"role": "contributor"}, format="json")
        assert r.status_code == 200

    def test_activity(self, api_client, auth_as_superadmin, editor_user):
        r = api_client.get(f"{self.BASE}/{editor_user.pk}/activity/")
        assert r.status_code == 200

    def test_editor_denied(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 403


# ---------------------------------------------------------------------------
# Media Upload
# ---------------------------------------------------------------------------


class TestMediaUploadAPI:
    BASE = "/api/v1/admin/media/upload/"

    def test_upload_requires_auth(self, api_client):
        r = api_client.post(self.BASE)
        assert r.status_code == 401

    def test_upload_without_file(self, api_client, auth_as_editor):
        r = api_client.post(self.BASE, {}, format="multipart")
        assert r.status_code == 400

    def test_upload_invalid_format(self, api_client, auth_as_editor):
        from django.core.files.uploadedfile import SimpleUploadedFile
        fake_txt = SimpleUploadedFile("test.txt", b"hello", content_type="text/plain")
        r = api_client.post(self.BASE, {"file": fake_txt}, format="multipart")
        assert r.status_code == 400


# ---------------------------------------------------------------------------
# Permissions Matrix
# ---------------------------------------------------------------------------


class TestPermissionsMatrix:
    def test_anonymous_all_401(self, api_client):
        for endpoint in ["/api/v1/admin/services/", "/api/v1/admin/projects/",
                          "/api/v1/admin/blog/posts/", "/api/v1/admin/messages/",
                          "/api/v1/admin/users/", "/api/v1/admin/config/site/"]:
            r = api_client.get(endpoint)
            assert r.status_code == 401, f"Expected 401 for {endpoint}, got {r.status_code}"

    def test_contributor_can_access_blog(self, api_client, auth_as_contributor):
        r = api_client.get("/api/v1/admin/blog/posts/")
        assert r.status_code == 200

    def test_contributor_cannot_access_services(self, api_client, auth_as_contributor):
        r = api_client.get("/api/v1/admin/services/")
        assert r.status_code == 403

    def test_contributor_cannot_access_users(self, api_client, auth_as_contributor):
        r = api_client.get("/api/v1/admin/users/")
        assert r.status_code == 403

    def test_editor_can_access_services(self, api_client, auth_as_editor):
        r = api_client.get("/api/v1/admin/services/")
        assert r.status_code == 200

    def test_editor_cannot_access_users(self, api_client, auth_as_editor):
        r = api_client.get("/api/v1/admin/users/")
        assert r.status_code == 403

    def test_superadmin_can_access_all(self, api_client, auth_as_superadmin):
        for endpoint in ["/api/v1/admin/services/", "/api/v1/admin/projects/",
                          "/api/v1/admin/blog/posts/", "/api/v1/admin/faq/",
                          "/api/v1/admin/technologies/", "/api/v1/admin/messages/",
                          "/api/v1/admin/users/", "/api/v1/admin/config/site/",
                          "/api/v1/admin/languages/"]:
            r = api_client.get(endpoint)
            assert r.status_code == 200, f"Expected 200 for {endpoint}, got {r.status_code}"


# ---------------------------------------------------------------------------
# Activity Logging
# ---------------------------------------------------------------------------


class TestActivityLogging:
    def test_create_logs_activity(self, api_client, auth_as_editor, language_fr):
        before = ActivityLog.objects.filter(action="created").count()
        payload = {
            "icon": "logtest",
            "is_active": True,
            "translations": [
                {"language": language_fr.pk, "title": "Log Test", "short_description": "Test"}
            ],
        }
        r = api_client.post("/api/v1/admin/services/", payload, format="json")
        assert r.status_code == 201
        assert ActivityLog.objects.filter(action="created").count() == before + 1

    def test_update_logs_activity(self, api_client, auth_as_editor, admin_service_data):
        before = ActivityLog.objects.filter(action="updated").count()
        r = api_client.patch(f"/api/v1/admin/services/{admin_service_data.pk}/", {"order": 42}, format="json")
        assert r.status_code == 200
        assert ActivityLog.objects.filter(action="updated").count() == before + 1

    def test_delete_logs_activity(self, api_client, auth_as_editor, language_fr):
        svc = Service.objects.create(icon="delme", is_active=True)
        ServiceTranslation.objects.create(service=svc, language=language_fr, title="x", short_description="y")
        before = ActivityLog.objects.filter(action="deleted").count()
        r = api_client.delete(f"/api/v1/admin/services/{svc.pk}/")
        assert r.status_code == 204
        assert ActivityLog.objects.filter(action="deleted", model_name="Service").count() == before + 1


# ---------------------------------------------------------------------------
# Pagination
# ---------------------------------------------------------------------------


class TestPaginationAdmin:
    def test_default_page_size(self, api_client, auth_as_editor, admin_service_data):
        r = api_client.get("/api/v1/admin/services/")
        assert r.status_code == 200
        data = r.json()
        assert "count" in data
        assert "next" in data
        assert "results" in data

    def test_custom_page_size(self, api_client, auth_as_editor, admin_service_data):
        r = api_client.get("/api/v1/admin/services/?page_size=50")
        assert r.status_code == 200
