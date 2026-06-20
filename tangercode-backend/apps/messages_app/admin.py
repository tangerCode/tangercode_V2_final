import csv

from django.contrib import admin
from django.http import HttpResponse
from django.utils import timezone

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject_short", "service_interested", "status", "created_at")
    list_filter = ("status", "service_interested", "budget_range", "language", "created_at")
    search_fields = ("name", "email", "subject", "message", "company")
    readonly_fields = (
        "name", "email", "phone", "company", "subject", "message",
        "service_interested", "budget_range", "ip_address", "user_agent",
        "language", "created_at",
    )
    date_hierarchy = "created_at"
    actions = ["mark_read", "mark_spam", "mark_archived", "export_csv"]
    fieldsets = (
        ("Contact info", {"fields": ("name", "email", "phone", "company")}),
        ("Message", {"fields": ("subject", "message", "service_interested", "budget_range", "language")}),
        ("Status", {"fields": ("status", "read_at", "replied_at", "reply_content", "replied_by")}),
        ("Meta", {"fields": ("ip_address", "user_agent", "created_at")}),
    )

    @admin.display(description="Subject")
    def subject_short(self, obj):
        return obj.subject[:60]

    @admin.action(description="Mark as read")
    def mark_read(self, request, queryset):
        queryset.update(status=ContactMessage.Status.READ, read_at=timezone.now())

    @admin.action(description="Mark as spam")
    def mark_spam(self, request, queryset):
        queryset.update(status=ContactMessage.Status.SPAM)

    @admin.action(description="Archive")
    def mark_archived(self, request, queryset):
        queryset.update(status=ContactMessage.Status.ARCHIVED)

    @admin.action(description="Export CSV")
    def export_csv(self, request, queryset):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="messages.csv"'
        writer = csv.writer(response)
        writer.writerow(["Name", "Email", "Phone", "Company", "Subject", "Message", "Status", "Date"])
        for msg in queryset:
            writer.writerow([
                msg.name, msg.email, msg.phone or "", msg.company or "",
                msg.subject, msg.message, msg.status,
                msg.created_at.strftime("%Y-%m-%d %H:%M"),
            ])
        return response
