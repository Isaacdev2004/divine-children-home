# Monitoring Guide — Divine Children Home Ltd

**Version:** 1.0.0

---

## Monitoring Stack

| Tool | Purpose | Integration |
|------|---------|-------------|
| **Pino structured logs** | API request/error logging | Railway/Render log drain |
| **Google Analytics 4** | Traffic, conversions | `VITE_GA_MEASUREMENT_ID` |
| **Microsoft Clarity** | Session replay, heatmaps | `VITE_CLARITY_PROJECT_ID` |
| **Google Search Console** | SEO, indexing | DNS verification |
| **Sentry** (optional) | Error tracking | `VITE_SENTRY_DSN` |
| **Uptime monitoring** | Availability alerts | Ping `/api/healthz` |

---

## API Logging

Structured JSON logs via Pino:

| Level | Usage |
|-------|-------|
| `debug` | Development only |
| `info` | Successful operations, form submissions |
| `warn` | Rate limit approaching, deprecated usage |
| `error` | 5xx errors, database failures |

**Redacted fields:** authorization headers, cookies, passwords, tokens, service role key.

**Request correlation:** Every response includes `X-Request-Id` header; errors include `requestId` in JSON body.

### Log query examples (Railway/Render)

```
level:error
requestId:"abc-123"
referenceNumber:"REF-2024"
```

---

## Health Checks

| Endpoint | Expected | Use |
|----------|----------|-----|
| `GET /api/healthz` | `{"status":"ok"}` | Load balancer, uptime monitor |
| Frontend `/` | HTTP 200 | Vercel monitoring |

Configure uptime monitor (UptimeRobot, Better Stack, etc.):

- URL: `https://api.divinechildrenhome.co.uk/api/healthz`
- Interval: 1–5 minutes
- Alert: email/Slack on 2 consecutive failures

---

## Analytics (Privacy-Compliant)

Analytics load **only after cookie consent** (`cookie-consent: accepted`).

Implementation: `src/lib/monitoring.ts`

### GA4 events to configure (recommended)

| Event | Trigger |
|-------|---------|
| `referral_submit` | Referral success panel shown |
| `contact_submit` | Contact success panel shown |
| `career_apply_click` | Apply button clicked |
| `phone_click` | tel: link clicked |

### Google Search Console

1. Verify domain ownership
2. Submit sitemap: `https://www.divinechildrenhome.co.uk/sitemap.xml`
3. Monitor Core Web Vitals report

---

## Error Tracking (Sentry — optional)

Add to frontend when ready:

```env
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

Configure `beforeSend` to scrub PII and honour cookie consent.

---

## Performance Monitoring

| Metric | Tool | Target |
|--------|------|--------|
| LCP | Lighthouse, CrUX | < 2.5s |
| INP | CrUX | < 200ms |
| CLS | CrUX | < 0.1 |
| API p95 latency | Railway metrics | < 500ms |
| Error rate | Logs / Sentry | < 0.1% |

---

## Alerting Thresholds

| Condition | Severity | Action |
|-----------|----------|--------|
| Health check fails 2× | Critical | Page on-call, check API logs |
| Error rate > 5% / 5min | High | Investigate recent deploy |
| Rate limit spike | Medium | Possible abuse — review IPs |
| Disk/storage quota 80% | Medium | Clean up or upgrade Supabase |

---

## Dashboard Recommendations

1. **Operations:** Uptime + error rate + deploy status
2. **Product:** GA4 conversions (referrals, contact, careers)
3. **SEO:** Search Console impressions/clicks
4. **Security:** Failed auth attempts, rate limit hits

---

## Cookie Consent & Monitoring

- Essential cookies: session/admin tokens (admin only)
- Analytics cookies: GA4, Clarity — loaded after explicit consent
- Decline path: essential-only, no analytics scripts loaded
