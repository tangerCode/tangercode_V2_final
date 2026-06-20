import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.languages.models import Language
from apps.services.models import PricingTier, PricingTierTranslation, Service, ServiceTranslation, Technology
from apps.portfolio.models import Project, ProjectImage, ProjectTranslation
from apps.blog.models import BlogCategory, BlogCategoryTranslation, BlogPost, BlogPostTranslation, BlogTag, BlogTagTranslation
from apps.testimonials.models import Testimonial, TestimonialTranslation
from apps.faq.models import FAQ, FAQCategory, FAQCategoryTranslation, FAQTranslation
from apps.messages_app.models import ContactMessage
from apps.core.models import PageSEO, PageSEOTranslation, SiteConfig, SiteConfigTranslation


class TestLanguageModel:
    def test_create_language(self, db):
        lang = Language.objects.create(code="fr", name="Français", is_default=True)
        assert str(lang) == "Français (fr)"
        assert lang.is_rtl is False

    def test_rtl_language(self, db):
        lang = Language.objects.create(code="ar", name="Arabic", is_rtl=True)
        assert lang.is_rtl is True

    def test_only_one_default(self, db):
        lang1 = Language.objects.create(code="fr", name="Français", is_default=True)
        lang2 = Language.objects.create(code="en", name="English", is_default=True)
        lang1.refresh_from_db()
        lang2.refresh_from_db()
        assert lang1.is_default is False
        assert lang2.is_default is True


class TestTechnologyModel:
    def test_create_technology(self, db):
        tech = Technology.objects.create(name="Next.js", category="frontend")
        assert str(tech) == "Next.js"
        assert tech.slug == "nextjs"

    def test_technology_categories(self, db):
        tech = Technology.objects.create(name="React", category="frontend")
        assert tech.category == "frontend"


class TestServiceModel:
    def test_create_service_with_translation(self, language_fr):
        svc = Service.objects.create(icon="code")
        st = ServiceTranslation.objects.create(service=svc, language=language_fr, title="Sites web", short_description="Description")
        assert str(svc) == "Sites web"
        assert svc.get_translation("fr").title == "Sites web"

    def test_translation_fallback(self, language_fr):
        svc = Service.objects.create(icon="code")
        ServiceTranslation.objects.create(service=svc, language=language_fr, title="Sites web", short_description="Desc")
        assert svc.get_translation("en") is not None
        assert svc.get_translation("en").title == "Sites web"

    def test_unique_translation_per_language(self, language_fr):
        svc = Service.objects.create(icon="code")
        ServiceTranslation.objects.create(service=svc, language=language_fr, title="Sites web", short_description="Desc")
        with pytest.raises(IntegrityError):
            ServiceTranslation.objects.create(service=svc, language=language_fr, title="Dupe", short_description="Desc")

    def test_service_technologies_m2m(self, language_fr, technology):
        svc = Service.objects.create(icon="code")
        svc.technologies.add(technology)
        assert svc.technologies.count() == 1
        assert technology.services.count() == 1

    def test_service_cascade_delete(self, language_fr):
        svc = Service.objects.create(icon="code")
        st = ServiceTranslation.objects.create(service=svc, language=language_fr, title="Test", short_description="Desc")
        svc.delete()
        assert ServiceTranslation.objects.filter(pk=st.pk).count() == 0

    def test_service_ordering(self, language_fr):
        s1 = Service.objects.create(icon="a", order=2)
        s2 = Service.objects.create(icon="b", order=1)
        ServiceTranslation.objects.create(service=s1, language=language_fr, title="A", short_description="A")
        ServiceTranslation.objects.create(service=s2, language=language_fr, title="B", short_description="B")
        services = list(Service.objects.all())
        assert services[0].order <= services[1].order


class TestPricingTierModel:
    def test_create_pricing_tier(self, service_fr, language_fr):
        tier = PricingTier.objects.create(service=service_fr, code="starter", price_mad=8000)
        PricingTierTranslation.objects.create(pricing_tier=tier, language=language_fr, name="Starter", features=["A", "B"])
        assert str(tier).startswith("Starter")
        assert tier.price_mad == 8000

    def test_pricing_tier_cascade(self, service_fr, language_fr):
        tier = PricingTier.objects.create(service=service_fr, code="pro", price_mad=25000)
        trans = PricingTierTranslation.objects.create(pricing_tier=tier, language=language_fr, name="Pro")
        service_fr.delete()
        assert PricingTier.objects.filter(pk=tier.pk).count() == 0

    def test_custom_quote(self, service_fr):
        tier = PricingTier.objects.create(service=service_fr, code="premium", is_custom_quote=True)
        assert tier.is_custom_quote is True


class TestProjectModel:
    def test_create_project(self, project, language_fr):
        assert str(project) == "Projet Test"
        assert project.client_name == "TestCorp"
        assert project.technologies.count() == 1

    def test_project_translation_fallback(self, project, language_fr):
        trans = project.get_translation("ar")
        assert trans is not None
        assert trans.title == "Projet Test"

    def test_project_images(self, project):
        img = ProjectImage.objects.create(project=project, alt_text="Screenshot", order=0)
        assert project.images.count() == 1
        project.delete()
        assert ProjectImage.objects.filter(pk=img.pk).count() == 0

    def test_project_categories(self, db):
        proj = Project.objects.create(client_name="Test", year=2025, category="mobile")
        assert proj.category == "mobile"


class TestBlogModel:
    def test_create_blog_post(self, blog_post, language_fr):
        assert blog_post.status == "published"
        assert blog_post.categories.count() == 1
        assert blog_post.tags.count() == 1

    def test_blog_post_translation(self, blog_post, language_fr):
        assert blog_post.get_translation("fr").title == "Article Test"

    def test_blog_category_translation(self, language_fr):
        cat = BlogCategory.objects.create(slug="dev")
        BlogCategoryTranslation.objects.create(category=cat, language=language_fr, name="Développement")
        assert cat.get_translation("fr").name == "Développement"

    def test_blog_tag_translation(self, language_fr):
        tag = BlogTag.objects.create(slug="django")
        BlogTagTranslation.objects.create(tag=tag, language=language_fr, name="Django")
        assert tag.get_translation("fr").name == "Django"

    def test_draft_post(self, db, language_fr):
        author = BlogPost._meta.get_field("author").remote_field.model.objects.create_user(
            email="draft@test.com", password="Pass12345!", first_name="A", last_name="B"
        )
        post = BlogPost.objects.create(slug="draft", author=author, status="draft")
        assert post.status == "draft"


class TestTestimonialModel:
    def test_create_testimonial(self, db, language_fr):
        t = Testimonial.objects.create(client_name="John", client_company="Corp", rating=5)
        TestimonialTranslation.objects.create(testimonial=t, language=language_fr, content="Excellent travail")
        assert str(t) == "John — Corp"
        assert t.rating == 5

    def test_testimonial_rating_validators(self, db):
        t = Testimonial(client_name="John", client_company="Corp", rating=6)
        with pytest.raises(ValidationError):
            t.full_clean()

    def test_testimonial_project_link(self, project, language_fr):
        t = Testimonial.objects.create(client_name="John", client_company="Corp", project=project)
        assert t.project == project


class TestFAQModel:
    def test_create_faq(self, db, language_fr):
        cat = FAQCategory.objects.create(slug="general")
        FAQCategoryTranslation.objects.create(category=cat, language=language_fr, name="Général")
        faq = FAQ.objects.create(category=cat)
        FAQTranslation.objects.create(faq=faq, language=language_fr, question="Comment ?", answer="Voici la réponse")
        assert faq.get_translation("fr").question.startswith("Comment")
        assert faq.category.get_translation("fr").name == "Général"

    def test_faq_cascade(self, db, language_fr):
        cat = FAQCategory.objects.create(slug="test")
        FAQCategoryTranslation.objects.create(category=cat, language=language_fr, name="Test")
        faq = FAQ.objects.create(category=cat)
        FAQTranslation.objects.create(faq=faq, language=language_fr, question="Q", answer="A")
        cat.delete()
        assert FAQ.objects.filter(pk=faq.pk).count() == 0


class TestContactMessage:
    def test_create_message(self, db):
        msg = ContactMessage.objects.create(
            name="Test User", email="test@test.com", subject="Test", message="Hello"
        )
        assert msg.status == "new"
        assert str(msg).startswith("Test User")

    def test_message_status_flow(self, db):
        msg = ContactMessage.objects.create(name="T", email="e@e.com", subject="S", message="M")
        msg.status = "read"
        msg.save()
        assert msg.status == "read"


class TestSiteConfig:
    def test_singleton(self, db):
        c1 = SiteConfig.load()
        c2 = SiteConfig.load()
        assert c1.pk == c2.pk == 1

    def test_site_config_translation(self, db, language_fr):
        config = SiteConfig.load()
        trans = SiteConfigTranslation.objects.create(
            config=config, language=language_fr, tagline="Développement sur mesure"
        )
        assert config.get_translation("fr").tagline == "Développement sur mesure"


class TestPageSEO:
    def test_create_page_seo(self, db, language_fr):
        page = PageSEO.objects.create(page_key="home")
        PageSEOTranslation.objects.create(page=page, language=language_fr, meta_title="Home", meta_description="Desc")
        assert page.get_translation("fr").meta_title == "Home"

    def test_page_key_unique(self, db):
        PageSEO.objects.create(page_key="services")
        with pytest.raises(IntegrityError):
            PageSEO.objects.create(page_key="services")


class TestTranslatableMixin:
    def test_get_translation_with_code(self, service_with_all_translations):
        assert service_with_all_translations.get_translation("fr").title == "Sites web"
        assert service_with_all_translations.get_translation("en").title == "Websites"
        assert service_with_all_translations.get_translation("ar").title == "مواقع"

    def test_get_translation_unknown_lang_falls_back_to_default(self, service_fr):
        trans = service_fr.get_translation("zh")
        assert trans is not None
        assert trans.language.is_default
