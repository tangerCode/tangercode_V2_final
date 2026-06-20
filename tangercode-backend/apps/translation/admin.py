from django.contrib import admin

from apps.translation.models import AIProvider, TranslationLog, TranslationPrompt


@admin.register(AIProvider)
class AIProviderAdmin(admin.ModelAdmin):
    list_display = ["name", "provider_type", "model_name", "is_active", "is_default"]
    list_filter = ["is_active", "is_default", "provider_type"]
    search_fields = ["name", "model_name"]


@admin.register(TranslationPrompt)
class TranslationPromptAdmin(admin.ModelAdmin):
    list_display = ["name", "field_type", "is_default"]
    list_filter = ["field_type", "is_default"]


@admin.register(TranslationLog)
class TranslationLogAdmin(admin.ModelAdmin):
    list_display = ["content_type", "object_id", "field_name", "source_language",
                     "target_language", "status", "cost_usd", "created_at"]
    list_filter = ["status", "source_language", "target_language", "created_at"]
    search_fields = ["field_name", "source_text"]
    readonly_fields = ["content_type", "object_id", "source_text", "translated_text",
                       "status", "tokens_used", "cost_usd", "duration_ms", "created_at"]
    date_hierarchy = "created_at"
