from django.apps import AppConfig


class PublicAPIConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.public_api"
    verbose_name = "Public API"
