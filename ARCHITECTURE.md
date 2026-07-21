# Architecture

Divine Children Home Ltd is a **pnpm monorepo** with a React SPA frontend, Express API, shared libraries, and Supabase as the managed database and storage backend.

## System overview

```
Browser (React SPA :23337)
    │  /api/* proxied in dev
    ▼
Express API (:8080)
    │  service role
    ▼
Supabase (PostgreSQL + Storage)
```

| Layer | Package | Role |
|-------|---------|------|
| Frontend | `@workspace/divine-children-home` | Public website, Wouter routing, TanStack Query |
| API | `@workspace/api-server` | REST endpoints, validation, rate limiting |
| Data | `@workspace/supabase` | Client, repositories, mappers |
| Contract | `@workspace/api-spec` | OpenAPI source of truth |
| Generated | `@workspace/api-zod`, `@workspace/api-client-react` | Zod schemas and React Query hooks |

## Request flow

1. Page components call generated hooks from `@workspace/api-client-react`.
2. Hooks fetch `/api/...` (Vite dev proxy → Express in development).
3. Express routes validate input with `@workspace/api-zod`, call repository functions, return typed JSON.
4. Repositories use the Supabase service-role client for reads and form writes.

## Frontend structure

```
artifacts/divine-children-home/src/
├── app/           Route definitions (lazy-loaded)
├── components/    Layout, UI, shared widgets
├── config/        Site constants (SEO, contact)
├── hooks/         Reusable hooks (e.g. usePageMeta)
├── pages/         One file per route
└── lib/           Utilities
```

## API structure

```
artifacts/api-server/src/
├── app.ts              Express bootstrap
├── middleware/         Security, CORS, rate limits, errors
├── lib/                ApiError, async handler, validation
└── routes/             One router per resource
```

## Data layer

```
lib/supabase/src/
├── client.ts           Lazy Supabase client (service role)
├── mappers.ts          DB row ↔ API DTO mapping
├── repositories/       Query and insert functions
├── storage.ts          Image bucket helpers
└── errors.ts           DatabaseError wrapper
```

## Design decisions

- **OpenAPI-first**: API contract lives in `lib/api-spec/openapi.yaml`; Orval regenerates Zod and React client code.
- **Repository pattern**: Routes stay thin; SQL/Supabase logic is centralized and testable.
- **No auth on public site**: All endpoints are public read or anonymous form submission; service role key stays server-side only.
- **Lazy routes**: Pages are code-split to reduce initial bundle size.

## Environment boundaries

| Variable | Where | Purpose |
|----------|-------|---------|
| `PORT`, `BASE_PATH` | Frontend `.env` | Dev server |
| `VITE_API_PROXY_TARGET` | Frontend `.env` | Proxy target |
| `PORT`, `SUPABASE_*` | API `.env` | Server + database |
| `CORS_ORIGIN` | API `.env` | Optional production CORS allowlist |

## Related docs

- [CODEBASE_GUIDE.md](./CODEBASE_GUIDE.md) — day-to-day development
- [API_GUIDE.md](./API_GUIDE.md) — endpoints and patterns
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) — schema and migrations
- [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) — hardening checklist
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) — production deployment
