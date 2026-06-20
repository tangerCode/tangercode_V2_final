import hashlib
import json
import logging
from datetime import date, timedelta

from django.conf import settings
from django.core.cache import caches

from apps.core.models import SiteConfig

logger = logging.getLogger(__name__)

CACHE_TTL = 900
CACHE_KEY_PREFIX = "ga4"

try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange,
        Dimension,
        Metric,
        RunReportRequest,
        RunRealtimeReportRequest,
    )
    GA4_SDK_AVAILABLE = True
except ImportError:
    GA4_SDK_AVAILABLE = False
    logger.warning("google-analytics-data SDK not installed. GA4 endpoints will return not_configured.")


class GA4Service:
    def __init__(self):
        self.config = SiteConfig.load()
        self._client = None

    @property
    def is_configured(self) -> bool:
        return bool(
            self.config.ga4_property_id
            and self.config.ga4_property_id.strip()
            and GA4_SDK_AVAILABLE
        )

    def _get_client(self):
        if self._client is not None:
            return self._client
        credentials_path = settings.GA4_CREDENTIALS_PATH
        if credentials_path and credentials_path.strip():
            self._client = BetaAnalyticsDataClient.from_service_account_json(credentials_path)
        else:
            self._client = BetaAnalyticsDataClient()
        return self._client

    def _property_path(self) -> str:
        return f"properties/{self.config.ga4_property_id.strip()}"

    def _run_report(self, dimensions, metrics, start_date, end_date, limit=None, order_by=None):
        if not self.is_configured:
            return None
        cache_key = _make_cache_key("report", dimensions, metrics, start_date, end_date, limit)
        cached = caches["default"].get(cache_key)
        if cached is not None:
            return cached
        try:
            client = self._get_client()
            request = RunReportRequest(
                property=self._property_path(),
                date_ranges=[DateRange(start_date=str(start_date), end_date=str(end_date))],
                dimensions=[Dimension(name=d) for d in dimensions],
                metrics=[Metric(name=m) for m in metrics],
            )
            if limit:
                request.limit = limit
            if order_by:
                request.order_bys = order_by
            response = client.run_report(request)
            result = _parse_report(response, dimensions, metrics)
            caches["default"].set(cache_key, result, CACHE_TTL)
            return result
        except Exception as e:
            logger.exception("GA4 report failed: %s", dimensions)
            return {"_error": str(e)[:200]}

    def _run_realtime(self, dimensions, metrics, limit=None):
        if not self.is_configured:
            return None
        try:
            client = self._get_client()
            request = RunRealtimeReportRequest(
                property=self._property_path(),
                dimensions=[Dimension(name=d) for d in dimensions],
                metrics=[Metric(name=m) for m in metrics],
            )
            if limit:
                request.limit = limit
            response = client.run_realtime_report(request)
            return _parse_report(response, dimensions, metrics)
        except Exception as e:
            logger.exception("GA4 realtime failed")
            return {"_error": str(e)[:200]}

    def get_overview(self, start_date, end_date) -> dict:
        if not self.is_configured:
            return {"status": "not_configured", "data": {}}
        try:
            client = self._get_client()
            request = RunReportRequest(
                property=self._property_path(),
                date_ranges=[DateRange(start_date=str(start_date), end_date=str(end_date))],
                metrics=[
                    Metric(name="activeUsers"),
                    Metric(name="sessions"),
                    Metric(name="screenPageViews"),
                    Metric(name="bounceRate"),
                    Metric(name="averageSessionDuration"),
                    Metric(name="conversions"),
                ],
            )
            response = client.run_report(request)
            row = response.rows[0] if response.rows else None
            data = {
                "users": int(row.metric_values[0].value) if row else 0,
                "sessions": int(row.metric_values[1].value) if row else 0,
                "page_views": int(row.metric_values[2].value) if row else 0,
                "bounce_rate": round(float(row.metric_values[3].value), 2) if row else 0.0,
                "avg_session_duration": round(float(row.metric_values[4].value), 2) if row else 0.0,
                "conversions": int(float(row.metric_values[5].value)) if row else 0,
            }
            return {"status": "ok", "data": data}
        except Exception as e:
            logger.exception("GA4 overview failed")
            return {"status": "error", "data": {}, "message": str(e)[:200]}

    def get_traffic_sources(self, start_date, end_date) -> dict:
        rows = self._run_report(
            ["sessionSource", "sessionMedium"],
            ["sessions", "activeUsers"],
            start_date, end_date,
            limit=10,
            order_by=[{"metric": {"metric_name": "sessions"}, "desc": True}],
        )
        if rows is None:
            return {"status": "not_configured", "data": []}
        if isinstance(rows, dict) and "_error" in rows:
            return {"status": "error", "data": [], "message": rows["_error"]}
        return {"status": "ok", "data": rows}

    def get_top_pages(self, start_date, end_date, limit=10) -> dict:
        rows = self._run_report(
            ["pagePath", "pageTitle"],
            ["screenPageViews", "averageSessionDuration"],
            start_date, end_date,
            limit=limit,
            order_by=[{"metric": {"metric_name": "screenPageViews"}, "desc": True}],
        )
        if rows is None:
            return {"status": "not_configured", "data": []}
        if isinstance(rows, dict) and "_error" in rows:
            return {"status": "error", "data": [], "message": rows["_error"]}
        return {"status": "ok", "data": rows}

    def get_devices(self, start_date, end_date) -> dict:
        rows = self._run_report(
            ["deviceCategory"],
            ["sessions"],
            start_date, end_date,
        )
        if rows is None:
            return {"status": "not_configured", "data": []}
        if isinstance(rows, dict) and "_error" in rows:
            return {"status": "error", "data": [], "message": rows["_error"]}
        total = sum(r.get("sessions", 0) or 0 for r in rows)
        for r in rows:
            r["percentage"] = round((r.get("sessions", 0) or 0) / total * 100, 1) if total else 0
        return {"status": "ok", "data": rows}

    def get_countries(self, start_date, end_date, limit=10) -> dict:
        rows = self._run_report(
            ["country"],
            ["sessions", "activeUsers"],
            start_date, end_date,
            limit=limit,
            order_by=[{"metric": {"metric_name": "sessions"}, "desc": True}],
        )
        if rows is None:
            return {"status": "not_configured", "data": []}
        if isinstance(rows, dict) and "_error" in rows:
            return {"status": "error", "data": [], "message": rows["_error"]}
        return {"status": "ok", "data": rows}

    def get_conversions(self, start_date, end_date) -> dict:
        if not self.is_configured:
            return {"status": "not_configured", "data": {}}
        try:
            client = self._get_client()
            request = RunReportRequest(
                property=self._property_path(),
                date_ranges=[DateRange(start_date=str(start_date), end_date=str(end_date))],
                dimensions=[Dimension(name="eventName")],
                metrics=[Metric(name="eventCount")],
                dimension_filter={
                    "filter": {
                        "field_name": "eventName",
                        "in_list_filter": {
                            "values": [
                                "contact_form_submitted",
                                "whatsapp_button_clicked",
                                "pricing_cta_clicked",
                            ],
                        },
                    },
                },
            )
            response = client.run_report(request)
            counts = {}
            for row in response.rows:
                name = row.dimension_values[0].value
                counts[name] = int(float(row.metric_values[0].value))
            total = sum(counts.values())
            sessions_req = RunReportRequest(
                property=self._property_path(),
                date_ranges=[DateRange(start_date=str(start_date), end_date=str(end_date))],
                metrics=[Metric(name="sessions")],
            )
            sessions_resp = client.run_report(sessions_req)
            sessions = int(sessions_resp.rows[0].metric_values[0].value) if sessions_resp.rows else 1
            data = {
                "contact_submissions": counts.get("contact_form_submitted", 0),
                "whatsapp_clicks": counts.get("whatsapp_button_clicked", 0),
                "pricing_cta_clicks": counts.get("pricing_cta_clicked", 0),
                "total_conversions": total,
                "conversion_rate": round(total / sessions * 100, 2) if sessions else 0,
            }
            return {"status": "ok", "data": data}
        except Exception as e:
            logger.exception("GA4 conversions failed")
            return {"status": "error", "data": {}, "message": str(e)[:200]}

    def get_realtime_users(self) -> dict:
        rows = self._run_realtime(["country"], ["activeUsers"], limit=20)
        if rows is None:
            return {"status": "not_configured", "data": {}}
        if isinstance(rows, dict) and "_error" in rows:
            return {"status": "error", "data": {}, "message": rows["_error"]}
        total = sum(r.get("activeUsers", 0) or 0 for r in rows)
        return {"status": "ok", "data": {"active_users": total, "pages": rows}}

    @staticmethod
    def invalidate_cache():
        cache = caches["default"]
        try:
            cache.delete_pattern(f"{CACHE_KEY_PREFIX}_*")
        except AttributeError:
            pass


def _make_cache_key(*parts) -> str:
    raw = json.dumps(parts, default=str)
    return f"{CACHE_KEY_PREFIX}_{hashlib.sha256(raw.encode()).hexdigest()[:16]}"


def _parse_report(response, dimensions, metrics):
    rows = []
    for row in response.rows:
        entry = {}
        for i, dim in enumerate(dimensions):
            entry[dim.replace("session", "").replace("page", "").lstrip("_").lstrip("screen").lstrip("event")] = \
                row.dimension_values[i].value
        for i, met in enumerate(metrics):
            val = row.metric_values[i].value
            entry[met.replace("screen", "").strip("_")] = int(float(val)) if float(val) == int(float(val)) else round(float(val), 2)
        rows.append(entry)
    return rows
