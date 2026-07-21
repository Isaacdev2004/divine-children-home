# Local Setup Report — Divine Children Home Ltd

**Date:** 21 July 2026 (updated after Supabase migration)  
**Environment:** Windows 10, Node.js v24.14.1, pnpm v10.26.2, Cursor IDE  
**Status:** Frontend and API run without Docker. Supabase is the database backend.

---

## Executive Summary

The project is a **pnpm workspace monorepo** with a React/Vite frontend and Express API. **Database and storage are hosted on Supabase** — no Docker, Docker Compose, or local PostgreSQL required.

Local development uses two commands:

```powershell
pnpm dev:api    # Terminal 1 — http://localhost:8080
pnpm dev:web    # Terminal 2 — http://localhost:23337
```

---

## Project Architecture

| Layer | Technology |
|-------|------------|
| Monorepo | pnpm workspaces |
| Frontend | React 19 + Vite 7 + Wouter |
| Backend | Express 5 REST API |
| Database | **Supabase (PostgreSQL)** via `@supabase/supabase-js` |
| Image storage | **Supabase Storage** (`images` bucket) |
| API contract | OpenAPI → Orval codegen |

```
Browser → Vite (:23337) → proxy /api → Express (:8080) → Supabase
```

---

## Packages

| Package | Path | Role |
|---------|------|------|
| `@workspace/divine-children-home` | `artifacts/divine-children-home/` | Public website |
| `@workspace/api-server` | `artifacts/api-server/` | REST API |
| `@workspace/supabase` | `lib/supabase/` | Supabase client, mappers, storage helpers |
| `@workspace/api-client-react` | `lib/api-client-react/` | Generated React Query hooks |
| `@workspace/api-zod` | `lib/api-zod/` | Generated Zod validators |

**Removed:** `@workspace/db` (Drizzle ORM + local PostgreSQL)

---

## Environment Variables

### API — `artifacts/api-server/.env`

```env
PORT=8080
NODE_ENV=development
LOG_LEVEL=info
SUPABASE_URL=https://xfxhgicqxtaqavxyytqm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Frontend — `artifacts/divine-children-home/.env`

```env
PORT=23337
BASE_PATH=/
VITE_API_PROXY_TARGET=http://localhost:8080
```

See **`SUPABASE_SETUP.md`** for full Supabase configuration and migration steps.

---

## First-Time Supabase Setup

1. Get **service role key** from [Supabase Dashboard](https://supabase.com/dashboard/project/xfxhgicqxtaqavxyytqm) → Settings → API
2. Add it to `artifacts/api-server/.env`
3. Run **`supabase/migrations/000_combined.sql`** in Supabase SQL Editor
4. Verify: `pnpm verify:supabase`

---

## Commands

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Start frontend | `pnpm dev:web` |
| Start API | `pnpm dev:api` |
| Verify Supabase | `pnpm verify:supabase` |
| Typecheck | `pnpm run typecheck` |
| Build all | `pnpm run build` |

---

## Local URLs

| Service | URL |
|---------|-----|
| **Website** | http://localhost:23337/ |
| API (direct) | http://localhost:8080/api |
| API (via proxy) | http://localhost:23337/api |
| Health check | http://localhost:23337/api/healthz |

---

## What Was Removed

- Docker / Docker Desktop
- Docker Compose
- Local PostgreSQL
- `DATABASE_URL`
- Drizzle ORM (`lib/db`)
- `pnpm db:push`

---

## Documentation

| Document | Purpose |
|----------|---------|
| `SUPABASE_SETUP.md` | Supabase setup, migrations, storage, troubleshooting |
| `SOFTWARE_HANDOVER.md` | Full architecture handover (may reference pre-Supabase details in places) |
| `replit.md` | Operational runbook |

---

*No Docker required. See SUPABASE_SETUP.md for database migration and content management.*
