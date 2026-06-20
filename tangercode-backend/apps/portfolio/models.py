from autoslug import AutoSlugField
from django.conf import settings
from django.db import models

from apps.core.mixins import TranslatableMixin


class Project(models.Model, TranslatableMixin):
    class Category(models.TextChoices):
        WEBSITE = "website", "Site web"
        ECOMMERCE = "ecommerce", "E-commerce"
        PLATFORM = "platform", "Plateforme"
        ERP = "erp", "ERP"
        MOBILE = "mobile", "Mobile"

    slug = AutoSlugField(populate_from="get_title", unique=True)
    client_name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.WEBSITE)
    project_url = models.URLField(null=True, blank=True)
    year = models.IntegerField()
    duration_months = models.IntegerField(null=True, blank=True)
    technologies = models.ManyToManyField("services.Technology", blank=True, related_name="projects")
    cover_image = models.ImageField(upload_to="projects/", null=True, blank=True)
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "order"]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        if not self.pk:
            return self.slug or "New Project"
        translation = self.get_translation()
        return translation.title if translation else self.slug

    def get_title(self):
        return str(self)


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="projects/gallery/")
    alt_text = models.CharField(max_length=200, blank=True, default="")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Project Image"
        verbose_name_plural = "Project Images"

    def __str__(self):
        return f"Image {self.order} — {self.project}"


class ProjectTranslation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    short_description = models.TextField(max_length=300)
    long_description = models.TextField(blank=True, default="")
    client_testimonial = models.TextField(null=True, blank=True)
    meta_title = models.CharField(max_length=120, blank=True, default="")
    meta_description = models.TextField(max_length=320, blank=True, default="")
    auto_translated = models.BooleanField(default=False)
    last_edited_manually = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [("project", "language")]
        verbose_name = "Project Translation"
        verbose_name_plural = "Project Translations"

    def __str__(self):
        return f"{self.title} ({self.language.code})"
