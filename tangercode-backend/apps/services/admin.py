from django.contrib import admin
from django.utils.html import format_html

from .models import PricingTier, PricingTierTranslation, Service, ServiceTranslation, Technology


class ServiceTranslationInline(admin.TabularInline):
    model = ServiceTranslation
    extra = 0
    max_num = 3
    fields = ("language", "title", "short_description", "auto_translated")


class PricingTierTranslationInline(admin.TabularInline):
    model = PricingTierTranslation
    extra = 0
    max_num = 3


class PricingTierInline(admin.TabularInline):
    model = PricingTier
    extra = 0
    fields = ("code", "price_mad", "is_custom_quote", "is_featured", "is_active", "order")
    show_change_link = True


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "category", "color", "is_active", "order", "logo_preview")
    list_filter = ("category", "is_active")
    list_editable = ("order",)
    search_fields = ("name", "slug")

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height:30px" />', obj.logo.url)
        return "—"
    logo_preview.short_description = "Logo"


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title_display", "slug", "featured", "is_active", "order", "translation_status")
    list_filter = ("is_active", "featured", "technologies")
    list_editable = ("order", "featured", "is_active")
    search_fields = ("slug", "translations__title")
    filter_horizontal = ("technologies",)
    inlines = [ServiceTranslationInline, PricingTierInline]
    fieldsets = (
        (None, {"fields": ("slug", "icon", "cover_image")}),
        ("Config", {"fields": ("technologies", "featured", "order", "is_active")}),
    )
    readonly_fields = ("slug",)
    actions = ["make_featured", "make_unfeatured"]

    @admin.display(description="Title")
    def title_display(self, obj):
        t = obj.get_translation()
        return t.title if t else obj.slug

    @admin.display(description="Translations")
    def translation_status(self, obj):
        count = obj.translations.count()
        color = "green" if count == 3 else "orange"
        return format_html('<span style="color:{}; font-weight:600">{}/3</span>', color, count)

    @admin.action(description="Mark as featured")
    def make_featured(self, request, queryset):
        queryset.update(featured=True)

    @admin.action(description="Unmark featured")
    def make_unfeatured(self, request, queryset):
        queryset.update(featured=False)


@admin.register(PricingTier)
class PricingTierAdmin(admin.ModelAdmin):
    list_display = ("name_display", "service", "code", "price_mad", "is_custom_quote", "is_featured", "is_active", "order")
    list_filter = ("service", "is_active", "is_featured", "is_custom_quote")
    list_editable = ("order", "is_active", "is_featured")
    search_fields = ("translations__name", "service__translations__title")
    inlines = [PricingTierTranslationInline]

    @admin.display(description="Name")
    def name_display(self, obj):
        t = obj.get_translation()
        return t.name if t else obj.code


@admin.register(ServiceTranslation)
class ServiceTranslationAdmin(admin.ModelAdmin):
    list_display = ("service", "language", "title", "auto_translated")
    list_filter = ("language", "auto_translated")
    search_fields = ("title",)
