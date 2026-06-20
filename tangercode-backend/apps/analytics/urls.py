from django.urls import path

from . import views

analytics_view = views.AnalyticsView.as_view()

urlpatterns = [
    path("analytics/overview/", analytics_view, {"type": "overview"}, name="admin-analytics-overview"),
    path("analytics/traffic-sources/", analytics_view, {"type": "traffic_sources"}, name="admin-analytics-traffic"),
    path("analytics/top-pages/", analytics_view, {"type": "top_pages"}, name="admin-analytics-pages"),
    path("analytics/devices/", analytics_view, {"type": "devices"}, name="admin-analytics-devices"),
    path("analytics/countries/", analytics_view, {"type": "countries"}, name="admin-analytics-countries"),
    path("analytics/conversions/", analytics_view, {"type": "conversions"}, name="admin-analytics-conversions"),
    path("analytics/realtime/", analytics_view, {"type": "realtime"}, name="admin-analytics-realtime"),
    path("analytics/", analytics_view, {"type": "overview"}, name="admin-analytics"),
]
