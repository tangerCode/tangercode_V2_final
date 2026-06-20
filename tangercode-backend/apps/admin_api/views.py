import csv
import datetime
from io import BytesIO, StringIO

from PIL import Image
from django.core.files.base import ContentFile
from django.db.models import Count, Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import mixins, permissions, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from apps.services.models import PricingTier, Service, Technology
from apps.portfolio.models import Project, ProjectImage
from apps.blog.models import BlogCategory, BlogPost, BlogTag
from apps.testimonials.models import Testimonial
from apps.faq.models import FAQ, FAQCategory
from apps.messages_app.models import ContactMessage
from apps.core.models import PageSEO, SiteConfig
from apps.languages.models import Language
from apps.users.models import ActivityLog, User
from apps.users.permissions import IsEditorOrAbove, IsSuperAdmin

from .serializers import (
    BlogCategoryAdminSerializer,
    BlogPostAdminSerializer,
    BlogTagAdminSerializer,
    ContactMessageAdminSerializer,
    ContactMessageReplySerializer,
    FAQAdminSerializer,
    FAQCategoryAdminSerializer,
    LanguageAdminSerializer,
    MediaUploadSerializer,
    PageSEOAdminSerializer,
    PricingTierAdminSerializer,
    ProjectAdminSerializer,
    ProjectImageAdminSerializer,
    ServiceAdminSerializer,
    SiteConfigAdminSerializer,
    TechnologyAdminSerializer,
    TestimonialAdminSerializer,
    UserAdminCreateSerializer,
    UserAdminListSerializer,
    UserAdminUpdateSerializer,
)


# ---------------------------------------------------------------------------
# Pagination custom admin
# ---------------------------------------------------------------------------


class AdminPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


# ---------------------------------------------------------------------------
# Mixin de log d'activité
# ---------------------------------------------------------------------------


class ActivityLogMixin:
    def log_action(self, request, action, instance, details=None):
        ActivityLog.objects.create(
            user=request.user,
            action=action,
            model_name=instance.__class__.__name__,
            object_id=str(instance.pk),
            ip_address=getattr(request, "_activity_ip", None),
            user_agent=getattr(request, "_activity_user_agent", "")[:500],
            details=details or {},
        )

    def perform_create(self, serializer):
        instance = serializer.save()
        self.log_action(self.request, ActivityLog.Action.CREATED, instance)
        return instance

    def perform_update(self, serializer):
        instance = serializer.save()
        self.log_action(self.request, ActivityLog.Action.UPDATED, instance)
        return instance

    def perform_destroy(self, instance):
        self.log_action(self.request, ActivityLog.Action.DELETED, instance)
        instance.delete()


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------


class ServiceAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = Service.objects.all().prefetch_related(
        "translations__language", "pricing_tiers__translations", "technologies"
    ).order_by("order")
    serializer_class = ServiceAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["is_active", "featured"]
    search_fields = ["translations__title"]
    ordering_fields = ["order", "created_at", "updated_at"]
    ordering = ["order"]

    def get_serializer_class(self):
        return ServiceAdminSerializer

    @action(detail=True, methods=["post"], url_path="translate")
    def translate(self, request, pk=None):
        service = self.get_object()
        target_languages = request.data.get("target_languages", ["en", "ar"])
        force = request.data.get("force", False)
        from django.contrib.contenttypes.models import ContentType
        ct = ContentType.objects.get_for_model(service)
        from apps.translation.tasks import translate_object_task
        translate_object_task.delay(ct.pk, service.pk, "fr", target_langs=target_languages, force=force)
        return Response(
            {"detail": "Translation triggered via Celery.", "service_id": service.pk,
             "target_languages": target_languages},
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=True, methods=["post"], url_path="duplicate")
    def duplicate(self, request, pk=None):
        original = self.get_object()
        new_service = Service.objects.create(
            icon=original.icon,
            cover_image=original.cover_image,
            featured=False,
            order=original.order + 1,
            is_active=False,
        )
        new_service.technologies.set(original.technologies.all())
        for t in original.translations.all():
            from apps.services.models import ServiceTranslation
            ServiceTranslation.objects.create(
                service=new_service,
                language=t.language,
                title=f"{t.title} (copie)",
                short_description=t.short_description,
                long_description=t.long_description,
                meta_title=t.meta_title,
                meta_description=t.meta_description,
            )
        for pt in original.pricing_tiers.all():
            from apps.services.models import PricingTier, PricingTierTranslation
            new_tier = PricingTier.objects.create(
                service=new_service,
                code=pt.code,
                price_mad=pt.price_mad,
                price_eur=pt.price_eur,
                price_usd=pt.price_usd,
                is_custom_quote=pt.is_custom_quote,
                delivery_days=pt.delivery_days,
                revisions_count=pt.revisions_count,
                support_days=pt.support_days,
                order=pt.order,
                is_active=False,
            )
            for ptt in pt.translations.all():
                PricingTierTranslation.objects.create(
                    pricing_tier=new_tier,
                    language=ptt.language,
                    name=ptt.name,
                    description=ptt.description,
                    features=ptt.features,
                    cta_text=ptt.cta_text,
                )
        self.log_action(request, ActivityLog.Action.CREATED, new_service, {"duplicated_from": original.pk})
        serializer = self.get_serializer(new_service)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path=r"translations/(?P<lang_code>[^/.]+)")
    def manage_translation(self, request, pk=None, lang_code=None):
        from apps.services.models import ServiceTranslation

        service = self.get_object()
        language = get_object_or_404(Language, code=lang_code, is_active=True)
        trans, _ = ServiceTranslation.objects.update_or_create(
            service=service, language=language, defaults=request.data
        )
        from .serializers import ServiceTranslationAdminSerializer
        serializer = ServiceTranslationAdminSerializer(trans)
        self.log_action(request, ActivityLog.Action.UPDATED, service, {"translation": lang_code})
        return Response(serializer.data)


# ---------------------------------------------------------------------------
# PricingTier (standalone CRUD)
# ---------------------------------------------------------------------------


class PricingTierAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = PricingTier.objects.select_related("service").prefetch_related(
        "translations__language"
    ).order_by("service__order", "order")
    serializer_class = PricingTierAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["service", "is_active", "code"]
    ordering_fields = ["order", "price_mad"]


# ---------------------------------------------------------------------------
# Project
# ---------------------------------------------------------------------------


class ProjectAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = Project.objects.all().prefetch_related(
        "translations__language", "images", "technologies"
    ).order_by("-year", "order")
    serializer_class = ProjectAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["category", "year", "featured", "is_active"]
    search_fields = ["translations__title", "client_name"]
    ordering_fields = ["order", "year", "created_at", "updated_at"]
    ordering = ["-year", "order"]

    def get_serializer_class(self):
        return ProjectAdminSerializer

    def perform_destroy(self, instance):
        if instance.testimonials.exists():
            return Response(
                {"detail": "Cannot delete project: it has linked testimonials. Remove them first."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        super().perform_destroy(instance)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.testimonials.exists():
            return Response(
                {"detail": "Cannot delete project: it has linked testimonials. Remove them first."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"], url_path="translate")
    def translate(self, request, pk=None):
        project = self.get_object()
        target_languages = request.data.get("target_languages", ["en", "ar"])
        force = request.data.get("force", False)
        from django.contrib.contenttypes.models import ContentType
        ct = ContentType.objects.get_for_model(project)
        from apps.translation.tasks import translate_object_task
        translate_object_task.delay(ct.pk, project.pk, "fr", target_langs=target_languages, force=force)
        return Response(
            {"detail": "Translation triggered via Celery.", "project_id": project.pk,
             "target_languages": target_languages},
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=True, methods=["post"], url_path="images")
    def add_image(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectImageAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        img = serializer.save(project=project)
        self.log_action(request, ActivityLog.Action.CREATED, img)
        return Response(ProjectImageAdminSerializer(img).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path=r"images/(?P<img_id>[^/.]+)")
    def remove_image(self, request, pk=None, img_id=None):
        img = get_object_or_404(ProjectImage, id=img_id, project_id=pk)
        self.log_action(request, ActivityLog.Action.DELETED, img)
        img.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["patch"], url_path=r"images/(?P<img_id>[^/.]+)")
    def update_image(self, request, pk=None, img_id=None):
        img = get_object_or_404(ProjectImage, id=img_id, project_id=pk)
        serializer = ProjectImageAdminSerializer(img, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        img = serializer.save()
        self.log_action(request, ActivityLog.Action.UPDATED, img)
        return Response(ProjectImageAdminSerializer(img).data)


# ---------------------------------------------------------------------------
# Blog Post
# ---------------------------------------------------------------------------


class BlogPostAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related("author").prefetch_related(
        "translations__language", "categories", "tags"
    ).order_by("-created_at")
    serializer_class = BlogPostAdminSerializer
    pagination_class = AdminPagination
    filterset_fields = ["status", "featured"]
    search_fields = ["translations__title", "translations__excerpt"]
    ordering_fields = ["created_at", "updated_at", "views_count", "published_at"]
    ordering = ["-created_at"]

    def get_permissions(self):
        from apps.users.permissions import IsContributorOrAbove
        return [IsContributorOrAbove()]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.GET.get("category")
        tag = self.request.GET.get("tag")
        if category:
            qs = qs.filter(categories__slug=category)
        if tag:
            qs = qs.filter(tags__slug=tag)
        if self.request.user.role == "contributor":
            qs = qs.filter(author=self.request.user)
        return qs

    def perform_create(self, serializer):
        if self.request.user.role == "contributor":
            serializer.validated_data["author"] = self.request.user
        super().perform_create(serializer)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        post = self.get_object()
        if post.status != BlogPost.Status.DRAFT:
            return Response({"detail": "Only draft posts can be published."}, status=status.HTTP_400_BAD_REQUEST)
        active_languages = Language.objects.filter(is_active=True)
        post_languages = set(post.translations.values_list("language_id", flat=True))
        required = set(active_languages.values_list("id", flat=True))
        if not required.issubset(post_languages):
            return Response(
                {"detail": "Cannot publish: translations are missing for some active languages."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        post.status = BlogPost.Status.PUBLISHED
        post.published_at = timezone.now()
        post.save(update_fields=["status", "published_at"])
        self.log_action(request, ActivityLog.Action.UPDATED, post, {"action": "published"})
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="archive")
    def archive(self, request, pk=None):
        post = self.get_object()
        post.status = BlogPost.Status.ARCHIVED
        post.save(update_fields=["status"])
        self.log_action(request, ActivityLog.Action.UPDATED, post, {"action": "archived"})
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="translate")
    def translate(self, request, pk=None):
        post = self.get_object()
        target_languages = request.data.get("target_languages", ["en", "ar"])
        force = request.data.get("force", False)
        from django.contrib.contenttypes.models import ContentType
        ct = ContentType.objects.get_for_model(post)
        from apps.translation.tasks import translate_object_task
        translate_object_task.delay(ct.pk, post.pk, "fr", target_langs=target_languages, force=force)
        return Response(
            {"detail": "Translation triggered via Celery.", "post_id": post.pk,
             "target_languages": target_languages},
            status=status.HTTP_202_ACCEPTED,
        )


# ---------------------------------------------------------------------------
# Blog Category
# ---------------------------------------------------------------------------


class BlogCategoryAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = BlogCategory.objects.prefetch_related("translations__language").order_by("order")
    serializer_class = BlogCategoryAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["is_active"]
    search_fields = ["translations__name"]


# ---------------------------------------------------------------------------
# Blog Tag
# ---------------------------------------------------------------------------


class BlogTagAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = BlogTag.objects.prefetch_related("translations__language").order_by("slug")
    serializer_class = BlogTagAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    search_fields = ["translations__name"]


# ---------------------------------------------------------------------------
# Testimonial
# ---------------------------------------------------------------------------


class TestimonialAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = Testimonial.objects.prefetch_related("translations__language").order_by("order")
    serializer_class = TestimonialAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["is_active", "rating"]


# ---------------------------------------------------------------------------
# FAQ Category
# ---------------------------------------------------------------------------


class FAQCategoryAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = FAQCategory.objects.prefetch_related("translations__language").order_by("order")
    serializer_class = FAQCategoryAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["is_active"]


# ---------------------------------------------------------------------------
# FAQ
# ---------------------------------------------------------------------------


class FAQAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = FAQ.objects.select_related("category").prefetch_related(
        "translations__language"
    ).order_by("category__order", "order")
    serializer_class = FAQAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["category", "is_active"]


# ---------------------------------------------------------------------------
# Technology
# ---------------------------------------------------------------------------


class TechnologyAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = Technology.objects.all().order_by("order", "name")
    serializer_class = TechnologyAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["category", "is_active"]
    search_fields = ["name"]


# ---------------------------------------------------------------------------
# ContactMessage
# ---------------------------------------------------------------------------


class ContactMessageAdminViewSet(ActivityLogMixin,
                                 mixins.ListModelMixin,
                                 mixins.RetrieveModelMixin,
                                 mixins.UpdateModelMixin,
                                 viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["status"]
    ordering_fields = ["created_at", "name"]

    def perform_update(self, serializer):
        old_status = self.get_object().status
        instance = serializer.save()
        action = ActivityLog.Action.UPDATED
        self.log_action(self.request, action, instance, {"old_status": old_status, "new_status": instance.status})

    @action(detail=True, methods=["post"], url_path="reply")
    def reply(self, request, pk=None):
        message = self.get_object()
        reply_serializer = ContactMessageReplySerializer(
            message, data=request.data, context={"request": request}
        )
        reply_serializer.is_valid(raise_exception=True)
        message = reply_serializer.save()
        self.log_action(request, ActivityLog.Action.UPDATED, message, {"action": "replied"})
        from apps.messages_app.services import ContactService
        ContactService.send_reply_email(message)
        return Response(
            {"detail": "Reply saved and email sent.", "message_id": message.pk}
        )

    @action(detail=False, methods=["get"], url_path="export")
    def export_csv(self, request):
        messages = self.filter_queryset(self.get_queryset())
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        if start_date:
            messages = messages.filter(created_at__gte=start_date)
        if end_date:
            messages = messages.filter(created_at__lte=end_date)
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(["id", "name", "email", "phone", "company", "subject", "message",
                          "budget", "status", "language", "created_at"])
        for m in messages:
            writer.writerow([
                m.pk, m.name, m.email, m.phone or "", m.company or "",
                m.subject, m.message, m.budget_range, m.status, m.language,
                m.created_at.isoformat(),
            ])
        response = HttpResponse(output.getvalue(), content_type="text/csv")
        filename = f"messages_{datetime.date.today()}.csv"
        if start_date:
            filename = f"messages_{start_date}_{end_date or 'now'}.csv"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        from django.utils import timezone
        now = timezone.now()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today - datetime.timedelta(days=today.weekday())
        month_start = today.replace(day=1)
        qs = ContactMessage.objects.all()
        replied = qs.filter(status="replied").count()
        read = qs.filter(status="read").count()
        response_rate = round((replied / (replied + read)) * 100, 1) if (replied + read) > 0 else 0
        data = {
            "total": qs.count(),
            "new": qs.filter(status="new").count(),
            "read": read,
            "replied": replied,
            "archived": qs.filter(status="archived").count(),
            "spam": qs.filter(status="spam").count(),
            "today": qs.filter(created_at__gte=today).count(),
            "this_week": qs.filter(created_at__gte=week_start).count(),
            "this_month": qs.filter(created_at__gte=month_start).count(),
            "response_rate": response_rate,
        }
        return Response(data)


# ---------------------------------------------------------------------------
# SiteConfig (singleton)
# ---------------------------------------------------------------------------


class SiteConfigAdminView(ActivityLogMixin, views.APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        config = SiteConfig.load()
        serializer = SiteConfigAdminSerializer(config)
        return Response(serializer.data)

    def patch(self, request):
        config = SiteConfig.load()
        serializer = SiteConfigAdminSerializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        self.log_action(request, ActivityLog.Action.UPDATED, instance)
        return Response(SiteConfigAdminSerializer(instance).data)


# ---------------------------------------------------------------------------
# PageSEO
# ---------------------------------------------------------------------------


class PageSEOAdminView(ActivityLogMixin, views.APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request, page_key=None):
        if page_key:
            page = get_object_or_404(PageSEO, page_key=page_key)
            return Response(PageSEOAdminSerializer(page).data)
        pages = PageSEO.objects.prefetch_related("translations__language").all()
        return Response(PageSEOAdminSerializer(pages, many=True).data)

    def post(self, request):
        serializer = PageSEOAdminSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        page = serializer.save()
        self.log_action(request, ActivityLog.Action.CREATED, page)
        return Response(PageSEOAdminSerializer(page).data, status=status.HTTP_201_CREATED)

    def patch(self, request, page_key=None):
        page = get_object_or_404(PageSEO, page_key=page_key)
        serializer = PageSEOAdminSerializer(page, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        page = serializer.save()
        self.log_action(request, ActivityLog.Action.UPDATED, page)
        return Response(PageSEOAdminSerializer(page).data)


# ---------------------------------------------------------------------------
# Language
# ---------------------------------------------------------------------------


class LanguageAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = Language.objects.all().order_by("order")
    serializer_class = LanguageAdminSerializer
    permission_classes = [IsSuperAdmin]
    pagination_class = AdminPagination
    filterset_fields = ["is_active"]
    http_method_names = ["get", "patch", "head", "options"]


# ---------------------------------------------------------------------------
# User management
# ---------------------------------------------------------------------------


class UserAdminViewSet(ActivityLogMixin, viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    permission_classes = [IsSuperAdmin]
    pagination_class = AdminPagination
    filterset_fields = ["role", "is_active"]
    search_fields = ["email", "first_name", "last_name"]

    def get_serializer_class(self):
        if self.action == "create":
            return UserAdminCreateSerializer
        if self.action in ("update", "partial_update"):
            return UserAdminUpdateSerializer
        return UserAdminListSerializer

    @action(detail=True, methods=["get"], url_path="activity")
    def activity(self, request, pk=None):
        user = self.get_object()
        logs = user.activity_logs.all()[:50]
        data = [
            {
                "id": log.pk,
                "action": log.action,
                "model_name": log.model_name,
                "object_id": log.object_id,
                "ip_address": log.ip_address,
                "created_at": log.created_at.isoformat(),
            }
            for log in logs
        ]
        return Response(data)


# ---------------------------------------------------------------------------
# Media Upload
# ---------------------------------------------------------------------------


class MediaUploadView(views.APIView):
    permission_classes = [IsEditorOrAbove]
    parser_classes = [MultiPartParser]

    def post(self, request):
        serializer = MediaUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uploaded = serializer.validated_data["file"]
        folder = request.GET.get("folder", "uploads")
        import os, uuid
        ext = uploaded.name.rsplit(".", 1)[-1].lower() if "." in uploaded.name else "png"
        filename = f"{uuid.uuid4().hex}.{ext}"
        path_in_media = f"{folder}/{datetime.date.today().isoformat()}/{filename}"

        from django.core.files.storage import default_storage
        saved_path = default_storage.save(path_in_media, uploaded)
        url = default_storage.url(saved_path)

        thumbnail_url = None
        try:
            img = Image.open(uploaded)
            img.thumbnail((300, 300))
            thumb_ext = "webp"
            thumb_filename = f"{uuid.uuid4().hex}_thumb.{thumb_ext}"
            thumb_path = f"{folder}/{datetime.date.today().isoformat()}/{thumb_filename}"
            thumb_buffer = BytesIO()
            img.save(thumb_buffer, format="WEBP", quality=80)
            thumb_file = ContentFile(thumb_buffer.getvalue())
            saved_thumb_path = default_storage.save(thumb_path, thumb_file)
            thumbnail_url = default_storage.url(saved_thumb_path)
        except Exception:
            pass

        return Response({
            "url": url,
            "thumbnail_url": thumbnail_url,
            "filename": filename,
            "size": uploaded.size,
        }, status=status.HTTP_201_CREATED)


# ---------------------------------------------------------------------------
# Backups (stub P4, complet P22)
# ---------------------------------------------------------------------------


class BackupView(views.APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        return Response({
            "backups": [],
            "detail": "Backup system will be fully implemented in P22.",
        })

    def post(self, request):
        return Response({
            "detail": "Manual backup triggered. Full implementation in P22.",
        }, status=status.HTTP_202_ACCEPTED)
