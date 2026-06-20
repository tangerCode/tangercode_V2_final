import logging

from django.shortcuts import get_object_or_404
from rest_framework import mixins, permissions, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.services.models import PricingTier, Service, Technology
from apps.portfolio.models import Project
from apps.blog.models import BlogCategory, BlogPost, BlogTag
from apps.testimonials.models import Testimonial
from apps.faq.models import FAQCategory
from apps.messages_app.models import ContactMessage
from apps.core.models import PageSEO, SiteConfig

from .serializers import (
    BlogCategorySerializer,
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    BlogTagSerializer,
    ContactMessageSerializer,
    FAQCategorySerializer,
    PageSEOSerializer,
    PricingTierSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    ServiceDetailSerializer,
    ServiceListSerializer,
    SiteConfigSerializer,
    TechnologySerializer,
    TestimonialSerializer,
)

logger = logging.getLogger(__name__)


class LanguageContextMixin:
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.GET.get("lang", "fr")
        return context


class ServiceViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Service.objects.filter(is_active=True).prefetch_related(
            "technologies", "pricing_tiers__translations", "translations__language"
        ).order_by("order")

    def get_serializer_class(self):
        if self.action == "list":
            return ServiceListSerializer
        return ServiceDetailSerializer

    @action(detail=True, methods=["get"])
    def pricing(self, request, slug=None):
        service = self.get_object()
        tiers = service.pricing_tiers.filter(is_active=True).order_by("order")
        serializer = PricingTierSerializer(tiers, many=True, context=self.get_serializer_context())
        return Response(serializer.data)


class ProjectViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["category", "year", "featured"]

    def get_queryset(self):
        qs = Project.objects.filter(is_active=True).prefetch_related(
            "technologies", "images", "translations__language"
        ).order_by("-year", "order")
        technology_slug = self.request.GET.get("technology")
        if technology_slug:
            qs = qs.filter(technologies__slug=technology_slug)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return ProjectListSerializer
        return ProjectDetailSerializer

    @action(detail=False, methods=["get"])
    def categories(self, request):
        choices = [{"value": c[0], "label": c[1]} for c in Project.Category.choices]
        return Response(choices)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        projects = self.get_queryset().filter(featured=True)[:6]
        serializer = ProjectListSerializer(projects, many=True, context=self.get_serializer_context())
        return Response(serializer.data)


class BlogCategoryViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.filter(is_active=True).prefetch_related("translations__language")
    serializer_class = BlogCategorySerializer
    permission_classes = [permissions.AllowAny]


class BlogTagViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    queryset = BlogTag.objects.all().prefetch_related("translations__language")
    serializer_class = BlogTagSerializer
    permission_classes = [permissions.AllowAny]


class BlogPostViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = BlogPost.objects.filter(status="published").select_related("author").prefetch_related(
            "categories", "tags", "translations__language"
        ).order_by("-published_at", "-created_at")
        category_slug = self.request.GET.get("category")
        tag_slug = self.request.GET.get("tag")
        search = self.request.GET.get("search")
        if category_slug:
            qs = qs.filter(categories__slug=category_slug)
        if tag_slug:
            qs = qs.filter(tags__slug=tag_slug)
        if search:
            qs = qs.filter(translations__title__icontains=search).distinct()
        if self.request.GET.get("featured"):
            qs = qs.filter(featured=True)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return BlogPostListSerializer
        return BlogPostDetailSerializer

    @action(detail=True, methods=["post"])
    def view(self, request, slug=None):
        post = self.get_object()
        post.views_count += 1
        post.save(update_fields=["views_count"])
        return Response({"views": post.views_count}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def related(self, request, slug=None):
        post = self.get_object()
        related = BlogPost.objects.filter(
            status="published", categories__in=post.categories.all()
        ).exclude(pk=post.pk).distinct()[:3]
        serializer = BlogPostListSerializer(related, many=True, context=self.get_serializer_context())
        return Response(serializer.data)


class PricingTierViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = PricingTier.objects.filter(is_active=True).select_related("service").prefetch_related(
            "translations__language"
        ).order_by("service__order", "order")
        service_slug = self.request.GET.get("service")
        if service_slug:
            qs = qs.filter(service__slug=service_slug)
        return qs

    def get_serializer_class(self):
        return PricingTierSerializer

    @action(detail=False, methods=["get"], url_path="by-service/(?P<service_slug>[^/.]+)")
    def by_service(self, request, service_slug=None):
        service = get_object_or_404(Service, slug=service_slug, is_active=True)
        tiers = service.pricing_tiers.filter(is_active=True).order_by("order")
        serializer = PricingTierSerializer(tiers, many=True, context=self.get_serializer_context())
        return Response(serializer.data)


class TestimonialViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True).prefetch_related("translations__language").order_by("order")
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]


class FAQViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return FAQCategory.objects.filter(is_active=True).prefetch_related(
            "faqs__translations__language", "translations__language"
        ).order_by("order")

    def get_serializer_class(self):
        return FAQCategorySerializer

    def list(self, request, *args, **kwargs):
        categories = self.get_queryset()
        serializer = FAQCategorySerializer(categories, many=True, context=self.get_serializer_context())
        return Response(serializer.data)


class TechnologyViewSet(LanguageContextMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Technology.objects.filter(is_active=True).order_by("order")
    serializer_class = TechnologySerializer
    permission_classes = [permissions.AllowAny]


class SiteConfigView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        config = SiteConfig.load()
        serializer = SiteConfigSerializer(config, context={"lang": request.GET.get("lang", "fr")})
        return Response(serializer.data)


class SiteConfigSEOView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, page_key):
        page = get_object_or_404(PageSEO, page_key=page_key)
        serializer = PageSEOSerializer(page, context={"lang": request.GET.get("lang", "fr")})
        return Response(serializer.data)


class ContactView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data, context={"request": request, "lang": request.GET.get("lang", "fr")})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Message sent successfully"}, status=status.HTTP_201_CREATED)
