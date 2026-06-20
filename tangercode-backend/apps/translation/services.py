import hashlib
import logging
import time
from datetime import datetime, timezone as dt_timezone

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

from apps.languages.models import Language

logger = logging.getLogger(__name__)

_translation_cache: dict[str, dict] = {}

DEFAULT_PROMPT = """You are a professional translator specializing in tech and web development content.

TASK: Translate the following {field_type} from {source_language} to {target_language}.

RULES:
- Maintain the original tone and style
- Keep technical terms in English (e.g. "Next.js", "Django", "API", "ERP")
- Keep brand names unchanged ("TANGER CODE")
- Preserve HTML tags if present
- For Arabic: use Modern Standard Arabic, professional tone
- For French: use a professional but accessible tone
- Return ONLY the translation, no explanations, no quotes

CONTENT TO TRANSLATE:
{content}

TRANSLATION:"""


class TranslationService:
    def __init__(self, provider=None):
        from apps.translation.models import AIProvider

        self.provider = provider or AIProvider.objects.filter(is_default=True, is_active=True).first()
        if not self.provider:
            logger.warning("No active default AI provider configured.")
        self._client = None  # type: ignore

    def _get_client(self):
        if self._client is not None:
            return self._client
        if not self.provider:
            return None
        import anthropic
        api_key = self.provider.decrypted_api_key or settings.ANTHROPIC_API_KEY
        if not api_key:
            raise ValueError("No API key configured. Set ANTHROPIC_API_KEY in .env or configure an AI Provider.")
        self._client = anthropic.Anthropic(
            api_key=api_key,
            base_url=self.provider.base_url or None,
        )
        return self._client

    def translate(self, text, source_lang, target_lang, field_type="default",
                  prompt_template=None):
        if not text or not text.strip():
            return {"translated_text": "", "tokens_used": 0, "cost_usd": 0,
                    "duration_ms": 0, "status": "skipped", "error_message": "Empty source text"}

        cache_key = hashlib.sha256(
            f"{text}|{source_lang}|{target_lang}|{field_type}|{self.provider.model_name if self.provider else 'default'}".encode()
        ).hexdigest()
        if cache_key in _translation_cache:
            return _translation_cache[cache_key]

        prompt = self._resolve_prompt(prompt_template, field_type)
        full_prompt = prompt.format(
            content=text,
            source_language=source_lang.upper(),
            target_language=target_lang.upper(),
            field_type=field_type,
        )

        start = time.monotonic()
        try:
            client = self._get_client()
            if not client:
                raise ValueError("No AI provider configured.")
            response = client.messages.create(
                model=self.provider.model_name,
                max_tokens=self.provider.max_tokens,
                temperature=self.provider.temperature,
                messages=[{"role": "user", "content": full_prompt}],
            )
            translated_text = response.content[0].text.strip()
            input_tokens = response.usage.input_tokens
            output_tokens = response.usage.output_tokens
            tokens_used = input_tokens + output_tokens
            cost_usd = self._estimate_cost(input_tokens, output_tokens)
            duration_ms = int((time.monotonic() - start) * 1000)
            result = {
                "translated_text": translated_text,
                "tokens_used": tokens_used,
                "cost_usd": cost_usd,
                "duration_ms": duration_ms,
                "status": "success",
            }
        except Exception as e:
            logger.exception("Translation failed: %s→%s field=%s", source_lang, target_lang, field_type)
            result = {
                "translated_text": "",
                "tokens_used": 0,
                "cost_usd": 0,
                "duration_ms": int((time.monotonic() - start) * 1000),
                "status": "error",
                "error_message": str(e)[:500],
            }

        _translation_cache[cache_key] = result
        return result

    def translate_object(self, instance, source_language, target_languages, fields=None, force=False):
        from apps.translation.models import TranslationLog

        if isinstance(source_language, str):
            source_language = Language.objects.filter(code=source_language, is_active=True).first()
        if not source_language:
            return {"error": "Invalid source language"}

        if target_languages and isinstance(target_languages[0], str):
            target_languages = Language.objects.filter(code__in=target_languages, is_active=True)

        if not target_languages:
            target_languages = Language.objects.filter(is_active=True).exclude(pk=source_language.pk)

        source_translation = self._get_source_translation(instance, source_language)
        if not source_translation:
            return {"error": "No source translation found"}

        available_fields = self._detect_translatable_fields(source_translation)
        if fields:
            available_fields = [f for f in available_fields if f in fields]

        TranslationModel = type(source_translation)
        TranslationLogModel = TranslationLog
        content_type = ContentType.objects.get_for_model(instance)
        results = {}

        for target_lang in target_languages:
            target_translation = self._get_or_init_translation(instance, TranslationModel, target_lang)
            for field_name in available_fields:
                if not force:
                    last_edited = getattr(target_translation, "last_edited_manually", None)
                    if last_edited is not None:
                        results.setdefault(str(target_lang.code), {})[field_name] = "skipped (manual edit)"
                        TranslationLogModel.objects.create(
                            content_type=content_type,
                            object_id=instance.pk,
                            field_name=field_name,
                            source_language=source_language.code,
                            target_language=target_lang.code,
                            source_text=str(getattr(source_translation, field_name, ""))[:500],
                            translated_text="",
                            status=TranslationLogModel.Status.SKIPPED,
                            ai_provider=self.provider,
                        )
                        continue

                source_text = str(getattr(source_translation, field_name, ""))
                field_type = self._field_type_for(field_name)

                result = self.translate(source_text, source_language.code, target_lang.code, field_type)

                if result["status"] == "success" and result["translated_text"]:
                    setattr(target_translation, field_name, result["translated_text"])
                    setattr(target_translation, "auto_translated", True)

                TranslationLogModel.objects.create(
                    content_type=content_type,
                    object_id=instance.pk,
                    field_name=field_name,
                    source_language=source_language.code,
                    target_language=target_lang.code,
                    source_text=source_text[:500],
                    translated_text=result.get("translated_text", "")[:500],
                    status=result["status"],
                    tokens_used=result.get("tokens_used", 0),
                    cost_usd=result.get("cost_usd", 0),
                    duration_ms=result.get("duration_ms", 0),
                    ai_provider=self.provider,
                )
                results.setdefault(str(target_lang.code), {})[field_name] = result["status"]

            setattr(target_translation, "_skip_translation_signal", True)
            target_translation.save()

        return results

    def _get_source_translation(self, instance, source_language):
        translations = getattr(instance, "translations", None)
        if translations is None:
            return None
        try:
            return translations.get(language=source_language)
        except translations.model.DoesNotExist:
            return translations.filter(language__is_default=True).first()

    def _detect_translatable_fields(self, translation_instance):
        skip = {"id", "language", "auto_translated", "last_edited_manually"}
        meta = translation_instance._meta
        translatable = []
        for field in meta.concrete_fields:
            if field.name in skip:
                continue
            if hasattr(field, "is_relation") and field.is_relation:
                continue
            translatable.append(field.name)
        excluded_relations = set()
        for fk_field in meta.get_fields():
            if hasattr(fk_field, "related_model"):
                excluded_relations.add(fk_field.name)
        return [f for f in translatable if f not in excluded_relations]

    def _get_or_init_translation(self, instance, TranslationModel, target_language):
        parent_field_name = None
        for field in TranslationModel._meta.get_fields():
            if hasattr(field, "related_model") and field.related_model == type(instance):
                parent_field_name = field.name
                break
        try:
            return TranslationModel.objects.get(language=target_language, **{parent_field_name: instance})
        except TranslationModel.DoesNotExist:
            return TranslationModel(language=target_language, **{parent_field_name: instance})

    def _field_type_for(self, field_name):
        text_fields = {"long_description", "description", "content", "message", "excerpt"}
        rich_fields = {"content"}
        list_fields = {"features"}
        if field_name in rich_fields:
            return "rich_text"
        if field_name in list_fields:
            return "list"
        if field_name in text_fields:
            return "long_text"
        return "default"

    def _resolve_prompt(self, prompt_template, field_type):
        from apps.translation.models import TranslationPrompt

        if prompt_template:
            return prompt_template
        prompt_obj = TranslationPrompt.objects.filter(field_type=field_type, is_default=True).first()
        if prompt_obj:
            return prompt_obj.prompt_template
        default_prompt = TranslationPrompt.objects.filter(field_type="default", is_default=True).first()
        if default_prompt:
            return default_prompt.prompt_template
        return DEFAULT_PROMPT

    @staticmethod
    def _estimate_cost(input_tokens, output_tokens):
        return round((input_tokens / 1_000_000) * 3 + (output_tokens / 1_000_000) * 15, 6)
