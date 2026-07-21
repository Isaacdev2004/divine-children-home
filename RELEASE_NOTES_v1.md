# Release Notes — v1.0.0

**Divine Children Home Ltd**  
**Release date:** July 2026  
**Status:** Production ready

---

## Overview

First production release of the Divine Children Home digital platform — a full-stack web application for a UK children's residential care provider, including public website, referral/contact flows, and enterprise admin CMS.

---

## Public Website

- Premium responsive SPA (React 19, Vite 7, Tailwind CSS 4)
- Homepage with hero, services, stats, testimonials, news, CTAs
- Pages: About, Homes, Services, Safeguarding, Careers, News, Gallery, Resources, FAQs, Contact, Legal
- Referral form with reference number confirmation
- Contact form with careers prefill and inline success states
- Cookie consent with privacy-compliant analytics opt-in
- WCAG 2.2 AA accessibility improvements
- SEO: per-page metadata, sitemap, robots.txt, Schema.org Organization

---

## Admin CMS

- JWT-based admin authentication via API
- Dashboard with content counts
- CMS modules: News, Jobs, FAQs, Gallery, Testimonials, Site Stats, Homes, Services, Resources
- Form submissions viewer (contact, referral, careers, newsletter)
- Media upload with MIME validation and filename sanitisation
- User management and audit logging
- Role-based permissions (super_admin, editor, viewer)

---

## API Server

- Express 5 REST API with Supabase backend
- Structured logging (Pino) with secret redaction
- Request IDs on all responses
- Rate limiting (API, forms, auth)
- Security headers (HSTS in production, X-Frame-Options, nosniff)
- Environment validation at startup
- Zod validation on all inputs

---

## Infrastructure

- Monorepo (pnpm workspaces)
- CI/CD: GitHub Actions (typecheck, test, build, E2E)
- Deployment targets: Vercel (frontend), Railway/Render (API), Supabase (DB/storage)
- 12 automated unit tests + Playwright E2E suite

---

## Security Highlights

- Service role key server-side only
- Admin auth rate limiting (10 attempts / 15 min)
- File upload MIME whitelist and size limits (20MB)
- CORS restricted in production
- No secrets in logs

---

## Breaking Changes

None — initial release.

---

## Known Limitations

- Placeholder contact details (phone, address) — update before public launch
- Resource PDFs require contact request (files not publicly hosted)
- Map embed is placeholder
- Virus scan integration is placeholder hook only
- mockup-sandbox artifact excluded from production build

---

## Upgrade Notes

1. Copy `.env.example` to API and frontend `.env` files
2. Run Supabase migrations
3. Create admin user via script
4. Deploy API before frontend
5. Complete `PRODUCTION_CHECKLIST.md`

---

## Contributors

Built with Phase 1–5 engineering: production refactor, admin CMS, UX polish, and release hardening.
