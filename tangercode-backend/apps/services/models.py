from autoslug import AutoSlugField
from django.conf import settings
from django.db import models

from apps.core.mixins import TranslatableMixin


class Technology(models.Model):
    class Category(models.TextChoices):
        FRONTEND = "frontend", "Frontend"
        BACKEND = "backend", "Backend"
        MOBILE = "mobile", "Mobile"
        DATABASE = "database", "Database"
        DEVOPS = "devops", "DevOps"
        DESIGN = "design", "Design"

    name = models.CharField(max_length=50, unique=True)
    slug = AutoSlugField(populate_from="name", unique=True)
    logo = models.ImageField(upload_to="technologies/", null=True, blank=True)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.FRONTEND)
    color = models.CharField(max_length=7, default="#0052CC")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Technology"
        verbose_name_plural = "Technologies"

    def __str__(self):
        return self.name


class Service(models.Model, TranslatableMixin):
    slug = AutoSlugField(populate_from="get_title", unique=True)
    icon = models.CharField(max_length=50, default="code", help_text="Lucide icon name")
    cover_image = models.ImageField(upload_to="services/", null=True, blank=True)
    technologies = models.ManyToManyField(Technology, blank=True, related_name="services")
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "slug"]
        verbose_name = "Service"
        verbose_name_plural = "Services"

    def __str__(self):
        if not self.pk:
            return self.slug or "New Service"
        translation = self.get_translation()
        return translation.title if translation else self.slug

    def get_title(self):
        return str(self)


class ServiceTranslation(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    short_description = models.TextField(max_length=300)
    long_description = models.TextField(blank=True, default="")
    meta_title = models.CharField(max_length=120, blank=True, default="")
    meta_description = models.TextField(max_length=320, blank=True, default="")
    auto_translated = models.BooleanField(default=False)
    last_edited_manually = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [("service", "language")]
        verbose_name = "Service Translation"
        verbose_name_plural = "Service Translations"

    def __str__(self):
        return f"{self.title} ({self.language.code})"


class PricingTier(models.Model, TranslatableMixin):
    class Code(models.TextChoices):
        STARTER = "starter", "Starter"
        PRO = "pro", "Pro"
        PREMIUM = "premium", "Premium"

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="pricing_tiers")
    code = models.CharField(max_length=20, choices=Code.choices, default=Code.STARTER)
    price_mad = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_eur = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_usd = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_custom_quote = models.BooleanField(default=False)
    delivery_days = models.IntegerField(null=True, blank=True)
    revisions_count = models.IntegerField(null=True, blank=True)
    support_days = models.IntegerField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["service", "order"]
        verbose_name = "Pricing Tier"
        verbose_name_plural = "Pricing Tiers"

    def __str__(self):
        translation = self.get_translation()
        return f"{translation.name if translation else self.code} — {self.service}"


class PricingTierTranslation(models.Model):
    pricing_tier = models.ForeignKey(PricingTier, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    features = models.JSONField(default=list, blank=True)
    cta_text = models.CharField(max_length=50, default="Commander")
    auto_translated = models.BooleanField(default=False)

    class Meta:
        unique_together = [("pricing_tier", "language")]
        verbose_name = "Pricing Tier Translation"
        verbose_name_plural = "Pricing Tier Translations"

    def __str__(self):
        return f"{self.name} ({self.language.code})"
