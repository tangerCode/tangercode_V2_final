import pytest
from unittest.mock import patch

from django.core.cache import caches


# ---------------------------------------------------------------------------
# Analytics Overview
# ---------------------------------------------------------------------------


class TestAnalyticsOverview:
    BASE = "/api/v1/admin/analytics"

    def test_overview_ok(self, api_client, auth_as_editor, site_config_with_ga4, mock_ga4_overview_response):
        with patch("apps.analytics.services.GA4Service._get_client") as mock_client:
            mock_client.return_value.run_report.return_value = mock_ga4_overview_response
            r = api_client.get(f"{self.BASE}/overview/?start_date=2025-01-01&end_date=2025-01-31")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["data"]["users"] >= 0

    def test_not_configured(self, api_client, auth_as_editor):
        r = api_client.get(f"{self.BASE}/overview/")
        assert r.status_code == 200
        assert r.json()["status"] == "not_configured"


# ---------------------------------------------------------------------------
# Analytics Traffic Sources
# ---------------------------------------------------------------------------


class TestAnalyticsTrafficSources:
    BASE = "/api/v1/admin/analytics"

    def test_traffic_sources(self, api_client, auth_as_editor, site_config_with_ga4, mock_ga4_traffic_response):
        with patch("apps.analytics.services.GA4Service._get_client") as mock_client:
            mock_client.return_value.run_report.return_value = mock_ga4_traffic_response
            r = api_client.get(f"{self.BASE}/traffic-sources/?start_date=2025-01-01&end_date=2025-01-31")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert len(data["data"]) >= 1


# ---------------------------------------------------------------------------
# Analytics Top Pages
# ---------------------------------------------------------------------------


class TestAnalyticsTopPages:
    BASE = "/api/v1/admin/analytics"

    def test_top_pages(self, api_client, auth_as_editor, site_config_with_ga4, mock_ga4_empty_response):
        with patch("apps.analytics.services.GA4Service._get_client") as mock_client:
            mock_client.return_value.run_report.return_value = mock_ga4_empty_response
            r = api_client.get(f"{self.BASE}/top-pages/?start_date=2025-01-01&end_date=2025-01-31")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"


# ---------------------------------------------------------------------------
# Analytics Devices
# ---------------------------------------------------------------------------


class TestAnalyticsDevices:
    BASE = "/api/v1/admin/analytics"

    def test_devices(self, api_client, auth_as_editor, site_config_with_ga4):
        from tests.conftest import _MockResponse
        mock_resp = _MockResponse([(["desktop"], [800]), (["mobile"], [400])])
        with patch("apps.analytics.services.GA4Service._get_client") as mock_client:
            mock_client.return_value.run_report.return_value = mock_resp
            r = api_client.get(f"{self.BASE}/devices/?start_date=2025-01-01&end_date=2025-01-31")
        assert r.status_code == 200
        data = r.json()["data"]
        assert len(data) == 2
        assert "percentage" in data[0]


# ---------------------------------------------------------------------------
# Analytics Countries
# ---------------------------------------------------------------------------


class TestAnalyticsCountries:
    BASE = "/api/v1/admin/analytics"

    def test_countries(self, api_client, auth_as_editor, site_config_with_ga4, mock_ga4_empty_response):
        with patch("apps.analytics.services.GA4Service._get_client") as mock_client:
            mock_client.return_value.run_report.return_value = mock_ga4_empty_response
            r = api_client.get(f"{self.BASE}/countries/?start_date=2025-01-01&end_date=2025-01-31")
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# Analytics Realtime
# ---------------------------------------------------------------------------


class TestAnalyticsRealtime:
    BASE = "/api/v1/admin/analytics"

    def test_realtime(self, api_client, auth_as_editor, site_config_with_ga4, mock_ga4_empty_response):
        with patch("apps.analytics.services.GA4Service._get_client") as mock_client:
            mock_client.return_value.run_realtime_report.return_value = mock_ga4_empty_response
            r = api_client.get(f"{self.BASE}/realtime/")
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# Analytics Cache
# ---------------------------------------------------------------------------


class TestAnalyticsCache:
    BASE = "/api/v1/admin/analytics"

    def test_cache_invalidation(self, api_client, auth_as_editor, site_config_with_ga4):

        r = api_client.post(f"{self.BASE}/")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"


# ---------------------------------------------------------------------------
# Analytics Auth
# ---------------------------------------------------------------------------


class TestAnalyticsAuth:
    BASE = "/api/v1/admin/analytics"

    def test_anonymous_denied(self, api_client):
        r = api_client.get(f"{self.BASE}/overview/")
        assert r.status_code == 401

    def test_editor_can_access(self, api_client, auth_as_editor, site_config_with_ga4):
        r = api_client.get(f"{self.BASE}/overview/")
        assert r.status_code == 200


# ---------------------------------------------------------------------------
# Analytics Conversions
# ---------------------------------------------------------------------------


class TestAnalyticsConversions:
    BASE = "/api/v1/admin/analytics"

    def test_conversions(self, api_client, auth_as_editor, site_config_with_ga4, mock_ga4_empty_response):
        with patch("apps.analytics.services.GA4Service._get_client") as mock_client:
            mock_client.return_value.run_report.return_value = mock_ga4_empty_response
            r = api_client.get(f"{self.BASE}/conversions/?start_date=2025-01-01&end_date=2025-01-31")
        assert r.status_code == 200
