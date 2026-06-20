import pytest
from unittest.mock import patch
from django.core.cache import caches

from apps.messages_app.models import ContactMessage, EmailLog, NewsletterSubscriber


def _clear_throttle_cache():
    try:
        caches["default"].clear()
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Contact with reCAPTCHA
# ---------------------------------------------------------------------------


class TestContactWithRecaptcha:
    BASE = "/api/v1/public/contact/"

    @pytest.fixture(autouse=True)
    def _clear_cache(self):
        _clear_throttle_cache()

    def test_submit_with_valid_recaptcha(self, api_client, site_config_with_recaptcha, mock_recaptcha_success):
        with patch("apps.messages_app.services.ContactService.verify_recaptcha",
                   return_value=mock_recaptcha_success):
            with patch("apps.messages_app.services.ContactService.send_autoreply_email"):
                with patch("apps.messages_app.services.ContactService.send_admin_notification"):
                    r = api_client.post(self.BASE, {
                        "name": "Test", "email": "t@test.com", "subject": "S", "message": "M",
                        "recaptcha_token": "valid-token",
                    }, format="json")
        assert r.status_code == 201
        msg = ContactMessage.objects.filter(email="t@test.com").first()
        assert msg is not None
        assert msg.status == "new"

    def test_submit_low_score_marked_spam(self, api_client, site_config_with_recaptcha, mock_recaptcha_fail):
        with patch("apps.messages_app.services.ContactService.verify_recaptcha",
                   return_value=mock_recaptcha_fail):
            r = api_client.post(self.BASE, {
                "name": "Bad", "email": "bad@test.com", "subject": "S", "message": "M",
                "recaptcha_token": "bad-token",
            }, format="json")
        assert r.status_code == 201
        msg = ContactMessage.objects.filter(email="bad@test.com").first()
        assert msg.status == "spam"

    def test_honeypot_filled_marked_spam(self, api_client, site_config_with_recaptcha):
        with patch("apps.messages_app.services.ContactService.send_autoreply_email"):
            with patch("apps.messages_app.services.ContactService.send_admin_notification"):
                r = api_client.post(self.BASE, {
                    "name": "Bot", "email": "bot@test.com", "subject": "X", "message": "Y",
                    "honeypot": "I am a bot filling hidden field",
                }, format="json")
        assert r.status_code == 201
        msg = ContactMessage.objects.filter(email="bot@test.com").first()
        assert msg.status == "spam"

    def test_submit_without_recaptcha_ok(self, api_client, db):
        with patch("apps.messages_app.services.ContactService.send_autoreply_email"):
            with patch("apps.messages_app.services.ContactService.send_admin_notification"):
                r = api_client.post(self.BASE, {
                    "name": "NoCap", "email": "nocap@test.com", "subject": "S", "message": "M"
                }, format="json")
        assert r.status_code == 201


# ---------------------------------------------------------------------------
# Contact email sending
# ---------------------------------------------------------------------------


class TestContactEmailSending:
    BASE = "/api/v1/public/contact/"

    @pytest.fixture(autouse=True)
    def _clear_cache(self):
        _clear_throttle_cache()

    def test_emails_sent_on_valid_contact(self, api_client, db):
        with patch("apps.messages_app.services.ContactService.send_autoreply_email") as mock_auto:
            with patch("apps.messages_app.services.ContactService.send_admin_notification") as mock_notify:
                r = api_client.post(self.BASE, {
                    "name": "Email", "email": "email@test.com", "subject": "Test", "message": "Hello"
                }, format="json")
        assert r.status_code == 201
        mock_auto.assert_called_once()
        mock_notify.assert_called_once()

    def test_no_emails_for_spam(self, api_client, site_config_with_recaptcha, mock_recaptcha_fail):
        with patch("apps.messages_app.services.ContactService.verify_recaptcha",
                   return_value=mock_recaptcha_fail):
            with patch("apps.messages_app.services.ContactService.send_autoreply_email") as mock_auto:
                with patch("apps.messages_app.services.ContactService.send_admin_notification") as mock_notify:
                    r = api_client.post(self.BASE, {
                        "name": "Spam", "email": "spam@test.com", "subject": "X", "message": "Y",
                        "recaptcha_token": "bad",
                    }, format="json")
        assert r.status_code == 201
        mock_auto.assert_not_called()
        mock_notify.assert_not_called()

    def test_email_log_created(self, api_client, db):
        with patch("apps.messages_app.services.ContactService._send_email") as mock_send:
            mock_send.return_value = True
            r = api_client.post(self.BASE, {
                "name": "Log", "email": "log@test.com", "subject": "T", "message": "M"
            }, format="json")
        assert r.status_code == 201
        assert mock_send.call_count >= 1


# ---------------------------------------------------------------------------
# Contact rate limiting
# ---------------------------------------------------------------------------


class TestContactRateLimit:
    BASE = "/api/v1/public/contact/"

    @pytest.fixture(autouse=True)
    def _clear_cache(self):
        _clear_throttle_cache()

    def test_fourth_request_throttled(self, api_client, db):
        from django.core.cache import caches
        caches["default"].clear()
        payload = {"name": "RL", "email": "rl@test.com", "subject": "T", "message": "M"}
        for i in range(3):
            with patch("apps.messages_app.services.ContactService.send_autoreply_email"):
                with patch("apps.messages_app.services.ContactService.send_admin_notification"):
                    r = api_client.post(self.BASE, payload, format="json")
            assert r.status_code == 201, f"Request {i+1} failed with {r.status_code}"
        with patch("apps.messages_app.services.ContactService.send_autoreply_email"):
            with patch("apps.messages_app.services.ContactService.send_admin_notification"):
                r = api_client.post(self.BASE, payload, format="json")
        assert r.status_code == 429, f"Expected 429, got {r.status_code}"


# ---------------------------------------------------------------------------
# Contact sanitization
# ---------------------------------------------------------------------------


class TestContactSanitization:
    BASE = "/api/v1/public/contact/"

    @pytest.fixture(autouse=True)
    def _clear_cache(self):
        _clear_throttle_cache()

    def test_html_stripped_from_message(self, api_client, db):
        with patch("apps.messages_app.services.ContactService.send_autoreply_email"):
            with patch("apps.messages_app.services.ContactService.send_admin_notification"):
                r = api_client.post(self.BASE, {
                    "name": "HTML", "email": "h@test.com", "subject": "Test",
                    "message": "<script>alert('xss')</script><p>Hello</p>"
                }, format="json")
        assert r.status_code == 201
        msg = ContactMessage.objects.filter(email="h@test.com").first()
        assert "<script>" not in msg.message
        assert "<p>" not in msg.message
        assert "Hello" in msg.message


# ---------------------------------------------------------------------------
# Admin reply email
# ---------------------------------------------------------------------------


class TestAdminReplyEmail:
    BASE = "/api/v1/admin/messages"

    @pytest.fixture(autouse=True)
    def _create_message(self, db):
        self.msg = ContactMessage.objects.create(
            name="Reply", email="reply@test.com", subject="Q", message="Help"
        )

    def test_reply_sends_email(self, api_client, auth_as_editor):
        with patch("apps.messages_app.services.ContactService.send_reply_email") as mock_send:
            r = api_client.post(f"{self.BASE}/{self.msg.pk}/reply/",
                               {"reply_content": "Sure!"}, format="json")
        assert r.status_code == 200
        mock_send.assert_called_once()

    def test_reply_creates_email_log(self, api_client, auth_as_editor):
        r = api_client.post(f"{self.BASE}/{self.msg.pk}/reply/",
                           {"reply_content": "Hello there"}, format="json")
        assert r.status_code == 200
        self.msg.refresh_from_db()
        assert self.msg.status == "replied"


# ---------------------------------------------------------------------------
# Stats enhanced
# ---------------------------------------------------------------------------


class TestStatsEnhanced:
    BASE = "/api/v1/admin/messages/stats/"

    def test_stats_has_time_breakdown(self, api_client, auth_as_editor):
        ContactMessage.objects.create(name="X", email="x@x.com", subject="S", message="M")
        r = api_client.get(self.BASE)
        assert r.status_code == 200
        data = r.json()
        assert "today" in data
        assert "this_week" in data
        assert "this_month" in data
        assert "response_rate" in data


# ---------------------------------------------------------------------------
# Newsletter
# ---------------------------------------------------------------------------


class TestNewsletter:
    def test_subscribe(self, api_client, db):
        r = api_client.post("/api/v1/public/newsletter/subscribe/",
                           {"email": "sub@test.com"}, format="json")
        assert r.status_code == 201
        sub = NewsletterSubscriber.objects.filter(email="sub@test.com").first()
        assert sub is not None
        assert len(sub.confirmation_token) == 32

    def test_subscribe_duplicate(self, api_client, db):
        NewsletterSubscriber.objects.create(
            email="dup@test.com", confirmation_token="a" * 32, unsubscribe_token="b" * 32
        )
        r = api_client.post("/api/v1/public/newsletter/subscribe/",
                           {"email": "dup@test.com"}, format="json")
        assert r.status_code == 200

    def test_confirm(self, api_client, db):
        sub = NewsletterSubscriber.objects.create(
            email="confirm@test.com", confirmation_token="abc123", unsubscribe_token="xyz789"
        )
        r = api_client.get(f"/api/v1/public/newsletter/confirm/?token=abc123")
        assert r.status_code == 200
        sub.refresh_from_db()
        assert sub.is_confirmed is True

    def test_unsubscribe(self, api_client, db):
        sub = NewsletterSubscriber.objects.create(
            email="unsub@test.com", confirmation_token="def456", unsubscribe_token="uvw012"
        )
        r = api_client.get(f"/api/v1/public/newsletter/unsubscribe/?token=uvw012")
        assert r.status_code == 200
        sub.refresh_from_db()
        assert sub.unsubscribed_at is not None
