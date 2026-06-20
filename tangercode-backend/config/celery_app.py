# Celery app — will be activated in P5
# For now, returns a no-op placeholder

try:
    from celery import Celery as _Celery
    import os

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

    app = _Celery("tangercode")
    app.config_from_object("django.conf:settings", namespace="CELERY")
    app.autodiscover_tasks()
except ImportError:
    app = None
