# Codebase Guide

Quick reference for developers working on Divine Children Home Ltd.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase project with migrations applied (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

## Getting started

```bash
pnpm install

# Terminal 1 — frontend (http://localhost:23337)
pnpm dev:web

# Terminal 2 — API (http://localhost:8080)
pnpm dev:api

# Verify Supabase connectivity
pnpm verify:supabase
```

Copy `.env.example` values into:

- `artifacts/divine-children-home/.env`
- `artifacts/api-server/.env` (requires `SUPABASE_SERVICE_ROLE_KEY`)

## Monorepo layout

```
Divine-Children-Home/
├── artifacts/
│   ├── divine-children-home/   React SPA
│   └── api-server/             Express API
├── lib/
│   ├── api-spec/               OpenAPI + Orval config
│   ├── api-zod/                Generated Zod schemas
│   ├── api-client-react/       Generated React Query hooks
│   └── supabase/               DB client + repositories
├── scripts/                    verify-supabase, etc.
├── supabase/migrations/        SQL migrations
└── docs (ARCHITECTURE.md, …)
```

## Common tasks

### Add or change an API endpoint

1. Edit `lib/api-spec/openapi.yaml`.
2. Regenerate clients: `pnpm --filter @workspace/api-spec run generate` (if script exists) or run Orval per package README.
3. Add repository function in `lib/supabase/src/repositories/`.
4. Add route in `artifacts/api-server/src/routes/`.
5. Run `pnpm run typecheck`.

### Add a page

1. Create `artifacts/divine-children-home/src/pages/my-page.tsx`.
2. Register lazy route in `src/app/routes.tsx`.
3. Add nav link in `src/components/layout/header.tsx` if needed.
4. Use `usePageMeta("Title", "Description")` for SEO.
5. Add URL to `public/sitemap.xml` and `src/config/site.ts` `publicRoutes`.

### Change site copy / contact details

Central constants: `artifacts/divine-children-home/src/config/site.ts`.

### Database changes

1. Add migration SQL under `supabase/migrations/`.
2. Update `000_combined.sql` for fresh installs.
3. Update mappers/repositories and OpenAPI if API shape changes.
4. Run migration in Supabase SQL Editor.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:web` | Vite dev server |
| `pnpm dev:api` | Build + start API |
| `pnpm run typecheck` | TypeScript across workspace |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm verify:supabase` | Table + storage smoke test |

## Conventions

- **Imports**: Frontend uses `@/` alias → `src/`.
- **Styling**: Tailwind + shadcn/ui; avoid inline styles except dynamic values.
- **API errors**: Throw `ApiError` in routes; global handler formats JSON `{ error: string }`.
- **Validation**: Always use Zod schemas from `@workspace/api-zod`.
- **Logging**: Use `req.log` (pino) in route handlers for structured logs.

## Testing locally

1. Ensure Supabase migrations and seed data are applied.
2. Start API and web dev servers.
3. Hit `http://localhost:8080/api/healthz` for API health.
4. Browse `http://localhost:23337` and exercise forms (contact, referral, newsletter).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API won't start | Set `PORT` and `SUPABASE_SERVICE_ROLE_KEY` in API `.env` |
| Empty data on site | Run migrations + seed; check Supabase dashboard |
| CORS in production | Set `CORS_ORIGIN` to your frontend URL |
| Type errors after API change | Regenerate Orval outputs and rebuild libs |
