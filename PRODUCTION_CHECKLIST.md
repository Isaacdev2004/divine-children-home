# Production Checklist — Divine Children Home Ltd v1.0

**Release:** v1.0.0  
**Date:** July 2026

Use this checklist before every production deployment.

---

## Pre-Deploy Verification

### Code quality
- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run test` passes (12 unit/integration tests)
- [ ] `pnpm run build` passes (frontend + API)
- [ ] `pnpm run test:e2e` passes (Playwright)
- [ ] No uncommitted secrets in repository

### Environment
- [ ] `artifacts/api-server/.env` configured on host (Railway/Render)
- [ ] `CORS_ORIGIN` set to production frontend URL
- [ ] `NODE_ENV=production`
- [ ] `TRUST_PROXY=true` on API host
- [ ] Supabase URL and service role key set
- [ ] Vercel env vars set (`VITE_API_BASE_URL` if using direct API calls)

### Database (Supabase)
- [ ] All migrations applied (`000_combined.sql`, `004_admin_cms.sql`)
- [ ] RLS policies verified
- [ ] Admin user created (`pnpm --filter @workspace/scripts run create-admin`)
- [ ] Backup schedule enabled in Supabase dashboard

### Security
- [ ] Default admin password changed from script default
- [ ] Service role key never exposed to frontend
- [ ] Rate limiting active on `/api` and auth routes
- [ ] File upload MIME whitelist enforced
- [ ] Security headers verified (X-Frame-Options, nosniff, HSTS)

### Content
- [ ] Replace placeholder phone number (0800 123 4567)
- [ ] Replace placeholder address
- [ ] Verify Ofsted/CQC registration claims
- [ ] Review legal pages (privacy, terms, cookies, complaints)

### SEO
- [ ] `robots.txt` and `sitemap.xml` accessible
- [ ] Canonical URLs point to production domain
- [ ] Open Graph tags verified
- [ ] Google Search Console property verified

### Monitoring
- [ ] GA4 measurement ID configured (optional)
- [ ] Uptime monitoring on `/api/healthz`
- [ ] Error tracking (Sentry) configured (optional)
- [ ] Cookie consent respects analytics opt-in

---

## Post-Deploy Verification

- [ ] Homepage loads over HTTPS
- [ ] Contact form submits successfully
- [ ] Referral form returns reference number
- [ ] Admin login works at `/admin/login`
- [ ] CMS CRUD operations work
- [ ] Mobile navigation functional
- [ ] No console errors on key pages
- [ ] Lighthouse score ≥ 90 performance/accessibility (target)

---

## Rollback Plan

1. Revert Vercel deployment to previous build
2. Revert Railway/Render API deployment
3. Restore database from Supabase backup if schema/data migration failed
4. Notify stakeholders via status page

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Release Manager | | | |
| QA Lead | | | |
| Security | | | |
