import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from apps.languages.models import Language
from apps.portfolio.models import Project
from apps.services.models import PricingTier, PricingTierTranslation, Service, ServiceTranslation, Technology

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


@pytest.fixture
def language_fr(db):
    return Language.objects.create(code="fr", name="Fran\u00e7ais", native_name="Fran\u00e7ais", is_default=True, order=1)


@pytest.fixture
def language_en(db):
    return Language.objects.create(code="en", name="English", native_name="English", is_rtl=False, order=2)


@pytest.fixture
def language_ar(db):
    return Language.objects.create(code="ar", name="Arabic", native_name="\u0627\u0644\u0639\u0631\u0628\u064a\u0629", is_rtl=True, order=3)


@pytest.fixture
def all_languages(language_fr, language_en, language_ar):
    return [language_fr, language_en, language_ar]


@pytest.fixture
def technology(db):
    return Technology.objects.create(name="Next.js", category="frontend", color="#000000")


@pytest.fixture
def service_fr(db, language_fr):
    svc = Service.objects.create(icon="code", featured=True)
    ServiceTranslation.objects.create(service=svc, language=language_fr, title="Sites web", short_description="Description FR")
    return svc


@pytest.fixture
def service_with_all_translations(db, all_languages):
    svc = Service.objects.create(icon="code", featured=True)
    titles = ["Sites web", "Websites", "\u0645\u0648\u0627\u0642\u0639"]
    for lang, title in zip(all_languages, titles):
        ServiceTranslation.objects.create(service=svc, language=lang, title=title, short_description=f"Desc {lang.code}")
    return svc


@pytest.fixture
def pricing_tier(db, service_fr, language_fr):
    tier = PricingTier.objects.create(service=service_fr, code="starter", price_mad=8000, delivery_days=14)
    PricingTierTranslation.objects.create(pricing_tier=tier, language=language_fr, name="Starter", features=["Feature 1", "Feature 2"])
    return tier


@pytest.fixture
def project(db, language_fr, technology):
    from apps.portfolio.models import Project, ProjectTranslation

    proj = Project.objects.create(client_name="TestCorp", year=2025)
    proj.technologies.add(technology)
    ProjectTranslation.objects.create(project=proj, language=language_fr, title="Projet Test", short_description="Description")
    return proj


@pytest.fixture
def blog_post(db, all_languages):
    from apps.blog.models import (
        BlogCategory, BlogCategoryTranslation, BlogPost, BlogPostTranslation, BlogTag, BlogTagTranslation,
    )

    author = User.objects.create_user(email="author@test.com", password="Pass12345!", first_name="Author", last_name="Test")
    cat = BlogCategory.objects.create(slug="dev")
    BlogCategoryTranslation.objects.create(category=cat, language=all_languages[0], name="D\u00e9veloppement")
    tag = BlogTag.objects.create(slug="nextjs")
    BlogTagTranslation.objects.create(tag=tag, language=all_languages[0], name="Next.js")
    post = BlogPost.objects.create(slug="test-post", author=author, status="published")
    post.categories.add(cat)
    post.tags.add(tag)
    BlogPostTranslation.objects.create(post=post, language=all_languages[0], title="Article Test", excerpt="Extrait")
    return post


# ==== P3 public API fixtures ====


@pytest.fixture
def service_with_data(language_fr, language_en, technology):
    from apps.services.models import PricingTier, ServiceTranslation

    svc = Service.objects.create(icon="code", is_active=True, featured=True)
    ServiceTranslation.objects.create(service=svc, language=language_fr, title="Sites web", short_description="Description FR", long_description="Long FR")
    ServiceTranslation.objects.create(service=svc, language=language_en, title="Websites", short_description="Description EN")
    svc.technologies.add(technology)
    PricingTier.objects.create(service=svc, code="starter", price_mad=8000, is_active=True)
    PricingTier.objects.create(service=svc, code="pro", price_mad=25000, is_active=True)
    return svc


@pytest.fixture
def project_with_data(language_fr, technology):
    from apps.portfolio.models import ProjectTranslation

    proj = Project.objects.create(client_name="TestCorp", year=2025, category="website", is_active=True)
    ProjectTranslation.objects.create(project=proj, language=language_fr, title="Projet Test", short_description="Description FR")
    proj.technologies.add(technology)
    return proj


@pytest.fixture
def blog_post_with_data(language_fr, language_en):
    from apps.blog.models import (
        BlogCategory, BlogCategoryTranslation, BlogPost, BlogPostTranslation, BlogTag, BlogTagTranslation,
    )

    author = User.objects.create_user(email="writer@test.com", password="Pass12345!", first_name="Writer", last_name="Test")
    cat = BlogCategory.objects.create(slug="dev", is_active=True)
    BlogCategoryTranslation.objects.create(category=cat, language=language_fr, name="D\u00e9veloppement")
    tag = BlogTag.objects.create(slug="django")
    BlogTagTranslation.objects.create(tag=tag, language=language_fr, name="Django")
    post = BlogPost.objects.create(slug="test-article", author=author, status="published")
    post.categories.add(cat)
    post.tags.add(tag)
    BlogPostTranslation.objects.create(post=post, language=language_fr, title="Article Test", excerpt="Extrait FR", content="<p>Contenu FR</p>")
    BlogPostTranslation.objects.create(post=post, language=language_en, title="Test Article", excerpt="Excerpt EN")
    return post


@pytest.fixture
def faq_with_data(language_fr):
    from apps.faq.models import FAQ, FAQCategory, FAQCategoryTranslation, FAQTranslation

    cat = FAQCategory.objects.create(slug="general", is_active=True)
    FAQCategoryTranslation.objects.create(category=cat, language=language_fr, name="G\u00e9n\u00e9ral")
    faq = FAQ.objects.create(category=cat, is_active=True)
    FAQTranslation.objects.create(faq=faq, language=language_fr, question="Comment \u00e7a marche ?", answer="Voici la r\u00e9ponse")
    return cat


@pytest.fixture
def testimonial_data(language_fr):
    from apps.testimonials.models import Testimonial, TestimonialTranslation

    t = Testimonial.objects.create(client_name="John", client_company="Corp", rating=5, is_active=True)
    TestimonialTranslation.objects.create(testimonial=t, language=language_fr, content="Excellent")
    return t


@pytest.fixture
def site_config_data(language_fr):
    from apps.core.models import SiteConfig, SiteConfigTranslation

    config = SiteConfig.load()
    SiteConfigTranslation.objects.create(config=config, language=language_fr, tagline="Dev sur mesure")
    return config
