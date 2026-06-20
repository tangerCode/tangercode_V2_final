from django.conf import settings
from django.db import models


class ContactMessage(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Nouveau"
        READ = "read", "Lu"
        REPLIED = "replied", "Répondu"
        ARCHIVED = "archived", "Archivé"
        SPAM = "spam", "Spam"

    class Budget(models.TextChoices):
        UNDER_5K = "under_5k", "< 5 000 MAD"
        _5K_20K = "5k_20k", "5 000 - 20 000 MAD"
        _20K_50K = "20k_50k", "20 000 - 50 000 MAD"
        _50K_100K = "50k_100k", "50 000 - 100 000 MAD"
        OVER_100K = "over_100k", "> 100 000 MAD"
        NOT_SPECIFIED = "not_specified", "Non spécifié"

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30, null=True, blank=True)
    company = models.CharField(max_length=100, null=True, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    service_interested = models.ForeignKey(
        "services.Service", on_delete=models.SET_NULL, null=True, blank=True, related_name="messages"
    )
    budget_range = models.CharField(max_length=20, choices=Budget.choices, default=Budget.NOT_SPECIFIED)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default="")
    language = models.CharField(max_length=5, default="fr")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)
    replied_at = models.DateTimeField(null=True, blank=True)
    reply_content = models.TextField(null=True, blank=True)
    replied_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="contact_replies"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"{self.name} — {self.subject[:50]}"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_confirmed = models.BooleanField(default=False)
    confirmation_token = models.CharField(max_length=64, unique=True)
    unsubscribe_token = models.CharField(max_length=64, unique=True)
    language = models.CharField(max_length=5, default="fr")
    subscribed_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Newsletter Subscriber"
        verbose_name_plural = "Newsletter Subscribers"
        ordering = ["-subscribed_at"]

    def __str__(self):
        return self.email


class EmailLog(models.Model):
    class Status(models.TextChoices):
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    to_email = models.EmailField()
    subject = models.CharField(max_length=200)
    template_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SENT)
    error_message = models.TextField(blank=True, default="")
    related_object_type = models.CharField(max_length=50, blank=True, default="")
    related_object_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = "Email Log"
        verbose_name_plural = "Email Logs"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.template_name} → {self.to_email} ({self.status})"
