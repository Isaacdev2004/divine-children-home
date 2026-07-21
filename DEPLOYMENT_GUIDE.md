# Deployment Guide

Deploy the frontend and API as separate services behind HTTPS.

## Architecture in production

```
Users → CDN / static host (SPA)
           │
           └── /api/* → API host (Express)
                              │
                              └── Supabase
```

## 1. Supabase

1. Create or use existing Supabase project.
2. Run `supabase/migrations/000_combined.sql` in SQL Editor.
3. Copy **Project URL** and **service role key** (Settings → API).
4. Optional: upload images to `images` bucket; update `image_url` fields.

Verify:

```bash
pnpm verify:supabase
```

## 2. API server

**Package:** `artifacts/api-server`

### Environment

```env
PORT=8080
NODE_ENV=production
LOG_LEVEL=info
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGIN=https://www.divinechildrenhome.co.uk
```

### Build and start

```bash
pnpm --filter @workspace/api-server run build
node --env-file=.env --enable-source-maps artifacts/api-server/dist/index.mjs
```

Or deploy to Node hosts (Railway, Render, Fly.io, Azure App Service):

- Build command: `pnpm install && pnpm --filter @workspace/api-server run build`
- Start command: `node --enable-source-maps dist/index.mjs`
- Set env vars in host dashboard.

Health check: `GET /api/healthz`

## 3. Frontend (SPA)

**Package:** `artifacts/divine-children-home`

### Environment (build time)

```env
BASE_PATH=/
# If API on separate domain, configure fetch base URL in api client or reverse proxy
```

Vite build:

```bash
pnpm --filter @workspace/divine-children-home run build
```

Output: `artifacts/divine-children-home/dist/`

### Static hosting options

- **Vercel / Netlify / Cloudflare Pages** — upload `dist/`, SPA fallback to `index.html`
- **S3 + CloudFront** — sync `dist/`, configure error document → `index.html`

### API routing options

**Option A — Same origin (recommended)**  
Reverse proxy `/api` from web host to API service.

**Option B — Separate API subdomain**  
Point `api.divinechildrenhome.co.uk` to API; set CORS on API; update client base URL if not using proxy.

Dev proxy (`vite.config.ts`) does not apply in production.

## 4. DNS and SSL

- Point `www.divinechildrenhome.co.uk` to static host.
- Enable TLS (automatic on most platforms).
- Update `siteConfig.url` and `index.html` canonical if domain differs.

## 5. Post-deploy checks

- [ ] Homepage loads over HTTPS
- [ ] `/api/health` returns OK
- [ ] News, jobs, FAQs load from Supabase
- [ ] Contact form submits and row appears in Supabase
- [ ] `robots.txt` and `sitemap.xml` accessible
- [ ] Security headers present on API responses

## 6. CI/CD (suggested)

```yaml
# Example pipeline steps
- pnpm install
- pnpm run typecheck
- pnpm --filter @workspace/api-server run build
- pnpm --filter @workspace/divine-children-home run build
- deploy artifacts
```

## 7. Monitoring

- API: host logs + Pino JSON output
- Supabase: Dashboard → Logs, Database → usage
- Uptime: ping `/api/health` and homepage

## Rollback

- Frontend: redeploy previous `dist` artifact.
- API: redeploy previous container/build.
- Database: restore Supabase backup or revert migration manually.

## Local vs production

| Setting | Local | Production |
|---------|-------|------------|
| Frontend | `:23337` | HTTPS static host |
| API | `:8080` | HTTPS API host |
| CORS | Open | `CORS_ORIGIN` set |
| Supabase | Same project or staging | Production project recommended |

For staging, use a separate Supabase project and env files.
