from datetime import date, timedelta

from rest_framework import status, views
from rest_framework.response import Response

from apps.users.permissions import IsEditorOrAbove


class AnalyticsView(views.APIView):
    permission_classes = [IsEditorOrAbove]

    def _parse_dates(self, request):
        start = request.GET.get("start_date")
        end = request.GET.get("end_date")
        today = date.today()
        if not start:
            start = today - timedelta(days=30)
        else:
            try:
                start = date.fromisoformat(start)
            except (ValueError, TypeError):
                start = today - timedelta(days=30)
        if not end:
            end = today
        else:
            try:
                end = date.fromisoformat(end)
            except (ValueError, TypeError):
                end = today
        return start, end

    def get(self, request, **kwargs):
        report_type = kwargs.get("type", "overview")
        from apps.analytics.services import GA4Service

        service = GA4Service()

        if report_type == "overview":
            start, end = self._parse_dates(request)
            result = service.get_overview(start, end)
        elif report_type == "traffic_sources":
            start, end = self._parse_dates(request)
            result = service.get_traffic_sources(start, end)
        elif report_type == "top_pages":
            start, end = self._parse_dates(request)
            limit = int(request.GET.get("limit", 10))
            result = service.get_top_pages(start, end, limit)
        elif report_type == "devices":
            start, end = self._parse_dates(request)
            result = service.get_devices(start, end)
        elif report_type == "countries":
            start, end = self._parse_dates(request)
            limit = int(request.GET.get("limit", 10))
            result = service.get_countries(start, end, limit)
        elif report_type == "conversions":
            start, end = self._parse_dates(request)
            result = service.get_conversions(start, end)
        elif report_type == "realtime":
            result = service.get_realtime_users()
        else:
            return Response({"error": "Unknown report type"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(result)

    def post(self, request, **kwargs):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        from apps.analytics.services import GA4Service
        GA4Service.invalidate_cache()
        return Response({"status": "ok", "message": "Analytics cache invalidated."})
