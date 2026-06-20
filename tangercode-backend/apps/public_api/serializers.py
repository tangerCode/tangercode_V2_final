from rest_framework import serializers

from apps.services.models import PricingTier, PricingTierTranslation, Service, ServiceTranslation, Technology
from apps.portfolio.models import Project, ProjectImage, ProjectTranslation
from apps.blog.models import BlogCategory, BlogCategoryTranslation, BlogPost, BlogPostTranslation, BlogTag, BlogTagTranslation
from apps.testimonials.models import Testimonial, TestimonialTranslation
from apps.faq.models import FAQ, FAQCategory, FAQCategoryTranslation, FAQTranslation
from apps.messages_app.models import ContactMessage
from apps.core.models import PageSEO, PageSEOTranslation, SiteConfig, SiteConfigTranslation
from apps.languages.models import Language


class TranslatedModelSerializer(serializers.ModelSerializer):
    def _lang(self):
        return self.context.get("lang", "fr")

    def _trans(self, obj, field, default=""):
        t = obj.get_translation(self._lang())
        return getattr(t, field, default) if t else default


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["code", "name", "native_name", "is_default", "is_rtl", "order"]


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["name", "slug", "category", "color", "logo"]


class PricingTierSerializer(TranslatedModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    cta_text = serializers.SerializerMethodField()

    class Meta:
        model = PricingTier
        fields = [
            "code", "name", "description", "features", "cta_text",
            "price_mad", "price_eur", "price_usd", "is_custom_quote",
            "delivery_days", "revisions_count", "support_days", "is_featured",
        ]

    def get_name(self, obj):
        return self._trans(obj, "name", obj.code)

    def get_description(self, obj):
        return self._trans(obj, "description")

    def get_features(self, obj):
        return self._trans(obj, "features", [])

    def get_cta_text(self, obj):
        return self._trans(obj, "cta_text", "Commander")


class ServiceListSerializer(TranslatedModelSerializer):
    title = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    starting_price = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ["slug", "title", "short_description", "icon", "cover_image", "featured", "starting_price"]

    def get_title(self, obj):
        return self._trans(obj, "title", obj.slug)

    def get_short_description(self, obj):
        return self._trans(obj, "short_description")

    def get_starting_price(self, obj):
        tier = obj.pricing_tiers.filter(is_active=True).order_by("price_mad").first()
        if tier and tier.price_mad:
            return float(tier.price_mad)
        return None


class ServiceDetailSerializer(ServiceListSerializer):
    long_description = serializers.SerializerMethodField()
    technologies = TechnologySerializer(many=True, read_only=True)
    pricing_tiers = serializers.SerializerMethodField()
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()

    class Meta(ServiceListSerializer.Meta):
        fields = ServiceListSerializer.Meta.fields + [
            "long_description", "technologies", "pricing_tiers",
            "meta_title", "meta_description", "created_at", "updated_at",
        ]

    def get_long_description(self, obj):
        return self._trans(obj, "long_description")

    def get_pricing_tiers(self, obj):
        tiers = obj.pricing_tiers.filter(is_active=True).select_related("service").prefetch_related("translations")
        return PricingTierSerializer(tiers, many=True, context=self.context).data

    def get_meta_title(self, obj):
        return self._trans(obj, "meta_title")

    def get_meta_description(self, obj):
        return self._trans(obj, "meta_description")


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["image", "alt_text", "order"]


class ProjectListSerializer(TranslatedModelSerializer):
    title = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "slug", "title", "short_description", "client_name", "category",
            "year", "cover_image", "technologies", "featured",
        ]

    def get_title(self, obj):
        return self._trans(obj, "title", obj.slug)

    def get_short_description(self, obj):
        return self._trans(obj, "short_description")


class ProjectDetailSerializer(ProjectListSerializer):
    long_description = serializers.SerializerMethodField()
    client_testimonial = serializers.SerializerMethodField()
    images = ProjectImageSerializer(many=True, read_only=True)
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            "long_description", "client_testimonial", "images",
            "project_url", "duration_months",
            "meta_title", "meta_description",
        ]

    def get_long_description(self, obj):
        return self._trans(obj, "long_description")

    def get_client_testimonial(self, obj):
        return self._trans(obj, "client_testimonial")

    def get_meta_title(self, obj):
        return self._trans(obj, "meta_title")

    def get_meta_description(self, obj):
        return self._trans(obj, "meta_description")


class BlogCategorySerializer(TranslatedModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = BlogCategory
        fields = ["slug", "name", "description", "color", "order"]

    def get_name(self, obj):
        return self._trans(obj, "name", obj.slug)

    def get_description(self, obj):
        return self._trans(obj, "description")


class BlogTagSerializer(TranslatedModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = BlogTag
        fields = ["slug", "name"]

    def get_name(self, obj):
        return self._trans(obj, "name", obj.slug)


class BlogPostListSerializer(TranslatedModelSerializer):
    title = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    category_names = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            "slug", "title", "excerpt", "cover_image",
            "category_names", "featured", "published_at",
            "author_name", "views_count",
        ]

    def get_title(self, obj):
        return self._trans(obj, "title", obj.slug)

    def get_excerpt(self, obj):
        return self._trans(obj, "excerpt")

    def get_category_names(self, obj):
        return [c.get_translation(self._lang()).name if c.get_translation(self._lang()) else c.slug
                for c in obj.categories.filter(is_active=True)]

    def get_author_name(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.email
        return "TANGER CODE"


class BlogPostDetailSerializer(BlogPostListSerializer):
    content = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    related_posts = serializers.SerializerMethodField()
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()

    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + [
            "content", "tags", "related_posts", "meta_title", "meta_description",
        ]

    def get_content(self, obj):
        return self._trans(obj, "content")

    def get_tags(self, obj):
        return BlogTagSerializer(obj.tags.all(), many=True, context=self.context).data

    def get_related_posts(self, obj):
        related = BlogPost.objects.filter(
            status="published", categories__in=obj.categories.all()
        ).exclude(pk=obj.pk).distinct()[:3]
        return BlogPostListSerializer(related, many=True, context=self.context).data

    def get_meta_title(self, obj):
        return self._trans(obj, "meta_title")

    def get_meta_description(self, obj):
        return self._trans(obj, "meta_description")


class TestimonialSerializer(TranslatedModelSerializer):
    content = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = [
            "client_name", "client_company", "client_position",
            "rating", "content", "client_photo", "video_url", "order",
        ]

    def get_content(self, obj):
        return self._trans(obj, "content")


class FAQSerializer(TranslatedModelSerializer):
    question = serializers.SerializerMethodField()
    answer = serializers.SerializerMethodField()

    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "order"]

    def get_question(self, obj):
        return self._trans(obj, "question")

    def get_answer(self, obj):
        return self._trans(obj, "answer")


class FAQCategorySerializer(TranslatedModelSerializer):
    name = serializers.SerializerMethodField()
    faqs = serializers.SerializerMethodField()

    class Meta:
        model = FAQCategory
        fields = ["slug", "name", "icon", "faqs"]

    def get_name(self, obj):
        return self._trans(obj, "name", obj.slug)

    def get_faqs(self, obj):
        faqs = obj.faqs.filter(is_active=True).order_by("order")
        return FAQSerializer(faqs, many=True, context=self.context).data


class SiteConfigTranslationSerializer(serializers.ModelSerializer):
    language = serializers.CharField(source="language.code")

    class Meta:
        model = SiteConfigTranslation
        fields = [
            "language", "tagline", "hero_subtitle", "footer_description",
            "whatsapp_message", "seo_default_title", "seo_default_description",
        ]


class SiteConfigSerializer(serializers.ModelSerializer):
    translations = serializers.SerializerMethodField()
    whatsapp_number = serializers.CharField()
    logo_light = serializers.ImageField(read_only=True)
    logo_dark = serializers.ImageField(read_only=True)
    favicon = serializers.ImageField(read_only=True)

    class Meta:
        model = SiteConfig
        fields = [
            "site_name", "site_email", "site_phone", "site_address",
            "whatsapp_number", "logo_light", "logo_dark", "favicon",
            "linkedin_url", "github_url", "instagram_url", "facebook_url", "twitter_url",
            "translations",
        ]

    def get_translations(self, obj):
        return SiteConfigTranslationSerializer(obj.translations.all(), many=True).data


class PageSEOSerializer(serializers.ModelSerializer):
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()

    class Meta:
        model = PageSEO
        fields = ["page_key", "meta_title", "meta_description", "og_image"]

    def get_meta_title(self, obj):
        t = obj.get_translation(self.context.get("lang", "fr"))
        return t.meta_title if t else ""

    def get_meta_description(self, obj):
        t = obj.get_translation(self.context.get("lang", "fr"))
        return t.meta_description if t else ""


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "name", "email", "phone", "company", "subject", "message",
            "service_interested", "budget_range",
        ]
        extra_kwargs = {
            "phone": {"required": False},
            "company": {"required": False},
            "service_interested": {"required": False},
            "budget_range": {"required": False},
        }

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["ip_address"] = request.META.get("REMOTE_ADDR")
        validated_data["user_agent"] = request.META.get("HTTP_USER_AGENT", "")[:500]
        validated_data["language"] = self.context.get("lang", "fr")
        validated_data["status"] = "new"
        return super().create(validated_data)
