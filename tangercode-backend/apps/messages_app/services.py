import logging
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from apps.core.models import SiteConfig
from apps.users.models import User

logger = logging.getLogger(__name__)


class ContactService:
    RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

    @staticmethod
    def verify_recaptcha(token: str, action: str = "contact") -> dict:
        config = SiteConfig.load()
        secret = config.recaptcha_secret_key
        if not secret:
            return {"success": True, "score": 1.0, "action": action, "bypass": True}
        data = urlencode({"secret": secret, "response": token}).encode()
        req = Request(ContactService.RECAPTCHA_VERIFY_URL, data=data)
        try:
            with urlopen(req, timeout=5) as resp:
                result = json.loads(resp.read().decode())
            return {
                "success": result.get("success", False),
                "score": result.get("score", 0),
                "action": result.get("action", ""),
                "error": result.get("error-codes", []),
            }
        except Exception as e:
            logger.exception("reCAPTCHA verification failed")
            return {"success": False, "score": 0, "error": str(e)[:200]}

    @staticmethod
    def sanitize(text: str) -> str:
        import bleach
        return bleach.clean(text or "", tags=[], strip=True)

    @staticmethod
    def send_autoreply_email(message) -> bool:
        config = SiteConfig.load()
        context = {
            "name": message.name,
            "subject": message.subject,
            "message": ContactService.sanitize(message.message),
            "site_name": config.site_name,
            "site_email": config.site_email,
            "site_phone": config.site_phone,
            "whatsapp_number": config.whatsapp_number,
        }
        html_content = render_to_string("emails/contact_autoreply.html", context)
        text_content = render_to_string("emails/contact_autoreply.txt", context)
        return ContactService._send_email(
            to=message.email,
            subject=f"[{config.site_name}] We received your message",
            html_content=html_content,
            text_content=text_content,
            template_name="contact_autoreply",
            related_object=message,
        )

    @staticmethod
    def send_admin_notification(message) -> bool:
        config = SiteConfig.load()
        super_admin_emails = User.objects.filter(
            role="super_admin", is_active=True
        ).values_list("email", flat=True)
        if not super_admin_emails:
            logger.warning("No super_admin emails found for contact notification.")
            return False
        context = {
            "name": message.name,
            "email": message.email,
            "phone": message.phone or "",
            "company": message.company or "",
            "subject": message.subject,
            "message": ContactService.sanitize(message.message),
            "budget_range": message.get_budget_range_display() if message.budget_range else "",
            "service_interested": str(message.service_interested) if message.service_interested else "",
            "message_id": message.pk,
            "language": message.language,
            "site_name": config.site_name,
            "site_url": getattr(settings, "SITE_URL", "https://tangercode.com"),
        }
        html_content = render_to_string("emails/contact_notification.html", context)
        text_content = render_to_string("emails/contact_notification.txt", context)
        success = True
        for admin_email in super_admin_emails:
            ok = ContactService._send_email(
                to=admin_email,
                subject=f"[{config.site_name}] New message from {message.name}",
                html_content=html_content,
                text_content=text_content,
                template_name="contact_notification",
                related_object=message,
            )
            if not ok:
                success = False
        return success

    @staticmethod
    def send_reply_email(message) -> bool:
        config = SiteConfig.load()
        context = {
            "name": message.name,
            "original_subject": message.subject,
            "original_message": ContactService.sanitize(message.message),
            "reply_content": message.reply_content or "",
            "site_name": config.site_name,
            "site_phone": config.site_phone,
            "whatsapp_number": config.whatsapp_number,
        }
        html_content = render_to_string("emails/contact_reply.html", context)
        text_content = render_to_string("emails/contact_reply.txt", context)
        return ContactService._send_email(
            to=message.email,
            subject=f"Re: {message.subject}",
            html_content=html_content,
            text_content=text_content,
            template_name="contact_reply",
            related_object=message,
        )

    @staticmethod
    def _send_email(to, subject, html_content, text_content, template_name="",
                    related_object=None) -> bool:
        try:
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[to],
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
            ContactService._log_email(to, subject, template_name, "sent",
                                       related_object=related_object)
            return True
        except Exception as e:
            logger.exception("Failed to send email to %s: %s", to, subject)
            ContactService._log_email(to, subject, template_name, "failed",
                                       error_message=str(e)[:500],
                                       related_object=related_object)
            return False

    @staticmethod
    def _log_email(to, subject, template_name, status, error_message="",
                   related_object=None):
        from apps.messages_app.models import EmailLog
        kwargs = {
            "to_email": to,
            "subject": subject[:200],
            "template_name": template_name[:100],
            "status": status,
            "error_message": error_message,
        }
        if related_object:
            kwargs["related_object_type"] = related_object.__class__.__name__
            kwargs["related_object_id"] = related_object.pk
        EmailLog.objects.create(**kwargs)
