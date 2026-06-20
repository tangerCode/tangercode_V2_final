from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet

from .managers import CustomUserManager


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super Admin"
        EDITOR = "editor", "Editor"
        CONTRIBUTOR = "contributor", "Contributor"

    username = None
    email = models.EmailField("email address", unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CONTRIBUTOR)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    phone = models.CharField(max_length=30, blank=True, default="")
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=255, blank=True, default="")
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return self.get_full_name() or self.email

    def save(self, *args, **kwargs):
        if self.two_factor_secret and not self.two_factor_secret.startswith("gAAAA"):
            self.two_factor_secret = self._encrypt(self.two_factor_secret)
        super().save(*args, **kwargs)

    @staticmethod
    def _encrypt(value: str) -> str:
        key = settings.FERNET_ENCRYPTION_KEY.encode() if settings.FERNET_ENCRYPTION_KEY else Fernet.generate_key()
        return Fernet(key).encrypt(value.encode()).decode()

    @staticmethod
    def _decrypt(value: str) -> str:
        key = settings.FERNET_ENCRYPTION_KEY.encode() if settings.FERNET_ENCRYPTION_KEY else Fernet.generate_key()
        return Fernet(key).decrypt(value.encode()).decode()


class ActivityLog(models.Model):
    class Action(models.TextChoices):
        LOGIN = "login", "Login"
        LOGOUT = "logout", "Logout"
        CREATED = "created", "Created"
        UPDATED = "updated", "Updated"
        DELETED = "deleted", "Deleted"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="activity_logs")
    action = models.CharField(max_length=20, choices=Action.choices)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default="")
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = "Activity Log"
        verbose_name_plural = "Activity Logs"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} — {self.action} — {self.model_name} ({self.created_at:%Y-%m-%d %H:%M})"
