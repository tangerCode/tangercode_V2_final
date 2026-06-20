from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html

from .models import BlogCategory, BlogCategoryTranslation, BlogPost, BlogPostTranslation, BlogTag, BlogTagTranslation


class BlogCategoryTranslationInline(admin.TabularInline):
    model = BlogCategoryTranslation
    extra = 0
    max_num = 3


class BlogTagTranslationInline(admin.TabularInline):
    model = BlogTagTranslation
    extra = 0
    max_num = 3


class BlogPostTranslationInline(admin.TabularInline):
    model = BlogPostTranslation
    extra = 0
    max_num = 3
    fields = ("language", "title", "excerpt", "auto_translated")


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name_display", "slug", "color", "is_active", "order")
    list_editable = ("order", "is_active")
    inlines = [BlogCategoryTranslationInline]

    @admin.display(description="Name")
    def name_display(self, obj):
        t = obj.get_translation()
        return t.name if t else obj.slug


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ("name_display", "slug")
    search_fields = ("translations__name",)
    inlines = [BlogTagTranslationInline]

    @admin.display(description="Name")
    def name_display(self, obj):
        t = obj.get_translation()
        return t.name if t else obj.slug


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title_display", "slug", "author", "status", "featured", "published_at", "views_count", "translation_status")
    list_filter = ("status", "featured", "categories", "tags", "created_at")
    search_fields = ("slug", "translations__title")
    filter_horizontal = ("categories", "tags")
    inlines = [BlogPostTranslationInline]
    readonly_fields = ("views_count", "created_at", "updated_at")
    date_hierarchy = "created_at"
    actions = ["publish", "archive", "make_featured"]
    fieldsets = (
        (None, {"fields": ("slug", "author", "cover_image")}),
        ("Content", {"fields": ("categories", "tags")}),
        ("Publication", {"fields": ("status", "featured", "published_at")}),
        ("Stats", {"fields": ("views_count", "created_at", "updated_at")}),
    )

    @admin.display(description="Title")
    def title_display(self, obj):
        t = obj.get_translation()
        return t.title if t else obj.slug

    @admin.display(description="Translations")
    def translation_status(self, obj):
        count = obj.translations.count()
        color = "green" if count == 3 else "orange"
        return format_html('<span style="color:{}; font-weight:600">{}/3</span>', color, count)

    @admin.action(description="Publish selected")
    def publish(self, request, queryset):
        queryset.update(status=BlogPost.Status.PUBLISHED, published_at=timezone.now())

    @admin.action(description="Archive selected")
    def archive(self, request, queryset):
        queryset.update(status=BlogPost.Status.ARCHIVED)

    @admin.action(description="Mark as featured")
    def make_featured(self, request, queryset):
        queryset.update(featured=True)
