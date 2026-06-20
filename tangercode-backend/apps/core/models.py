from django.conf import settings
from django.db import models


class SiteConfig(models.Model):
    site_name = models.CharField(max_length=100, default="TANGER CODE")
    site_email = models.EmailField(default="contact@tangercode.com")
    site_phone = models.CharField(max_length=30, blank=True, default="")
    site_address = models.TextField(blank=True, default="")
    whatsapp_number = models.CharField(max_length=20, blank=True, default="")
    logo_light = models.ImageField(upload_to="config/", null=True, blank=True)
    logo_dark = models.ImageField(upload_to="config/", null=True, blank=True)
    favicon = models.ImageField(upload_to="config/", null=True, blank=True)
    linkedin_url = models.URLField(blank=True, default="")
    github_url = models.URLField(blank=True, default="")
    instagram_url = models.URLField(blank=True, default="")
    facebook_url = models.URLField(blank=True, default="")
    twitter_url = models.URLField(blank=True, default="")
    ga4_property_id = models.CharField(max_length=50, blank=True, default="")
    ga4_measurement_id = models.CharField(max_length=50, blank=True, default="")
    google_search_console_verification = models.CharField(max_length=100, blank=True, default="")
    recaptcha_site_key = models.CharField(max_length=100, blank=True, default="")
    recaptcha_secret_key = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configuration"

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def get_translation(self, language_code=None):
        from django.utils.translation import get_language

        if language_code is None:
            language_code = get_language() or "fr"
        try:
            return self.translations.get(language__code=language_code)
        except SiteConfigTranslation.DoesNotExist:
            pass
        return self.translations.filter(language__is_default=True).first()

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class SiteConfigTranslation(models.Model):
    config = models.ForeignKey(SiteConfig, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    tagline = models.CharField(max_length=255, blank=True, default="")
    hero_subtitle = models.TextField(blank=True, default="")
    footer_description = models.TextField(blank=True, default="")
    whatsapp_message = models.TextField(blank=True, default="")
    seo_default_title = models.CharField(max_length=120, blank=True, default="")
    seo_default_description = models.TextField(blank=True, default="")

    class Meta:
        unique_together = [("config", "language")]
        verbose_name = "Site Config Translation"
        verbose_name_plural = "Site Config Translations"

    def __str__(self):
        return f"Config — {self.language.code}"


class PageSEO(models.Model):
    page_key = models.CharField(max_length=50, unique=True)
    og_image = models.ImageField(upload_to="seo/", null=True, blank=True)

    class Meta:
        verbose_name = "Page SEO"
        verbose_name_plural = "Pages SEO"

    def __str__(self):
        return self.page_key

    def get_translation(self, language_code=None):
        from django.utils.translation import get_language

        if language_code is None:
            language_code = get_language() or "fr"
        try:
            return self.translations.get(language__code=language_code)
        except PageSEOTranslation.DoesNotExist:
            pass
        return self.translations.filter(language__is_default=True).first()


class PageSEOTranslation(models.Model):
    page = models.ForeignKey(PageSEO, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    meta_title = models.CharField(max_length=120)
    meta_description = models.TextField(max_length=320, blank=True, default="")

    class Meta:
        unique_together = [("page", "language")]
        verbose_name = "Page SEO Translation"
        verbose_name_plural = "Page SEO Translations"

    def __str__(self):
        return f"{self.page.page_key} — {self.language.code}"
