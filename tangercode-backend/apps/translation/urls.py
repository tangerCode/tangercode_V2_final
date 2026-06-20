from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()
router.register(r"config/ai-providers", views.AIProviderAdminViewSet, basename="admin-ai-providers")
router.register(r"config/translation-prompts", views.TranslationPromptAdminViewSet, basename="admin-translation-prompts")
router.register(r"translation-logs", views.TranslationLogAdminViewSet, basename="admin-translation-logs")

urlpatterns = router.urls + [
    path("translate/", views.OnDemandTranslateView.as_view(), name="admin-translate-on-demand"),
]
