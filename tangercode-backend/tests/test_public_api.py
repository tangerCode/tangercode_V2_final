import pytest

from apps.services.models import Service, ServiceTranslation
from apps.blog.models import BlogPost, BlogPostTranslation


class TestServicesAPI:
    BASE = "/api/v1/public/services"

    def test_list_services(self, api_client, service_with_data):
        r = api_client.get(f"{self.BASE}/?lang=fr")
        assert r.status_code == 200
        assert len(r.json()["results"]) >= 1

    def test_list_services_only_active(self, api_client, language_fr):
        active = Service.objects.create(is_active=True)
        from apps.services.models import ServiceTranslation
        ServiceTranslation.objects.create(service=active, language=language_fr, title="Active", short_description="A")
        inactive = Service.objects.create(is_active=False)
        ServiceTranslation.objects.create(service=inactive, language=language_fr, title="Inactive", short_description="I")
        r = api_client.get(f"{self.BASE}/?lang=fr")
        slugs = [s["slug"] for s in r.json()["results"]]
        assert active.slug in slugs
        assert inactive.slug not in slugs

    def test_detail_service(self, api_client, service_with_data):
        r = api_client.get(f"{self.BASE}/{service_with_data.slug}/?lang=fr")
        assert r.status_code == 200
        assert r.json()["title"] == "Sites web"
        assert "technologies" in r.json()
        assert "pricing_tiers" in r.json()

    def test_detail_service_english(self, api_client, service_with_data):
        r = api_client.get(f"{self.BASE}/{service_with_data.slug}/?lang=en")
        assert r.status_code == 200
        assert r.json()["title"] == "Websites"

    def test_service_pricing(self, api_client, service_with_data):
        r = api_client.get(f"{self.BASE}/{service_with_data.slug}/pricing/?lang=fr")
        assert r.status_code == 200
        assert len(r.json()) == 2

    def test_service_not_found(self, api_client, db):
        r = api_client.get(f"{self.BASE}/nonexistent/")
        assert r.status_code == 404


class TestProjectsAPI:
    BASE = "/api/v1/public/projects"

    def test_list_projects(self, api_client, project_with_data):
        r = api_client.get(f"{self.BASE}/?lang=fr")
        assert r.status_code == 200
        assert len(r.json()["results"]) >= 1

    def test_detail_project(self, api_client, project_with_data):
        r = api_client.get(f"{self.BASE}/{project_with_data.slug}/?lang=fr")
        assert r.status_code == 200
        assert r.json()["title"] == "Projet Test"
        assert "images" in r.json()

    def test_filter_by_category(self, api_client, project_with_data):
        r = api_client.get(f"{self.BASE}/?lang=fr&category=website")
        assert r.status_code == 200

    def test_categories_list(self, api_client):
        r = api_client.get(f"{self.BASE}/categories/")
        assert r.status_code == 200
        assert len(r.json()) > 0

    def test_featured(self, api_client, project_with_data):
        r = api_client.get(f"{self.BASE}/featured/")
        assert r.status_code == 200


class TestBlogAPI:
    BASE = "/api/v1/public/blog"

    def test_list_posts(self, api_client, blog_post_with_data):
        r = api_client.get(f"{self.BASE}/posts/?lang=fr")
        assert r.status_code == 200
        assert len(r.json()["results"]) >= 1

    def test_detail_post(self, api_client, blog_post_with_data):
        r = api_client.get(f"{self.BASE}/posts/{blog_post_with_data.slug}/?lang=fr")
        assert r.status_code == 200
        assert r.json()["title"] == "Article Test"

    def test_detail_post_english(self, api_client, blog_post_with_data):
        r = api_client.get(f"{self.BASE}/posts/{blog_post_with_data.slug}/?lang=en")
        assert r.status_code == 200
        assert r.json()["title"] == "Test Article"

    def test_draft_not_public(self, api_client, language_fr):
        draft = BlogPost.objects.create(slug="draft-post", status="draft")
        from apps.blog.models import BlogPostTranslation
        BlogPostTranslation.objects.create(post=draft, language=language_fr, title="Draft", excerpt="D")
        r = api_client.get(f"{self.BASE}/posts/?lang=fr")
        slugs = [s["slug"] for s in r.json()["results"]]
        assert "draft-post" not in slugs

    def test_filter_by_category(self, api_client, blog_post_with_data):
        r = api_client.get(f"{self.BASE}/posts/?lang=fr&category=dev")
        assert r.status_code == 200

    def test_search(self, api_client, blog_post_with_data):
        r = api_client.get(f"{self.BASE}/posts/?lang=fr&search=Article")
        assert r.status_code == 200
        assert len(r.json()["results"]) >= 1

    def test_view_counter(self, api_client, blog_post_with_data):
        before = blog_post_with_data.views_count
        r = api_client.post(f"{self.BASE}/posts/{blog_post_with_data.slug}/view/")
        assert r.status_code == 200
        blog_post_with_data.refresh_from_db()
        assert blog_post_with_data.views_count == before + 1

    def test_related_posts(self, api_client, blog_post_with_data):
        r = api_client.get(f"{self.BASE}/posts/{blog_post_with_data.slug}/related/?lang=fr")
        assert r.status_code == 200

    def test_categories(self, api_client, blog_post_with_data):
        r = api_client.get(f"{self.BASE}/categories/?lang=fr")
        assert r.status_code == 200

    def test_tags(self, api_client, blog_post_with_data):
        r = api_client.get(f"{self.BASE}/tags/?lang=fr")
        assert r.status_code == 200


class TestPricingAPI:
    def test_list_pricing(self, api_client, service_with_data):
        r = api_client.get("/api/v1/public/pricing/?lang=fr")
        assert r.status_code == 200

    def test_by_service(self, api_client, service_with_data):
        r = api_client.get(f"/api/v1/public/pricing/by-service/{service_with_data.slug}/?lang=fr")
        assert r.status_code == 200


class TestOtherEndpoints:
    def test_testimonials(self, api_client, testimonial_data):
        r = api_client.get("/api/v1/public/testimonials/?lang=fr")
        assert r.status_code == 200

    def test_faq(self, api_client, faq_with_data):
        r = api_client.get("/api/v1/public/faq/?lang=fr")
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_technologies(self, api_client, technology):
        r = api_client.get("/api/v1/public/technologies/?lang=fr")
        assert r.status_code == 200

    def test_site_config(self, api_client, site_config_data):
        r = api_client.get("/api/v1/public/site-config/?lang=fr")
        assert r.status_code == 200
        assert "translations" in r.json()

    def test_site_seo(self, api_client, db):
        from apps.core.models import PageSEO
        PageSEO.objects.create(page_key="home")
        r = api_client.get("/api/v1/public/site-config/seo/home/")
        assert r.status_code == 200

    def test_site_seo_not_found(self, api_client, db):
        r = api_client.get("/api/v1/public/site-config/seo/nonexistent/")
        assert r.status_code == 404


class TestContactAPI:
    BASE = "/api/v1/public/contact/"

    def test_submit_contact(self, api_client, db):
        r = api_client.post(self.BASE, {
            "name": "Test", "email": "t@test.com", "subject": "S", "message": "M"
        }, format="json")
        assert r.status_code == 201

    def test_submit_contact_all_fields(self, api_client, service_with_data):
        r = api_client.post(self.BASE, {
            "name": "Full", "email": "full@test.com", "phone": "+212600000000",
            "company": "Corp", "subject": "Project", "message": "Details",
            "service_interested": service_with_data.pk, "budget_range": "5k_20k",
        }, format="json")
        assert r.status_code == 201

    def test_submit_contact_missing_required(self, api_client):
        r = api_client.post(self.BASE, {"email": "x@x.com"}, format="json")
        assert r.status_code == 400


class TestTranslationFallback:
    def test_fallback_to_default(self, api_client, service_with_data):
        r = api_client.get(f"/api/v1/public/services/{service_with_data.slug}/?lang=ar")
        assert r.status_code == 200
        assert r.json()["title"] == "Sites web"

    def test_no_lang_defaults_to_fr(self, api_client, service_with_data):
        r = api_client.get(f"/api/v1/public/services/{service_with_data.slug}/")
        assert r.status_code == 200
        assert r.json()["title"] == "Sites web"


class TestPagination:
    def test_pagination_structure(self, api_client, service_with_data):
        r = api_client.get("/api/v1/public/services/?lang=fr")
        data = r.json()
        assert "count" in data
        assert "next" in data
        assert "previous" in data
        assert "results" in data
