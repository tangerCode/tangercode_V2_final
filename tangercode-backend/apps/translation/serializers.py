from rest_framework import serializers

from apps.translation.models import AIProvider, TranslationLog, TranslationPrompt
from apps.languages.models import Language


class AIProviderSerializer(serializers.ModelSerializer):
    api_key = serializers.CharField(write_only=True, required=False, allow_blank=True,
                                     style={"input_type": "password"})
    decrypted_api_key = serializers.CharField(read_only=True)

    class Meta:
        model = AIProvider
        fields = [
            "id", "name", "provider_type", "api_key", "decrypted_api_key",
            "base_url", "model_name", "max_tokens", "temperature",
            "is_active", "is_default", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def create(self, validated_data):
        raw_key = validated_data.pop("api_key", "")
        provider = AIProvider(**validated_data)
        if raw_key:
            provider.set_api_key(raw_key)
        provider.save()
        return provider

    def update(self, instance, validated_data):
        raw_key = validated_data.pop("api_key", None)
        instance = super().update(instance, validated_data)
        if raw_key:
            instance.set_api_key(raw_key)
            instance.save(update_fields=["api_key"])
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["decrypted_api_key"] = instance.decrypted_api_key[:3] + "***" if instance.decrypted_api_key else ""
        return data


class TranslationPromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranslationPrompt
        fields = ["id", "name", "field_type", "prompt_template", "is_default"]


class TranslationLogSerializer(serializers.ModelSerializer):
    content_type_name = serializers.CharField(source="content_type.model", read_only=True)

    class Meta:
        model = TranslationLog
        fields = [
            "id", "content_type_name", "object_id", "field_name",
            "source_language", "target_language", "source_text", "translated_text",
            "status", "tokens_used", "cost_usd", "ai_provider",
            "duration_ms", "created_at",
        ]


class OnDemandTranslateSerializer(serializers.Serializer):
    content = serializers.CharField(required=True)
    source_lang = serializers.CharField(required=True, max_length=5)
    target_lang = serializers.CharField(required=True, max_length=5)
    field_type = serializers.CharField(required=False, default="default", max_length=20)
    prompt_id = serializers.IntegerField(required=False, allow_null=True)
