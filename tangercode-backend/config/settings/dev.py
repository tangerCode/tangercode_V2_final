from .base import *  # noqa: F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

# Debug toolbar
INSTALLED_APPS += [  # noqa: F405
    "django_extensions",
]

# Browsable API in dev
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (  # noqa: F405
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"]  # noqa: F405
    + ("rest_framework.renderers.BrowsableAPIRenderer",)
)

# Console email in dev
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# CORS — allow all in dev
CORS_ALLOW_ALL_ORIGINS = True

# Throttling relaxed
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {  # noqa: F405
    "anon": "10000/hour",
    "user": "50000/hour",
}

# Local memory cache (no Redis needed for local dev)
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "tangercode-dev",
    }
}

# Celery — use local memory broker (no Redis needed for local dev)
CELERY_BROKER_URL = "memory://"
CELERY_RESULT_BACKEND = "cache+memory://"
CELERY_TASK_ALWAYS_EAGER = True
