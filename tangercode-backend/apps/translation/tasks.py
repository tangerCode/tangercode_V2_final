import logging

from celery import shared_task
from django.contrib.contenttypes.models import ContentType
from django.core.mail import mail_admins

from apps.translation.services import TranslationService

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def translate_object_task(self, content_type_id, object_id, source_lang, target_langs=None, fields=None, force=False):
    try:
        content_type = ContentType.objects.get_for_id(content_type_id)
        instance = content_type.get_object_for_this_type(pk=object_id)
    except Exception as e:
        logger.error("Failed to resolve object: ct=%s id=%s", content_type_id, object_id)
        return {"error": str(e)}

    try:
        instance._skip_translation_signal = True
        service = TranslationService()
        result = service.translate_object(
            instance,
            source_language=source_lang,
            target_languages=target_langs,
            fields=fields,
            force=force,
        )
        return result
    except Exception as exc:
        logger.exception("Translation task failed (attempt %s): obj=%s/%s", self.request.retries + 1, content_type_id, object_id)
        try:
            raise self.retry(exc=exc)
        except self.MaxRetriesExceededError:
            logger.error("Translation task exhausted retries for: obj=%s/%s", content_type_id, object_id)
            subject = f"[TANGER CODE] Translation failed: {content_type.model} #{object_id}"
            body = f"Translation task failed after 3 retries.\n\nObject: {content_type} #{object_id}\nSource: {source_lang}\nTargets: {target_langs}\nError: {exc}"
            try:
                mail_admins(subject, body)
            except Exception:
                logger.exception("Failed to send admin notification email")
            return {"error": str(exc), "status": "max_retries_exceeded"}


@shared_task
def bulk_translate_task(content_type_id, source_lang, target_langs, force=False):
    content_type = ContentType.objects.get_for_id(content_type_id)
    instances = content_type.model_class().objects.all()
    service = TranslationService()
    results = []
    for instance in instances:
        instance._skip_translation_signal = True
        result = service.translate_object(instance, source_lang, target_langs, force=force)
        results.append({"object_id": instance.pk, "result": result})
    return results
