"""
URL configuration for TANGER CODE backend.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # Health check
    path("api/v1/health/", include("apps.core.urls")),

    # Public API (P3)
    # path("api/v1/public/", include("apps.public_api.urls")),

    # Admin API (P4)
    # path("api/v1/admin/", include("apps.admin_api.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
