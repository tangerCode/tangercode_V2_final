# Google Analytics 4 Integration

## Setup

### 1. Create a GA4 property
1. Go to https://analytics.google.com/
2. Create a new GA4 property for `tangercode.com`
3. Note the **Property ID** (a 9-digit number like `123456789`)

### 2. Create a Google Cloud Service Account
1. Go to https://console.cloud.google.com/
2. Create a new project (or use an existing one)
3. Enable the **Google Analytics Data API** in APIs & Services
4. Go to **IAM & Admin > Service Accounts**
5. Create a new service account with name `tangercode-analytics`
6. Create and download a JSON key for this service account

### 3. Grant access in GA4
1. In GA4 Admin > Property > Access Management
2. Add the service account email as a **Viewer**
3. Save

### 4. Configure the backend
1. Place the downloaded JSON key file at `/secrets/ga4-service-account.json`
2. Add to `.env`:
   ```
   GA4_CREDENTIALS_PATH=/secrets/ga4-service-account.json
   ```
3. Set the GA4 Property ID in the admin dashboard:
   `Dashboard > Configuration > Site > Google Analytics > GA4 Property ID`

### 5. Verify
1. Restart the backend
2. Call `GET /api/v1/admin/analytics/overview/`
3. You should see real data within 24-48 hours of setup

## Admin Endpoints

All endpoints require JWT authentication (Editor or above).

| Method | URL | Parameters |
|--------|-----|------------|
| GET | `/api/v1/admin/analytics/overview/` | `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` |
| GET | `/api/v1/admin/analytics/traffic-sources/` | `?start_date=&end_date=` |
| GET | `/api/v1/admin/analytics/top-pages/` | `?start_date=&end_date=&limit=10` |
| GET | `/api/v1/admin/analytics/devices/` | `?start_date=&end_date=` |
| GET | `/api/v1/admin/analytics/countries/` | `?start_date=&end_date=&limit=10` |
| GET | `/api/v1/admin/analytics/conversions/` | `?start_date=&end_date=` |
| GET | `/api/v1/admin/analytics/realtime/` | None |
| POST | `/api/v1/admin/analytics/` | Invalidates cache (body optional) |

### Cache
- All reports (except realtime) are cached for 15 minutes
- POST to `/api/v1/admin/analytics/` to invalidate the cache

### Response format
```json
{
  "status": "ok" | "not_configured" | "error",
  "data": { ... },
  "message": ""
}
```

## Custom Events (Frontend)

The following GA4 events should be tracked from the frontend:

| Event Name | Parameter | Description |
|-----------|-----------|-------------|
| `contact_form_submitted` | `service_interested` | Fired on successful contact form submission |
| `whatsapp_button_clicked` | — | Fired when WhatsApp button is clicked |
| `pricing_cta_clicked` | `pricing_tier` | Fired on pricing CTA button click |
| `language_switched` | `new_language` | Fired when user switches language |

Track these with `gtag('event', 'contact_form_submitted', { service_interested: '...' })`.
