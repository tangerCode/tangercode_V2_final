from django.contrib import admin

from .models import Language


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "native_name", "is_default", "is_active", "is_rtl", "order")
    list_filter = ("is_active", "is_rtl", "is_default")
    list_editable = ("order",)
    search_fields = ("code", "name", "native_name")
