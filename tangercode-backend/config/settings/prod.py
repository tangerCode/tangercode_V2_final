from .base import *  # noqa: F403

DEBUG = False

ALLOWED_HOSTS = config(  # noqa: F405
    "DJANGO_ALLOWED_HOSTS",
    default="api.tangercode.com,tangercode.com",
    cast=Csv(),  # noqa: F405
)

# Security hardening
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# CORS — strict origins
CORS_ALLOWED_ORIGINS = [
    "https://tangercode.com",
    "https://www.tangercode.com",
]
CORS_ALLOW_CREDENTIALS = True

# Production email
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

# Stricter rate limiting
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {  # noqa: F405
    "anon": "1000/hour",
    "user": "5000/hour",
}

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{levelname}] {asctime} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}
