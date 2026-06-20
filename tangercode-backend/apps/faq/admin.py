from django.contrib import admin

from .models import FAQ, FAQCategory, FAQCategoryTranslation, FAQTranslation


class FAQCategoryTranslationInline(admin.TabularInline):
    model = FAQCategoryTranslation
    extra = 0
    max_num = 3


class FAQTranslationInline(admin.TabularInline):
    model = FAQTranslation
    extra = 0
    max_num = 3


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ("name_display", "slug", "icon", "is_active", "order")
    list_editable = ("order", "is_active")
    inlines = [FAQCategoryTranslationInline]

    @admin.display(description="Name")
    def name_display(self, obj):
        t = obj.get_translation()
        return t.name if t else obj.slug


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question_display", "category", "is_active", "order")
    list_filter = ("category", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("translations__question", "translations__answer")
    inlines = [FAQTranslationInline]

    @admin.display(description="Question")
    def question_display(self, obj):
        t = obj.get_translation()
        return t.question[:80] if t else f"FAQ #{obj.pk}"
