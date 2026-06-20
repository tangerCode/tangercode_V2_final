from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from cryptography.fernet import Fernet


class AIProvider(models.Model):
    class ProviderType(models.TextChoices):
        CLAUDE = "claude", "Anthropic Claude"
        OPENAI = "openai", "OpenAI"
        GOOGLE = "google", "Google Gemini"

    name = models.CharField(max_length=100)
    provider_type = models.CharField(max_length=20, choices=ProviderType.choices, default=ProviderType.CLAUDE)
    api_key = models.TextField(help_text="Encrypted at rest with Fernet")
    base_url = models.URLField(blank=True, default="", help_text="Override API base URL")
    model_name = models.CharField(max_length=100, default="claude-sonnet-4-20250514")
    max_tokens = models.IntegerField(default=4096)
    temperature = models.FloatField(default=0.3)
    monthly_cost_limit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                              help_text="Optional monthly USD cost cap. Translation is blocked when exceeded.")
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "AI Provider"
        verbose_name_plural = "AI Providers"

    def __str__(self):
        return f"{self.name} ({self.provider_type} / {self.model_name})"

    @property
    def decrypted_api_key(self) -> str:
        if not self.api_key:
            return ""
        key = settings.FERNET_ENCRYPTION_KEY.encode() if settings.FERNET_ENCRYPTION_KEY else Fernet.generate_key()
        return Fernet(key).decrypt(self.api_key.encode()).decode()

    def set_api_key(self, raw_key: str):
        key = settings.FERNET_ENCRYPTION_KEY.encode() if settings.FERNET_ENCRYPTION_KEY else Fernet.generate_key()
        self.api_key = Fernet(key).encrypt(raw_key.encode()).decode()

    def save(self, *args, **kwargs):
        if self.is_default:
            AIProvider.objects.filter(is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class TranslationPrompt(models.Model):
    class FieldType(models.TextChoices):
        DEFAULT = "default", "Texte court (titre, nom)"
        LONG_TEXT = "long_text", "Texte long (description)"
        RICH_TEXT = "rich_text", "Texte riche (article, HTML)"
        LIST = "list", "Liste (features)"

    name = models.CharField(max_length=100)
    field_type = models.CharField(max_length=20, choices=FieldType.choices, default=FieldType.DEFAULT)
    prompt_template = models.TextField(help_text="Use {content}, {source_language}, {target_language}, {field_type}")
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Translation Prompt"
        verbose_name_plural = "Translation Prompts"

    def __str__(self):
        return self.name

    def format(self, **kwargs) -> str:
        return self.prompt_template.format(**kwargs)


class TranslationLog(models.Model):
    class Status(models.TextChoices):
        SUCCESS = "success", "Success"
        ERROR = "error", "Error"
        SKIPPED = "skipped", "Skipped (manual edit)"

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    field_name = models.CharField(max_length=100)
    source_language = models.CharField(max_length=5)
    target_language = models.CharField(max_length=5)
    source_text = models.TextField(help_text="Truncated to 500 chars")
    translated_text = models.TextField(blank=True, default="", help_text="Truncated to 500 chars")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUCCESS)
    tokens_used = models.IntegerField(default=0)
    cost_usd = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    ai_provider = models.ForeignKey(AIProvider, on_delete=models.SET_NULL, null=True, blank=True)
    duration_ms = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = "Translation Log"
        verbose_name_plural = "Translation Logs"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.content_type} #{self.object_id} — {self.field_name} ({self.source_language}→{self.target_language})"
