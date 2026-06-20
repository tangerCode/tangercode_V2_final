from autoslug import AutoSlugField
from django.conf import settings
from django.db import models

from apps.core.mixins import TranslatableMixin


class BlogCategory(models.Model, TranslatableMixin):
    slug = AutoSlugField(populate_from="get_name", unique=True)
    color = models.CharField(max_length=7, default="#0052CC")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Blog Category"
        verbose_name_plural = "Blog Categories"

    def __str__(self):
        if not self.pk:
            return self.slug or "New Category"
        translation = self.get_translation()
        return translation.name if translation else self.slug

    def get_name(self):
        return str(self)


class BlogCategoryTranslation(models.Model):
    category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = [("category", "language")]
        verbose_name = "Blog Category Translation"
        verbose_name_plural = "Blog Category Translations"

    def __str__(self):
        return f"{self.name} ({self.language.code})"


class BlogTag(models.Model, TranslatableMixin):
    slug = AutoSlugField(populate_from="get_name", unique=True)

    class Meta:
        ordering = ["slug"]
        verbose_name = "Blog Tag"
        verbose_name_plural = "Blog Tags"

    def __str__(self):
        if not self.pk:
            return self.slug or "New Tag"
        translation = self.get_translation()
        return translation.name if translation else self.slug

    def get_name(self):
        return str(self)


class BlogTagTranslation(models.Model):
    tag = models.ForeignKey(BlogTag, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = [("tag", "language")]
        verbose_name = "Blog Tag Translation"
        verbose_name_plural = "Blog Tag Translations"

    def __str__(self):
        return f"{self.name} ({self.language.code})"


class BlogPost(models.Model, TranslatableMixin):
    class Status(models.TextChoices):
        DRAFT = "draft", "Brouillon"
        PUBLISHED = "published", "Publié"
        ARCHIVED = "archived", "Archivé"

    slug = AutoSlugField(populate_from="get_title", unique=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="blog_posts")
    categories = models.ManyToManyField(BlogCategory, blank=True, related_name="posts")
    tags = models.ManyToManyField(BlogTag, blank=True, related_name="posts")
    cover_image = models.ImageField(upload_to="blog/", null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"

    def __str__(self):
        if not self.pk:
            return self.slug or "New Post"
        translation = self.get_translation()
        return translation.title if translation else self.slug

    def get_title(self):
        return str(self)


class BlogPostTranslation(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    excerpt = models.TextField(max_length=500, blank=True, default="")
    content = models.TextField(blank=True, default="")
    meta_title = models.CharField(max_length=120, blank=True, default="")
    meta_description = models.TextField(max_length=320, blank=True, default="")
    auto_translated = models.BooleanField(default=False)

    class Meta:
        unique_together = [("post", "language")]
        verbose_name = "Blog Post Translation"
        verbose_name_plural = "Blog Post Translations"

    def __str__(self):
        return f"{self.title} ({self.language.code})"
