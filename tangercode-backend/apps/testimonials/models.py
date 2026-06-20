from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from apps.core.mixins import TranslatableMixin


class Testimonial(models.Model, TranslatableMixin):
    client_photo = models.ImageField(upload_to="testimonials/", null=True, blank=True)
    client_name = models.CharField(max_length=100)
    client_company = models.CharField(max_length=100)
    client_position = models.CharField(max_length=100, null=True, blank=True)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=5)
    project = models.ForeignKey(
        "portfolio.Project", on_delete=models.SET_NULL, null=True, blank=True, related_name="testimonials"
    )
    video_url = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.client_name} — {self.client_company}"


class TestimonialTranslation(models.Model):
    testimonial = models.ForeignKey(Testimonial, on_delete=models.CASCADE, related_name="translations")
    language = models.ForeignKey("languages.Language", on_delete=models.CASCADE)
    content = models.TextField()
    auto_translated = models.BooleanField(default=False)
    last_edited_manually = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = [("testimonial", "language")]
        verbose_name = "Testimonial Translation"
        verbose_name_plural = "Testimonial Translations"

    def __str__(self):
        return f"Testimonial {self.testimonial_id} ({self.language.code})"
