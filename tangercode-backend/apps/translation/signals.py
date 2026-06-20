import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

logger = logging.getLogger(__name__)

TRANSLATABLE_PARENT_MODELS = {
}


def register_translatable_model(model_class, parent_attr, source_lang="fr", target_langs=None, fields=None):
    TRANSLATABLE_PARENT_MODELS[model_class.__name__] = {
        "model": model_class,
        "parent_attr": parent_attr,
        "source_lang": source_lang,
        "target_langs": target_langs or ["en", "ar"],
        "fields": fields,
    }


@receiver(post_save)
def on_translatable_saved(sender, instance, created, raw, **kwargs):
    if raw:
        return
    model_name = sender.__name__
    if model_name not in TRANSLATABLE_PARENT_MODELS:
        return
    if getattr(instance, "_skip_translation_signal", False):
        return

    config = TRANSLATABLE_PARENT_MODELS[model_name]
    source_lang = config["source_lang"]
    target_langs = config["target_langs"]
    fields = config["fields"]

    has_source_translation = instance.translations.filter(language__code=source_lang).exists()
    if not has_source_translation:
        return

    from apps.translation.tasks import translate_object_task
    from django.contrib.contenttypes.models import ContentType

    ct = ContentType.objects.get_for_model(instance)
    instance._skip_translation_signal = True
    translate_object_task.delay(
        ct.pk,
        instance.pk,
        source_lang=source_lang,
        target_langs=target_langs,
        fields=fields,
        force=created,
    )


def _register_all():
    from apps.services.models import Service
    from apps.portfolio.models import Project
    from apps.blog.models import BlogPost
    from apps.testimonials.models import Testimonial
    from apps.faq.models import FAQ

    register_translatable_model(Service, "service", source_lang="fr", target_langs=["en", "ar"])
    register_translatable_model(Project, "project", source_lang="fr", target_langs=["en", "ar"])
    register_translatable_model(BlogPost, "post", source_lang="fr", target_langs=["en", "ar"])
    register_translatable_model(Testimonial, "testimonial", source_lang="fr", target_langs=["en", "ar"])
    register_translatable_model(FAQ, "faq", source_lang="fr", target_langs=["en", "ar"])


_register_all()
