from autoslug import AutoSlugField
from django.db import models

from apps.core.mixins import TranslatableMixin


class FAQCategory(models.Model, TranslatableMixin):
    slug = AutoSlugField(populate_from="get_name", unique=True)
    icon = models.CharField(max_length=50, null=True, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "FAQ Category"
        verbose_name_plural = "FAQ Categories"

    def __str__(self):
        if not self.pk:
            return self.slug or "New FAQ Category"
        translation = self.get_translation()
        return translation.name if translation else self.slug

    def get_name(self):
        return str(self)


class FAQCategoryTranslation(models.Model):
    category = models.ForeignKey(FAQCategory, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = [("category", "language")]
        verbose_name = "FAQ Category Translation"
        verbose_name_plural = "FAQ Category Translations"

    def __str__(self):
        return f"{self.name} ({self.language.code})"


class FAQ(models.Model, TranslatableMixin):
    category = models.ForeignKey(FAQCategory, on_delete=models.CASCADE, related_name="faqs")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "order"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        if not self.pk:
            return "New FAQ"
        translation = self.get_translation()
        return translation.question[:60] if translation else f"FAQ #{self.pk}"


class FAQTranslation(models.Model):
    faq = models.ForeignKey(FAQ, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    question = models.CharField(max_length=300)
    answer = models.TextField()
    auto_translated = models.BooleanField(default=False)

    class Meta:
        unique_together = [("faq", "language")]
        verbose_name = "FAQ Translation"
        verbose_name_plural = "FAQ Translations"

    def __str__(self):
        return f"{self.question[:50]} ({self.language.code})"
