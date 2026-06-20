from django.contrib import admin

from .models import PageSEO, PageSEOTranslation, SiteConfig, SiteConfigTranslation


class SiteConfigTranslationInline(admin.TabularInline):
    model = SiteConfigTranslation
    extra = 0
    max_num = 3


@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    inlines = [SiteConfigTranslationInline]
    fieldsets = (
        ("General", {"fields": ("site_name", "site_email", "site_phone", "site_address")}),
        ("Branding", {"fields": ("logo_light", "logo_dark", "favicon")}),
        ("WhatsApp", {"fields": ("whatsapp_number",)}),
        ("Social", {"fields": ("linkedin_url", "github_url", "instagram_url", "facebook_url", "twitter_url")}),
        ("Google Analytics", {"fields": ("ga4_property_id", "ga4_measurement_id", "google_search_console_verification")}),
        ("reCAPTCHA", {"fields": ("recaptcha_site_key", "recaptcha_secret_key")}),
    )

    def has_add_permission(self, request):
        return not SiteConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


class PageSEOTranslationInline(admin.TabularInline):
    model = PageSEOTranslation
    extra = 0
    max_num = 3


@admin.register(PageSEO)
class PageSEOAdmin(admin.ModelAdmin):
    list_display = ("page_key", "has_translations")
    search_fields = ("page_key",)
    inlines = [PageSEOTranslationInline]

    def has_translations(self, obj):
        count = obj.translations.count()
        return f"{count}/3"
    has_translations.short_description = "Translations"
