# Deployment Runbook — Divine Children Home Ltd

**Version:** 1.0.0  
**Architecture:** Vercel (frontend) + Railway/Render (API) + Supabase (DB/storage)

---

## Architecture Overview

```
Users → Vercel CDN (SPA) → /api/* proxy or VITE_API_BASE_URL
                              ↓
                         Railway/Render (Express API)
                              ↓
                         Supabase (Postgres + Storage + Auth)
```

---

## 1. Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Run migrations in SQL editor:
   - `supabase/migrations/000_combined.sql`
   - `supabase/migrations/004_admin_cms.sql`
3. Copy **Project URL** and **service role key** (Settings → API)
4. Enable daily backups (Pro plan recommended)
5. Configure storage buckets (created by migration)

---

## 2. API Deployment (Railway or Render)

### Environment variables

```env
NODE_ENV=production
PORT=8080
LOG_LEVEL=info
CORS_ORIGIN=https://www.divinechildrenhome.co.uk
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
TRUST_PROXY=true
ADMIN_RESET_PASSWORD_URL=https://www.divinechildrenhome.co.uk/admin/reset-password
```

### Railway

1. Connect GitHub repository
2. Set root directory to monorepo root
3. Use `railway.json` config or manual:
   - **Build:** `pnpm install && pnpm --filter @workspace/api-server run build`
   - **Start:** `node --enable-source-maps artifacts/api-server/dist/index.mjs`
4. Health check path: `/api/healthz`
5. Assign custom domain: `api.divinechildrenhome.co.uk`

### Render

1. New Web Service → Node
2. Build command: same as above
3. Start command: same as above
4. Add env vars from list above

### Verify API

```bash
curl https://api.divinechildrenhome.co.uk/api/healthz
# {"status":"ok"}
```

---

## 3. Frontend Deployment (Vercel)

1. Import GitHub repository
2. **Root directory:** `artifacts/divine-children-home`
3. **Framework:** Vite
4. **Build command:** `cd ../.. && pnpm install && pnpm --filter @workspace/divine-children-home run build`
5. **Output directory:** `dist/public`

### Environment variables (Vercel)

```env
VITE_API_BASE_URL=https://api.divinechildrenhome.co.uk
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=xxxxxxxx
```

6. Configure custom domain: `www.divinechildrenhome.co.uk`
7. Enable automatic HTTPS

### API routing options

**Option A:** Set `VITE_API_BASE_URL` — frontend calls API directly (CORS must allow origin)

**Option B:** Vercel rewrite in `vercel.json` (included) — proxies `/api/*` to API host

---

## 4. Create Admin User

From local machine with API `.env` configured:

```bash
pnpm --filter @workspace/scripts run create-admin
```

Change default password immediately after first login.

---

## 5. DNS Configuration

| Record | Type | Value |
|--------|------|-------|
| www | CNAME | cname.vercel-dns.com |
| api | CNAME | Railway/Render hostname |
| @ | A/ALIAS | Vercel |

---

## 6. Staging Environment

Duplicate production setup with:

- `staging.divinechildrenhome.co.uk` (Vercel preview or branch deploy)
- `api-staging.divinechildrenhome.co.uk` (separate Railway service)
- Separate Supabase project or staging schema

Update `CORS_ORIGIN` on staging API accordingly.

---

## 7. Smoke Test After Deploy

```bash
# Health
curl -I https://api.divinechildrenhome.co.uk/api/healthz

# Frontend
curl -I https://www.divinechildrenhome.co.uk

# Security headers
curl -I https://api.divinechildrenhome.co.uk/api/healthz | grep -i x-frame
```

Manual: submit contact form, referral form, admin login.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API 502 on startup | Check env validation errors in logs |
| CORS errors | Verify `CORS_ORIGIN` matches frontend URL exactly |
| Admin 404 on login | Rebuild and redeploy API |
| Empty CMS data | Run migrations; seed via admin panel |

---

## Emergency Contacts

Document internal on-call contacts and Supabase/Vercel/Railway support channels here before go-live.
