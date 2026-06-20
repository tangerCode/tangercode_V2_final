import logging

from django.conf import settings
from django.contrib.auth import user_logged_in, user_logged_out
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import ActivityLog, User

logger = logging.getLogger(__name__)


@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    ip = getattr(request, "_activity_ip", request.META.get("REMOTE_ADDR"))
    ua = getattr(request, "_activity_user_agent", request.META.get("HTTP_USER_AGENT", ""))[:500]
    ActivityLog.objects.create(
        user=user,
        action=ActivityLog.Action.LOGIN,
        model_name="User",
        object_id=str(user.pk),
        ip_address=ip,
        user_agent=ua,
        details={"email": user.email},
    )


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    if user is None:
        return
    ip = getattr(request, "_activity_ip", "")
    ua = getattr(request, "_activity_user_agent", "")
    ActivityLog.objects.create(
        user=user,
        action=ActivityLog.Action.LOGOUT,
        model_name="User",
        object_id=str(user.pk),
        ip_address=ip,
        user_agent=ua,
        details={"email": user.email},
    )
