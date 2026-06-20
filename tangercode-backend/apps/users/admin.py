from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import ActivityLog, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("email", "first_name", "last_name", "role", "is_active", "last_login", "date_joined")
    list_filter = ("role", "is_active", "is_staff", "is_superuser", "two_factor_enabled")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("-date_joined",)
    readonly_fields = ("last_login", "last_login_ip", "date_joined")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "avatar", "phone")}),
        ("Role & Permissions", {"fields": ("role", "is_active", "is_staff", "is_superuser")}),
        ("Security", {"fields": ("two_factor_enabled", "two_factor_secret", "last_login_ip")}),
        ("Dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "password1", "password2", "role"),
        }),
    )


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "model_name", "object_id", "ip_address", "created_at")
    list_filter = ("action", "model_name", "created_at")
    search_fields = ("user__email", "model_name", "object_id")
    readonly_fields = ("user", "action", "model_name", "object_id", "ip_address", "user_agent", "details", "created_at")
    ordering = ("-created_at",)

    def has_add_permission(self, request):
        return False
