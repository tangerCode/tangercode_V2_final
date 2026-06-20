from django.apps import AppConfig


class TranslationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.translation"
    verbose_name = "AI Translation"

    def ready(self):
        import apps.translation.signals  # noqa
