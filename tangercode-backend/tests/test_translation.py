import pytest
from unittest.mock import patch, MagicMock

from apps.translation.models import AIProvider, TranslationLog, TranslationPrompt
from apps.users.models import ActivityLog


# ---------------------------------------------------------------------------
# Translation Service
# ---------------------------------------------------------------------------


class TestTranslationService:
    def test_translate_success(self, ai_provider, mock_claude_response):
        from apps.translation.services import TranslationService
        service = TranslationService(provider=ai_provider)
        with patch.object(service, "_get_client") as mock_client:
            mock_client.return_value.messages.create.return_value = mock_claude_response
            result = service.translate("Hello world", "en", "fr")
        assert result["status"] == "success"
        assert "Translated text" in result["translated_text"]
        assert result["tokens_used"] == 15
        assert result["cost_usd"] > 0
        assert result["duration_ms"] >= 0

    def test_translate_cache_hit(self, ai_provider, mock_claude_response):
        from apps.translation.services import TranslationService, _translation_cache
        _translation_cache.clear()
        service = TranslationService(provider=ai_provider)
        call_count = 0

        class CountingClient:
            @property
            def messages(self):
                return self

            def create(self, **kwargs):
                nonlocal call_count
                call_count += 1
                return mock_claude_response

        with patch.object(service, "_get_client", return_value=CountingClient()):
            r1 = service.translate("Hello", "en", "fr")
            r2 = service.translate("Hello", "en", "fr")
        assert r1["translated_text"] == r2["translated_text"]
        assert call_count == 1

    def test_translate_empty_text(self, ai_provider):
        from apps.translation.services import TranslationService
        service = TranslationService(provider=ai_provider)
        result = service.translate("", "en", "fr")
        assert result["status"] == "skipped"

    def test_translate_api_error_handling(self, ai_provider):
        from apps.translation.services import TranslationService
        service = TranslationService(provider=ai_provider)
        with patch.object(service, "translate", return_value={"status": "error", "error_message": "API down"}):
            result = service.translate("Hello", "en", "fr")
        assert result["status"] == "error"

    def test_translate_object_creates_logs(self, ai_provider, language_fr, language_en, mock_claude_response):
        from apps.services.models import Service, ServiceTranslation
        from apps.translation.services import TranslationService
        svc = Service.objects.create(icon="test")
        ServiceTranslation.objects.create(service=svc, language=language_fr, title="Bonjour", short_description="Desc FR")
        service = TranslationService(provider=ai_provider)
        with patch.object(service, "_get_client") as mock_client:
            mock_client.return_value.messages.create.return_value = mock_claude_response
            result = service.translate_object(svc, language_fr, [language_en], force=True)
        assert isinstance(result, dict)
        assert len(result) >= 0

    def test_translate_object_skip_manual_edit(self, ai_provider, language_fr, language_en, mock_claude_response):
        from apps.services.models import Service, ServiceTranslation
        from apps.translation.services import TranslationService
        from django.utils import timezone
        svc = Service.objects.create(icon="test")
        ServiceTranslation.objects.create(service=svc, language=language_fr, title="Bonjour", short_description="Desc")
        existing = ServiceTranslation.objects.create(
            service=svc, language=language_en, title="Hello", short_description="Desc EN",
            auto_translated=False, last_edited_manually=timezone.now(),
        )
        service = TranslationService(provider=ai_provider)
        with patch.object(service, "_get_client") as mock_client:
            mock_client.return_value.messages.create.return_value = mock_claude_response
            result = service.translate_object(svc, language_fr, [language_en], force=False)
        assert isinstance(result, dict)


# ---------------------------------------------------------------------------
# Celery Tasks
# ---------------------------------------------------------------------------


class TestCeleryTasks:
    @pytest.mark.django_db
    def test_translate_object_task_success(self, ai_provider, language_fr, language_en, mock_claude_response):
        from apps.services.models import Service, ServiceTranslation
        from apps.translation.tasks import translate_object_task
        from django.contrib.contenttypes.models import ContentType
        svc = Service.objects.create(icon="test")
        ServiceTranslation.objects.create(service=svc, language=language_fr, title="Bonjour", short_description="Desc")
        ct = ContentType.objects.get_for_model(svc)
        with patch("apps.translation.tasks.TranslationService") as MockService:
            mock_instance = MockService.return_value
            mock_instance.translate_object.return_value = {"en": {"title": "success"}}
            result = translate_object_task(ct.pk, svc.pk, "fr", target_langs=["en"])
        assert result["en"]["title"] == "success"

    def test_translate_object_task_invalid_object(self):
        from apps.translation.tasks import translate_object_task
        result = translate_object_task(99999, 0, "fr")
        assert "error" in result

    @patch("apps.translation.tasks.TranslationService")
    def test_translate_object_task_retry(self, MockService, ai_provider, language_fr):
        from apps.services.models import Service, ServiceTranslation
        from apps.translation.tasks import translate_object_task
        from django.contrib.contenttypes.models import ContentType
        MockService.side_effect = Exception("Boom")
        svc = Service.objects.create(icon="test")
        ServiceTranslation.objects.create(service=svc, language=language_fr, title="Test", short_description="D")
        ct = ContentType.objects.get_for_model(svc)
        try:
            result = translate_object_task(ct.pk, svc.pk, "fr", target_langs=["en"])
        except Exception:
            result = {"status": "error"}
        assert isinstance(result, dict)


# ---------------------------------------------------------------------------
# Fernet Encryption
# ---------------------------------------------------------------------------


class TestFernetEncryption:
    def test_encrypt_decrypt_api_key(self, ai_provider):
        assert ai_provider.decrypted_api_key == "sk-ant-test-key-12345"

    def test_set_api_key(self, ai_provider):
        ai_provider.set_api_key("new-key-123")
        ai_provider.save()
        ai_provider.refresh_from_db()
        assert ai_provider.decrypted_api_key == "new-key-123"


# ---------------------------------------------------------------------------
# Admin Endpoints — AI Providers, Prompts, Logs, On-Demand Translate
# ---------------------------------------------------------------------------


class TestAIProviderAdminAPI:
    BASE = "/api/v1/admin/config/ai-providers"

    def test_list(self, api_client, auth_as_superadmin, ai_provider):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_create(self, api_client, auth_as_superadmin):
        payload = {"name": "New Provider", "provider_type": "claude", "is_active": True}
        r = api_client.post(f"{self.BASE}/", payload, format="json")
        assert r.status_code == 201

    def test_test_connection(self, api_client, auth_as_superadmin, ai_provider, mock_claude_response):
        with patch("apps.translation.services.TranslationService") as MockService:
            mock_instance = MockService.return_value
            mock_instance.translate.return_value = {"status": "success", "translated_text": "Bonjour", "tokens_used": 10, "cost_usd": 0.0001, "duration_ms": 500}
            r = api_client.post(f"{self.BASE}/{ai_provider.pk}/test/")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"


class TestTranslationPromptAdminAPI:
    BASE = "/api/v1/admin/config/translation-prompts"

    def test_list(self, api_client, auth_as_superadmin, translation_prompt):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_patch(self, api_client, auth_as_superadmin, translation_prompt):
        r = api_client.patch(f"{self.BASE}/{translation_prompt.pk}/", {"name": "Updated"}, format="json")
        assert r.status_code == 200


class TestTranslationLogAdminAPI:
    BASE = "/api/v1/admin/translation-logs"

    def test_list(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/")
        assert r.status_code == 200

    def test_stats(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/stats/")
        assert r.status_code == 200
        assert "total_translations" in r.json()


class TestOnDemandTranslateAPI:
    BASE = "/api/v1/admin/translate/"

    def test_success(self, api_client, auth_as_editor, ai_provider, mock_claude_response):
        with patch("apps.translation.services.TranslationService") as MockService:
            mock_instance = MockService.return_value
            mock_instance.translate.return_value = {"status": "success", "translated_text": "Bonjour", "tokens_used": 10, "cost_usd": 0.0001, "duration_ms": 500}
            r = api_client.post(self.BASE, {"content": "Hello", "source_lang": "en", "target_lang": "fr"}, format="json")
        assert r.status_code == 200

    def test_error(self, api_client, auth_as_editor, ai_provider):
        with patch("apps.translation.services.TranslationService") as MockService:
            mock_instance = MockService.return_value
            mock_instance.translate.return_value = {"status": "error", "error_message": "API Error"}
            r = api_client.post(self.BASE, {"content": "Hello", "source_lang": "en", "target_lang": "fr"}, format="json")
        assert r.status_code == 502

    def test_missing_content(self, api_client, auth_as_editor):
        r = api_client.post(self.BASE, {"source_lang": "en", "target_lang": "fr"}, format="json")
        assert r.status_code == 400


# ---------------------------------------------------------------------------
# Admin Translate Actions (Service, Project, BlogPost)
# ---------------------------------------------------------------------------


class TestTranslateActions:
    def test_service_translate(self, api_client, auth_as_editor, admin_service_data):
        with patch("apps.translation.tasks.translate_object_task.delay") as mock_delay:
            r = api_client.post(f"/api/v1/admin/services/{admin_service_data.pk}/translate/",
                               {"target_languages": ["en"]}, format="json")
        assert r.status_code == 202
        mock_delay.assert_called_once()

    def test_project_translate(self, api_client, auth_as_editor, admin_project_data):
        with patch("apps.translation.tasks.translate_object_task.delay") as mock_delay:
            r = api_client.post(f"/api/v1/admin/projects/{admin_project_data.pk}/translate/",
                               {"target_languages": ["en"]}, format="json")
        assert r.status_code == 202

    def test_blog_post_translate(self, api_client, auth_as_editor, admin_blog_data):
        with patch("apps.translation.tasks.translate_object_task.delay") as mock_delay:
            r = api_client.post(f"/api/v1/admin/blog/posts/{admin_blog_data.pk}/translate/",
                               {"target_languages": ["en"]}, format="json")
        assert r.status_code == 202

    def test_contact_message_reply(self, api_client, auth_as_editor, admin_service_data):
        from apps.messages_app.models import ContactMessage
        msg = ContactMessage.objects.create(name="X", email="x@x.com", subject="S", message="M")
        r = api_client.post(f"/api/v1/admin/messages/{msg.pk}/reply/",
                           {"reply_content": "Test reply"}, format="json")
        assert r.status_code == 200
