from django.contrib import admin

from .models import Testimonial, TestimonialTranslation


class TestimonialTranslationInline(admin.TabularInline):
    model = TestimonialTranslation
    extra = 0
    max_num = 3


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("client_name", "client_company", "rating", "is_active", "order")
    list_filter = ("is_active", "rating")
    list_editable = ("order", "is_active")
    search_fields = ("client_name", "client_company")
    inlines = [TestimonialTranslationInline]
