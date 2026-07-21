# Security Guide

Security posture for Divine Children Home Ltd public website and API.

## Threat model

- **Public read site** — no user accounts on the frontend.
- **Anonymous writes** — contact, referral, career, newsletter forms.
- **Secrets** — Supabase service role key on API server only.

## Secrets management

| Secret | Location | Never |
|--------|----------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | `artifacts/api-server/.env` | Frontend, git, client bundle |
| `SUPABASE_URL` | API `.env` | Committed with real keys |

Use `.env.example` as template. Rotate keys in Supabase if exposed.

## API hardening (implemented)

- **Rate limiting** — 200 req / 15 min global; 20 / 15 min on form routes
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
- **Body size limit** — 1 MB JSON
- **Input validation** — Zod schemas on all POST bodies and param parsing
- **Error sanitization** — Generic message in production for 500 errors
- **Structured logging** — Pino; no passwords in logs
- **CORS** — Set `CORS_ORIGIN` to frontend origin in production (comma-separated list supported)

## Database

- Service role used only server-side.
- RLS enabled on tables; review policies in migrations.
- Parameterized queries via Supabase client (no raw SQL in routes).
- Unique constraint on newsletter email prevents duplicates.

## Frontend

- React escapes JSX by default (XSS mitigation).
- No `dangerouslySetInnerHTML` on user content in standard pages.
- Cookie consent banner for GDPR awareness.
- External links should use `rel="noopener noreferrer"` when added.

## Forms

- Server-side validation is authoritative; client validation is UX only.
- Reference numbers generated server-side for audit trail.
- Consider CAPTCHA or honeypot if spam becomes an issue (not yet implemented).

## Transport

- Production must use HTTPS for frontend and API.
- HSTS at CDN / reverse proxy recommended.

## Deployment checklist

- [ ] `NODE_ENV=production` on API
- [ ] `CORS_ORIGIN` set to production frontend URL(s)
- [ ] Service role key in host env, not in repo
- [ ] Supabase RLS policies reviewed
- [ ] Rate limits appropriate for traffic
- [ ] Logging/monitoring configured (e.g. host logs, Supabase logs)
- [ ] Dependencies updated regularly (`pnpm audit`)

## Incident response

1. Rotate Supabase service role key if leaked.
2. Review submission tables for abuse.
3. Tighten rate limits or add WAF rules at edge.
4. Check Supabase auth logs and API pino logs.

## Not in scope (future)

- Admin dashboard authentication
- CSRF tokens (less critical for JSON API without cookies)
- Content Security Policy header (add when asset hosts are finalized)
- Web Application Firewall (Cloudflare, etc.)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for hosting guidance.
