from rest_framework import serializers

from apps.services.models import (
    PricingTier,
    PricingTierTranslation,
    Service,
    ServiceTranslation,
    Technology,
)
from apps.portfolio.models import Project, ProjectImage, ProjectTranslation
from apps.blog.models import (
    BlogCategory,
    BlogCategoryTranslation,
    BlogPost,
    BlogPostTranslation,
    BlogTag,
    BlogTagTranslation,
)
from apps.testimonials.models import Testimonial, TestimonialTranslation
from apps.faq.models import FAQ, FAQCategory, FAQCategoryTranslation, FAQTranslation
from apps.messages_app.models import ContactMessage
from apps.core.models import PageSEO, PageSEOTranslation, SiteConfig, SiteConfigTranslation
from apps.languages.models import Language
from apps.users.models import User


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _nested_translations_update(instance, translations_data, translation_model, parent_field):
    if translations_data is None:
        return
    new_langs = []
    for t in translations_data:
        lang = t.pop("language")
        translation_model.objects.update_or_create(
            **{parent_field: instance, "language": lang},
            defaults=t,
        )
        new_langs.append(lang.id)
    instance.translations.exclude(language_id__in=new_langs).delete()


def _nested_translations_create(parent_instance, translations_data, translation_model, parent_field):
    for t in translations_data:
        translation_model.objects.create(**{parent_field: parent_instance}, **t)


# ---------------------------------------------------------------------------
# Service + PricingTier + Translations
# ---------------------------------------------------------------------------


class ServiceTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = ServiceTranslation
        fields = [
            "id", "language", "title", "short_description", "long_description",
            "meta_title", "meta_description", "auto_translated", "last_edited_manually",
        ]


class PricingTierTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = PricingTierTranslation
        fields = [
            "id", "language", "name", "description", "features", "cta_text",
            "auto_translated",
        ]


class PricingTierAdminSerializer(serializers.ModelSerializer):
    translations = PricingTierTranslationAdminSerializer(many=True, required=False)
    code = serializers.ChoiceField(choices=PricingTier.Code.choices, default=PricingTier.Code.STARTER)

    class Meta:
        model = PricingTier
        fields = [
            "id", "service", "code", "price_mad", "price_eur", "price_usd",
            "is_custom_quote", "delivery_days", "revisions_count", "support_days",
            "is_featured", "order", "is_active", "translations",
        ]
        extra_kwargs = {"service": {"required": False}}

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        tier = super().create(validated_data)
        _nested_translations_create(tier, translations_data, PricingTierTranslation, "pricing_tier")
        return tier

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        _nested_translations_update(instance, translations_data, PricingTierTranslation, "pricing_tier")
        return instance


class ServiceAdminSerializer(serializers.ModelSerializer):
    translations = ServiceTranslationAdminSerializer(many=True, required=False)
    pricing_tiers = PricingTierAdminSerializer(many=True, required=False)
    technologies = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Technology.objects.all(), required=False
    )

    class Meta:
        model = Service
        fields = [
            "id", "slug", "icon", "cover_image", "technologies",
            "featured", "order", "is_active",
            "translations", "pricing_tiers",
            "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def validate_is_active(self, value):
        if self.instance and not value:
            if self.instance.pricing_tiers.filter(is_active=True).exists():
                raise serializers.ValidationError(
                    "Cannot deactivate a service that has active pricing tiers."
                )
        return value

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        pricing_tiers_data = validated_data.pop("pricing_tiers", [])
        technologies = validated_data.pop("technologies", [])

        service = Service.objects.create(**validated_data)
        service.technologies.set(technologies)

        _nested_translations_create(service, translations_data, ServiceTranslation, "service")

        for pt_data in pricing_tiers_data:
            pt_translations = pt_data.pop("translations", [])
            tier = PricingTier.objects.create(service=service, **pt_data)
            _nested_translations_create(tier, pt_translations, PricingTierTranslation, "pricing_tier")

        return service

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        pricing_tiers_data = validated_data.pop("pricing_tiers", None)
        technologies = validated_data.pop("technologies", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if technologies is not None:
            instance.technologies.set(technologies)

        _nested_translations_update(instance, translations_data, ServiceTranslation, "service")

        if pricing_tiers_data is not None:
            existing_ids = {pt.get("id") for pt in pricing_tiers_data if "id" in pt}
            instance.pricing_tiers.exclude(id__in=existing_ids).delete()
            for pt_data in pricing_tiers_data:
                pt_translations = pt_data.pop("translations", [])
                tier_id = pt_data.pop("id", None)
                if tier_id:
                    tier = PricingTier.objects.get(id=tier_id, service=instance)
                    for attr, value in pt_data.items():
                        setattr(tier, attr, value)
                    tier.save()
                    _nested_translations_update(tier, pt_translations, PricingTierTranslation, "pricing_tier")
                else:
                    tier = PricingTier.objects.create(service=instance, **pt_data)
                    _nested_translations_create(tier, pt_translations, PricingTierTranslation, "pricing_tier")

        return instance


# ---------------------------------------------------------------------------
# Project + Translations + Images
# ---------------------------------------------------------------------------


class ProjectImageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "alt_text", "order"]


class ProjectTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = ProjectTranslation
        fields = [
            "id", "language", "title", "short_description", "long_description",
            "client_testimonial", "meta_title", "meta_description", "auto_translated",
        ]


class ProjectAdminSerializer(serializers.ModelSerializer):
    translations = ProjectTranslationAdminSerializer(many=True, required=False)
    images = ProjectImageAdminSerializer(many=True, required=False)
    technologies = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Technology.objects.all(), required=False
    )

    class Meta:
        model = Project
        fields = [
            "id", "slug", "client_name", "category", "project_url",
            "year", "duration_months", "technologies", "cover_image",
            "featured", "order", "is_active",
            "translations", "images",
            "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        images_data = validated_data.pop("images", [])
        technologies = validated_data.pop("technologies", [])

        project = Project.objects.create(**validated_data)
        project.technologies.set(technologies)

        _nested_translations_create(project, translations_data, ProjectTranslation, "project")

        for img_data in images_data:
            ProjectImage.objects.create(project=project, **img_data)

        return project

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        images_data = validated_data.pop("images", None)
        technologies = validated_data.pop("technologies", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if technologies is not None:
            instance.technologies.set(technologies)

        _nested_translations_update(instance, translations_data, ProjectTranslation, "project")

        if images_data is not None:
            existing_ids = {img.get("id") for img in images_data if "id" in img}
            instance.images.exclude(id__in=existing_ids).delete()
            for img_data in images_data:
                img_id = img_data.pop("id", None)
                if img_id:
                    img = ProjectImage.objects.get(id=img_id, project=instance)
                    for attr, value in img_data.items():
                        setattr(img, attr, value)
                    img.save()
                else:
                    ProjectImage.objects.create(project=instance, **img_data)

        return instance


# ---------------------------------------------------------------------------
# Blog Post + Category + Tag + Translations
# ---------------------------------------------------------------------------


class BlogPostTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = BlogPostTranslation
        fields = [
            "id", "language", "title", "excerpt", "content",
            "meta_title", "meta_description", "auto_translated",
        ]


class BlogPostAdminSerializer(serializers.ModelSerializer):
    translations = BlogPostTranslationAdminSerializer(many=True, required=False)
    categories = serializers.PrimaryKeyRelatedField(
        many=True, queryset=BlogCategory.objects.all(), required=False
    )
    tags = serializers.PrimaryKeyRelatedField(
        many=True, queryset=BlogTag.objects.all(), required=False
    )

    class Meta:
        model = BlogPost
        fields = [
            "id", "slug", "author", "categories", "tags", "cover_image",
            "status", "published_at", "views_count", "featured",
            "translations", "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "author", "views_count", "created_at", "updated_at"]

    def validate_status(self, value):
        if value == BlogPost.Status.PUBLISHED:
            translations = self.initial_data.get("translations", [])
            if self.instance:
                existing_langs = set(self.instance.translations.values_list("language_id", flat=True))
            else:
                existing_langs = set()
            incoming_langs = {
                t["language"].id
                if hasattr(t.get("language"), "id")
                else t["language"]
                for t in translations
            }
            all_langs = existing_langs | incoming_langs
            active_languages = set(Language.objects.filter(is_active=True).values_list("id", flat=True))
            if not active_languages.issubset(all_langs):
                raise serializers.ValidationError(
                    "Cannot publish: translations are missing for some active languages."
                )
        return value

    def validate_slug(self, value):
        if self.instance and self.instance.status == BlogPost.Status.PUBLISHED:
            if value != self.instance.slug:
                raise serializers.ValidationError(
                    "Cannot change slug of a published post. Create a redirect instead."
                )
        return value

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        categories = validated_data.pop("categories", [])
        tags = validated_data.pop("tags", [])

        post = BlogPost.objects.create(**validated_data)
        post.categories.set(categories)
        post.tags.set(tags)

        _nested_translations_create(post, translations_data, BlogPostTranslation, "post")
        return post

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        categories = validated_data.pop("categories", None)
        tags = validated_data.pop("tags", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if categories is not None:
            instance.categories.set(categories)
        if tags is not None:
            instance.tags.set(tags)

        _nested_translations_update(instance, translations_data, BlogPostTranslation, "post")
        return instance


class BlogCategoryTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = BlogCategoryTranslation
        fields = ["id", "language", "name", "description"]


class BlogCategoryAdminSerializer(serializers.ModelSerializer):
    translations = BlogCategoryTranslationAdminSerializer(many=True, required=False)

    class Meta:
        model = BlogCategory
        fields = ["id", "slug", "color", "order", "is_active", "translations"]
        read_only_fields = ["slug"]

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        cat = super().create(validated_data)
        _nested_translations_create(cat, translations_data, BlogCategoryTranslation, "category")
        return cat

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        _nested_translations_update(instance, translations_data, BlogCategoryTranslation, "category")
        return instance


class BlogTagTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = BlogTagTranslation
        fields = ["id", "language", "name"]


class BlogTagAdminSerializer(serializers.ModelSerializer):
    translations = BlogTagTranslationAdminSerializer(many=True, required=False)

    class Meta:
        model = BlogTag
        fields = ["id", "slug", "translations"]
        read_only_fields = ["slug"]

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        tag = super().create(validated_data)
        _nested_translations_create(tag, translations_data, BlogTagTranslation, "tag")
        return tag

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        _nested_translations_update(instance, translations_data, BlogTagTranslation, "tag")
        return instance


# ---------------------------------------------------------------------------
# Testimonial + Translation
# ---------------------------------------------------------------------------


class TestimonialTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = TestimonialTranslation
        fields = ["id", "language", "content", "auto_translated"]


class TestimonialAdminSerializer(serializers.ModelSerializer):
    translations = TestimonialTranslationAdminSerializer(many=True, required=False)

    class Meta:
        model = Testimonial
        fields = [
            "id", "client_photo", "client_name", "client_company",
            "client_position", "rating", "project", "video_url",
            "is_active", "order", "translations", "created_at",
        ]
        read_only_fields = ["created_at"]

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        obj = super().create(validated_data)
        _nested_translations_create(obj, translations_data, TestimonialTranslation, "testimonial")
        return obj

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        _nested_translations_update(instance, translations_data, TestimonialTranslation, "testimonial")
        return instance


# ---------------------------------------------------------------------------
# FAQ + FAQCategory + Translations
# ---------------------------------------------------------------------------


class FAQTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = FAQTranslation
        fields = ["id", "language", "question", "answer", "auto_translated"]


class FAQAdminSerializer(serializers.ModelSerializer):
    translations = FAQTranslationAdminSerializer(many=True, required=False)

    class Meta:
        model = FAQ
        fields = ["id", "category", "order", "is_active", "translations"]

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        obj = super().create(validated_data)
        _nested_translations_create(obj, translations_data, FAQTranslation, "faq")
        return obj

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        _nested_translations_update(instance, translations_data, FAQTranslation, "faq")
        return instance


class FAQCategoryTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = FAQCategoryTranslation
        fields = ["id", "language", "name"]


class FAQCategoryAdminSerializer(serializers.ModelSerializer):
    translations = FAQCategoryTranslationAdminSerializer(many=True, required=False)

    class Meta:
        model = FAQCategory
        fields = ["id", "slug", "icon", "order", "is_active", "translations"]
        read_only_fields = ["slug"]

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        obj = super().create(validated_data)
        _nested_translations_create(obj, translations_data, FAQCategoryTranslation, "category")
        return obj

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        _nested_translations_update(instance, translations_data, FAQCategoryTranslation, "category")
        return instance


# ---------------------------------------------------------------------------
# Technology
# ---------------------------------------------------------------------------


class TechnologyAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = [
            "id", "name", "slug", "logo", "category", "color", "order", "is_active",
        ]
        read_only_fields = ["slug"]


# ---------------------------------------------------------------------------
# ContactMessage
# ---------------------------------------------------------------------------


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id", "name", "email", "phone", "company", "subject", "message",
            "service_interested", "budget_range", "status",
            "ip_address", "user_agent", "language",
            "created_at", "read_at", "replied_at", "reply_content", "replied_by",
        ]
        read_only_fields = [
            "name", "email", "phone", "company", "subject", "message",
            "service_interested", "budget_range", "ip_address", "user_agent",
            "language", "created_at",
        ]


class ContactMessageReplySerializer(serializers.Serializer):
    reply_content = serializers.CharField(required=True, style={"base_template": "textarea.html"})

    def update(self, instance, validated_data):
        from django.utils import timezone

        instance.reply_content = validated_data["reply_content"]
        instance.status = ContactMessage.Status.REPLIED
        instance.replied_at = timezone.now()
        instance.replied_by = self.context["request"].user
        instance.save(update_fields=["reply_content", "status", "replied_at", "replied_by"])
        return instance


# ---------------------------------------------------------------------------
# SiteConfig + PageSEO + Translations
# ---------------------------------------------------------------------------


class SiteConfigTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = SiteConfigTranslation
        fields = [
            "id", "language", "tagline", "hero_subtitle", "footer_description",
            "whatsapp_message", "seo_default_title", "seo_default_description",
        ]


class SiteConfigAdminSerializer(serializers.ModelSerializer):
    translations = SiteConfigTranslationAdminSerializer(many=True, required=False)

    class Meta:
        model = SiteConfig
        fields = [
            "site_name", "site_email", "site_phone", "site_address",
            "whatsapp_number", "logo_light", "logo_dark", "favicon",
            "linkedin_url", "github_url", "instagram_url", "facebook_url", "twitter_url",
            "ga4_property_id", "ga4_measurement_id",
            "google_search_console_verification",
            "recaptcha_site_key", "recaptcha_secret_key",
            "translations", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        _nested_translations_update(instance, translations_data, SiteConfigTranslation, "config")
        return instance


class PageSEOTranslationAdminSerializer(serializers.ModelSerializer):
    language = serializers.PrimaryKeyRelatedField(queryset=Language.objects.filter(is_active=True))

    class Meta:
        model = PageSEOTranslation
        fields = ["id", "language", "meta_title", "meta_description"]


class PageSEOAdminSerializer(serializers.ModelSerializer):
    translations = PageSEOTranslationAdminSerializer(many=True, required=False)

    class Meta:
        model = PageSEO
        fields = ["page_key", "og_image", "translations"]

    def create(self, validated_data):
        translations_data = validated_data.pop("translations", [])
        obj = super().create(validated_data)
        _nested_translations_create(obj, translations_data, PageSEOTranslation, "page")
        return obj

    def update(self, instance, validated_data):
        translations_data = validated_data.pop("translations", None)
        instance = super().update(instance, validated_data)
        _nested_translations_update(instance, translations_data, PageSEOTranslation, "page")
        return instance


# ---------------------------------------------------------------------------
# Language
# ---------------------------------------------------------------------------


class LanguageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "code", "name", "native_name", "is_default", "is_active", "is_rtl", "order"]
        read_only_fields = ["code"]


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------


class UserAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name", "role",
            "avatar", "is_active", "is_staff", "last_login", "date_joined",
        ]


class UserAdminCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})

    class Meta:
        model = User
        fields = [
            "id", "email", "password", "first_name", "last_name", "role",
            "avatar", "phone", "is_active", "is_staff",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name", "role",
            "avatar", "phone", "is_active", "is_staff",
        ]
        read_only_fields = ["email"]


# ---------------------------------------------------------------------------
# Media Upload
# ---------------------------------------------------------------------------


ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
MAX_UPLOAD_SIZE = 5 * 1024 * 1024


class MediaUploadSerializer(serializers.Serializer):
    file = serializers.ImageField(required=True)

    def validate_file(self, value):
        ext = value.name.rsplit(".", 1)[-1].lower() if "." in value.name else ""
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f"Format '{ext}' non autorisé. Formats acceptés : {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )
        if value.size > MAX_UPLOAD_SIZE:
            raise serializers.ValidationError(
                f"Fichier trop volumineux ({value.size / 1024 / 1024:.1f} MB). Maximum : 5 MB."
            )
        return value
