from django.db.models import Count, Sum, Q
from django.utils import timezone
from rest_framework import mixins, permissions, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from apps.translation.models import AIProvider, TranslationLog, TranslationPrompt
from apps.translation.serializers import (
    AIProviderSerializer,
    OnDemandTranslateSerializer,
    TranslationLogSerializer,
    TranslationPromptSerializer,
)
from apps.users.permissions import IsEditorOrAbove, IsSuperAdmin


class AdminPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class AIProviderAdminViewSet(viewsets.ModelViewSet):
    queryset = AIProvider.objects.all().order_by("-is_default", "name")
    serializer_class = AIProviderSerializer
    permission_classes = [IsSuperAdmin]
    pagination_class = AdminPagination

    @action(detail=True, methods=["post"], url_path="test")
    def test_connection(self, request, pk=None):
        provider = self.get_object()
        api_key = provider.decrypted_api_key
        if not api_key:
            return Response({"error": "No API key configured."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            from apps.translation.services import TranslationService
            service = TranslationService(provider=provider)
            result = service.translate("Hello world", "en", "fr", field_type="default")
            if result["status"] == "success":
                return Response({
                    "status": "ok",
                    "translated_text": result["translated_text"],
                    "tokens_used": result["tokens_used"],
                    "cost_usd": result["cost_usd"],
                    "duration_ms": result["duration_ms"],
                })
            return Response({"status": "error", "error_message": result.get("error_message", "Unknown")},
                            status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({"status": "error", "error_message": str(e)[:500]},
                            status=status.HTTP_502_BAD_GATEWAY)


class TranslationPromptAdminViewSet(mixins.ListModelMixin,
                                    mixins.RetrieveModelMixin,
                                    mixins.UpdateModelMixin,
                                    viewsets.GenericViewSet):
    queryset = TranslationPrompt.objects.all().order_by("field_type", "name")
    serializer_class = TranslationPromptSerializer
    permission_classes = [IsSuperAdmin]
    pagination_class = AdminPagination
    http_method_names = ["get", "patch", "head", "options"]


class TranslationLogAdminViewSet(mixins.ListModelMixin,
                                 mixins.RetrieveModelMixin,
                                 viewsets.GenericViewSet):
    queryset = TranslationLog.objects.select_related("content_type", "ai_provider").all()
    serializer_class = TranslationLogSerializer
    permission_classes = [IsEditorOrAbove]
    pagination_class = AdminPagination
    filterset_fields = ["status", "field_name", "source_language", "target_language"]
    ordering_fields = ["created_at", "tokens_used", "cost_usd"]
    ordering = ["-created_at"]

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        from django.db.models.functions import TruncMonth
        qs = self.filter_queryset(self.get_queryset())
        total_tokens = qs.aggregate(Sum("tokens_used"))["tokens_used__sum"] or 0
        total_cost = qs.aggregate(Sum("cost_usd"))["cost_usd__sum"] or 0
        by_status = qs.values("status").annotate(count=Count("id"))
        monthly = (
            qs.filter(status="success")
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(cost=Sum("cost_usd"), count=Count("id"))
            .order_by("-month")
        )
        return Response({
            "total_translations": qs.count(),
            "total_tokens_used": total_tokens,
            "total_cost_usd": float(total_cost),
            "by_status": {s["status"]: s["count"] for s in by_status},
            "by_month": [
                {"month": m["month"].strftime("%Y-%m"), "cost_usd": float(m["cost"] or 0), "count": m["count"]}
                for m in monthly
            ],
        })


class OnDemandTranslateView(views.APIView):
    permission_classes = [IsEditorOrAbove]

    def post(self, request):
        serializer = OnDemandTranslateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        prompt_template = None
        if data.get("prompt_id"):
            try:
                prompt_template = TranslationPrompt.objects.get(pk=data["prompt_id"])
            except TranslationPrompt.DoesNotExist:
                pass

        from apps.translation.services import TranslationService
        service = TranslationService()
        result = service.translate(
            text=data["content"],
            source_lang=data["source_lang"],
            target_lang=data["target_lang"],
            field_type=data.get("field_type", "default"),
            prompt_template=prompt_template,
        )

        if result["status"] == "error":
            return Response({
                "translated_text": "",
                "tokens_used": 0,
                "cost_usd": 0,
                "duration_ms": result.get("duration_ms", 0),
                "status": "error",
                "error_message": result.get("error_message", "Translation failed"),
            }, status=status.HTTP_502_BAD_GATEWAY)

        return Response({
            "translated_text": result["translated_text"],
            "tokens_used": result["tokens_used"],
            "cost_usd": result["cost_usd"],
            "duration_ms": result["duration_ms"],
            "status": "success",
        })
