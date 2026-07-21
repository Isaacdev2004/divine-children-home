# Divine Children Home Ltd

A world-class corporate website for Divine Children Home Ltd — a premium children's residential care and supported living provider in the UK.

## Run & Operate

- `pnpm dev:web` — run the frontend (port 23337)
- `pnpm dev:api` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env (API): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` in `artifacts/api-server/.env`
- Database setup: see `SUPABASE_SETUP.md`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, Framer Motion, Wouter (routing)
- API: Express 5
- Database: Supabase (PostgreSQL + Storage)
- Validation: Zod (`zod/v4`)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (ESM bundle)

## Where things live

- `artifacts/divine-children-home/src/` — frontend React app
- `artifacts/api-server/src/routes/` — API route handlers (jobs, news, faqs, testimonials, gallery, stats, forms)
- `lib/supabase/` — Supabase client, types, mappers, storage helpers
- `supabase/migrations/` — SQL migration scripts for Supabase
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod validation schemas

## Pages

Home, About Us, Our Homes, Services, Referral Process, Careers, News, Resources, Contact, Safeguarding, FAQs, Gallery, Privacy Policy, Terms, Cookies Policy, Complaints Procedure, 404

## Brand

- Primary: Deep Navy #123B6D
- Secondary: Sky Blue #4FA9DD
- Accent: Warm Orange #F39C12
- Fonts: Inter (body), Poppins (headings)

## Architecture decisions

- OpenAPI-first: all API contracts defined in `lib/api-spec/openapi.yaml` before implementation
- Supabase as primary database and image storage (no local PostgreSQL or Docker required)
- Referral form includes urgency/placement-type fields for Local Authority workflows
- Form submissions store a generated reference number for tracking
- Stats stored in Supabase `site_stats` table (singleton row)
- Newsletter subscription silently ignores duplicate emails to prevent enumeration

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, re-run codegen before using updated types
- OpenAPI `format: email` is not supported by the current Zod version — omit from spec
- Run Supabase migrations after schema changes (see `SUPABASE_SETUP.md`)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend
