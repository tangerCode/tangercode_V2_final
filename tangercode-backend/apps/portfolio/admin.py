from django.contrib import admin
from django.utils.html import format_html

from .models import Project, ProjectImage, ProjectTranslation


class ProjectTranslationInline(admin.TabularInline):
    model = ProjectTranslation
    extra = 0
    max_num = 3
    fields = ("language", "title", "short_description", "auto_translated")


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("image", "image_preview", "alt_text", "order")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.pk and obj.image:
            return format_html('<img src="{}" style="max-height:60px" />', obj.image.url)
        return "—"
    image_preview.short_description = "Preview"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title_display", "slug", "client_name", "category", "year", "featured", "is_active", "order", "translation_status")
    list_filter = ("category", "is_active", "featured", "year", "technologies")
    list_editable = ("order", "featured", "is_active")
    search_fields = ("slug", "client_name", "translations__title")
    filter_horizontal = ("technologies",)
    inlines = [ProjectTranslationInline, ProjectImageInline]
    date_hierarchy = "created_at"
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


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ("project", "image_preview", "alt_text", "order")
    list_editable = ("order",)
    list_filter = ("project",)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:60px" />', obj.image.url)
        return "—"
    image_preview.short_description = "Preview"
