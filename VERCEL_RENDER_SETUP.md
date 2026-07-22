# Vercel + Render Deployment Guide

Deploy the **frontend** to Vercel and the **API** to Render. Supabase stays on [supabase.com](https://supabase.com).

---

## Before you start

1. Push this repo to GitHub (`Isaacdev2004/divine-children-home`).
2. Create a Supabase project and run migrations:
   - `supabase/migrations/000_combined.sql`
   - `supabase/migrations/004_admin_cms.sql`
3. Note your Supabase **Project URL** and **service role key** (Settings → API).

---

## Step 1 — Deploy API on Render

1. Go to [render.com](https://render.com) → **New** → **Blueprint**.
2. Connect GitHub repo `divine-children-home`.
3. Render reads `render.yaml` and creates **divine-children-home-api**.
4. When prompted, set these **secret** env vars:

| Variable | Example |
|----------|---------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` |
| `CORS_ORIGIN` | `https://divine-children-home-divine-childre.vercel.app,https://*.vercel.app` |

`ADMIN_RESET_PASSWORD_URL` is **optional** at first deploy — leave it blank or delete it in Render. Add it later once Vercel is live, e.g. `https://your-app.vercel.app/admin/reset-password` (must start with `https://`).

5. Wait for deploy, then verify:

```bash
curl https://YOUR-SERVICE.onrender.com/api/healthz
# {"status":"ok"}
```

Copy the Render URL (e.g. `https://divine-children-home-api.onrender.com`).

---

## Step 2 — Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import GitHub repo `divine-children-home`.
3. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `artifacts/divine-children-home` |
| **Framework Preset** | Vite (auto-detected from `vercel.json`) |

4. Add **Environment Variables** (Production):

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://YOUR-SERVICE.onrender.com` (no trailing slash) |

Optional analytics (after cookie consent):

| Variable | Value |
|----------|-------|
| `VITE_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` |
| `VITE_CLARITY_PROJECT_ID` | `xxxxxxxx` |

5. Click **Deploy**.

6. Copy your Vercel URL (e.g. `https://divine-children-home.vercel.app`).

---

## Step 3 — Link frontend and API

Back in **Render** → your API service → **Environment**:

Update `CORS_ORIGIN` to include **both** URLs (comma-separated, no spaces after commas):

```
https://divine-children-home-divine-childre.vercel.app,https://*.vercel.app,https://www.divinechildrenhome.co.uk
```

The `https://*.vercel.app` entry covers future Vercel preview deployments.

Update `ADMIN_RESET_PASSWORD_URL` to your live frontend URL + `/admin/reset-password`.

Redeploy the API after saving env vars.

---

## Step 4 — Create admin user

On your machine, with Supabase credentials in `artifacts/api-server/.env`:

```powershell
cd Divine-Children-Home
pnpm --filter @workspace/scripts run create-admin
```

Default (change immediately after first login):

- Email: `admin@divine-children-home.com`
- Password: `Admin@123!`

Test: `https://YOUR-VERCEL-URL/admin/login`

---

## Step 5 — Custom domains (optional)

### Vercel (frontend)

1. Project → **Settings** → **Domains**
2. Add `www.divinechildrenhome.co.uk`
3. Add DNS CNAME as shown by Vercel

### Render (API)

1. Service → **Settings** → **Custom Domains**
2. Add `api.divinechildrenhome.co.uk`
3. Add DNS CNAME to Render

Then update:

- Vercel `VITE_API_BASE_URL` → `https://api.divinechildrenhome.co.uk`
- Render `CORS_ORIGIN` → `https://www.divinechildrenhome.co.uk`
- Render `ADMIN_RESET_PASSWORD_URL` → `https://www.divinechildrenhome.co.uk/admin/reset-password`

Redeploy both services.

---

## Smoke test

```bash
curl https://api.divinechildrenhome.co.uk/api/healthz
curl -I https://www.divinechildrenhome.co.uk
```

Manual checks:

- [ ] Homepage loads with stats/news
- [ ] Contact form submits
- [ ] Referral form loads
- [ ] Admin login works

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error in browser | `CORS_ORIGIN` must exactly match the Vercel URL (including `https://`, no trailing slash) |
| API 502 on Render | Check Render logs — usually missing `SUPABASE_*` env vars |
| Empty homepage data | API not reachable — check `VITE_API_BASE_URL` on Vercel |
| Admin login fails | Run `create-admin` script; confirm API is deployed with admin routes |
| Render cold start (~30s) | Upgrade from free to **Starter** plan (already set in `render.yaml`) |

---

## CI vs deploy

GitHub Actions CI does **not** block Vercel or Render deploys unless you enable branch protection. Both platforms deploy automatically on push to `main`.
