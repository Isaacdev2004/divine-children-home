# Supabase Setup — Divine Children Home Ltd

Complete guide for configuring Supabase as the project's database and image storage backend. **No Docker or local PostgreSQL is required.**

---

## Project Details

| Setting | Value |
|---------|-------|
| **Supabase URL** | `https://xfxhgicqxtaqavxyytqm.supabase.co` |
| **Project ref** | `xfxhgicqxtaqavxyytqm` |
| **Storage bucket** | `images` (public read) |

---

## 1. Prerequisites

- Node.js 24+ and pnpm (already configured in this repo)
- A Supabase account with access to the project above
- **Service role key** from Supabase Dashboard (server-side only — never commit or expose to the frontend)

---

## 2. Get Your Supabase Keys

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/xfxhgicqxtaqavxyytqm)
2. Go to **Project Settings → API**
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (under Project API keys) → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ The `service_role` key bypasses Row Level Security. Use it **only** in the API server (backend). Never add it to the React frontend or commit it to git.

---

## 3. Configure Environment Variables

### API Server — `artifacts/api-server/.env`

```env
PORT=8080
NODE_ENV=development
LOG_LEVEL=info
SUPABASE_URL=https://xfxhgicqxtaqavxyytqm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Frontend — `artifacts/divine-children-home/.env`

```env
PORT=23337
BASE_PATH=/
VITE_API_PROXY_TARGET=http://localhost:8080
```

The frontend does **not** need Supabase keys. All data access goes through the Express API.

---

## 4. Run Database Migrations

Migration SQL files live in `supabase/migrations/`:

| File | Purpose |
|------|---------|
| `001_initial_schema.sql` | All tables, indexes, RLS policies |
| `002_storage.sql` | Public `images` storage bucket |
| `003_seed_data.sql` | Default stats + sample FAQ/testimonial |

### Option A — Supabase SQL Editor (recommended)

1. Open **SQL Editor** in the Supabase Dashboard
2. Run **`supabase/migrations/000_combined.sql`** (all migrations in one file)
   - Or run `001_initial_schema.sql` → `002_storage.sql` → `003_seed_data.sql` individually
3. Confirm no errors in the output panel

### Option B — Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref xfxhgicqxtaqavxyytqm
supabase db push
```

---

## 5. Database Schema

### Content Tables

| Table | API Endpoint | Description |
|-------|--------------|-------------|
| `jobs` | `GET /api/jobs` | Active job listings |
| `news` | `GET /api/news` | News articles |
| `faqs` | `GET /api/faqs` | FAQ entries |
| `testimonials` | `GET /api/testimonials` | Testimonials |
| `gallery` | `GET /api/gallery` | Gallery images |
| `site_stats` | `GET /api/stats` | Homepage statistics (singleton row, `id = 1`) |

### Form Submission Tables

| Table | API Endpoint | Reference Prefix |
|-------|--------------|------------------|
| `contact_submissions` | `POST /api/forms/contact` | `CNT-` |
| `referral_submissions` | `POST /api/forms/referral` | `REF-` |
| `career_applications` | `POST /api/forms/career` | `APP-` |
| `newsletter_subscribers` | `POST /api/forms/newsletter` | — |

All form tables are **write-only via the API** (service role key). No public RLS policies.

---

## 6. Supabase Storage (Images)

### Bucket: `images`

- **Public read** enabled
- **Max file size:** 10 MB
- **Allowed types:** JPEG, PNG, WebP, GIF, SVG

### Public URL format

```
https://xfxhgicqxtaqavxyytqm.supabase.co/storage/v1/object/public/images/{path}
```

### Usage in database records

Store the full public URL in `image_url` columns (`news`, `gallery`, `testimonials.avatar_url`):

```
https://xfxhgicqxtaqavxyytqm.supabase.co/storage/v1/object/public/images/gallery/home-exterior.jpg
```

### Uploading images

**Via Supabase Dashboard:**
1. Go to **Storage → images**
2. Upload files to folders: `gallery/`, `news/`, `testimonials/`

**Via API (programmatic):**

The backend exposes helpers in `@workspace/supabase`:

```typescript
import { uploadImage, getPublicImageUrl } from "@workspace/supabase";

const { publicUrl } = await uploadImage(
  "gallery/home-exterior.jpg",
  fileBuffer,
  "image/jpeg",
);
```

---

## 7. Architecture

```
Browser
  └── React SPA (:23337)
        └── fetch /api/*
              └── Express API (:8080)
                    └── @supabase/supabase-js (service role)
                          ├── PostgreSQL tables
                          └── Storage bucket (images)
```

### Code locations

| Component | Path |
|-----------|------|
| Supabase client | `lib/supabase/src/client.ts` |
| Database types | `lib/supabase/src/database.types.ts` |
| Row mappers (snake_case → camelCase) | `lib/supabase/src/mappers.ts` |
| Storage helpers | `lib/supabase/src/storage.ts` |
| API routes | `artifacts/api-server/src/routes/` |
| SQL migrations | `supabase/migrations/` |

---

## 8. Row Level Security (RLS)

Public read policies are enabled for content tables:

- `jobs` — only `is_active = true`
- `news`, `faqs`, `testimonials`, `gallery`, `site_stats` — all rows

Form submission tables have **no public policies**. The API server uses the `service_role` key which bypasses RLS for inserts.

---

## 9. Run Locally (No Docker)

Open **two terminals** from the repo root:

```powershell
# Terminal 1 — API
pnpm dev:api

# Terminal 2 — Frontend
pnpm dev:web
```

| Service | URL |
|---------|-----|
| Website | http://localhost:23337/ |
| API | http://localhost:8080/api |
| Health check | http://localhost:23337/api/healthz |

---

## 10. Verify Endpoints

After migrations and env setup:

```powershell
curl.exe -s http://localhost:8080/api/healthz
curl.exe -s http://localhost:8080/api/stats
curl.exe -s http://localhost:8080/api/faqs
curl.exe -s http://localhost:8080/api/jobs
curl.exe -s http://localhost:8080/api/news
curl.exe -s http://localhost:8080/api/gallery
curl.exe -s http://localhost:8080/api/testimonials
```

Expected: JSON responses (empty arrays `[]` if no content seeded beyond defaults).

### Test form submission

```powershell
curl.exe -s -X POST http://localhost:8080/api/forms/contact `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"07123456789\",\"subject\":\"Test\",\"message\":\"Hello from local setup\"}"
```

Expected: `201` with `referenceNumber` starting with `CNT-`.

---

## 11. Managing Content

Content is managed directly in Supabase (no admin panel yet):

| Content | Where to edit |
|---------|---------------|
| Jobs | Table Editor → `jobs` |
| News | Table Editor → `news` |
| FAQs | Table Editor → `faqs` |
| Testimonials | Table Editor → `testimonials` |
| Gallery | Table Editor → `gallery` + Storage → `images` |
| Homepage stats | Table Editor → `site_stats` (row `id = 1`) |
| Form submissions | Table Editor → `contact_submissions`, etc. |

---

## 12. What Was Removed

The following are **no longer required**:

- Docker / Docker Desktop
- Docker Compose
- Local PostgreSQL installation
- `DATABASE_URL` environment variable
- Drizzle ORM / `lib/db` package
- `pnpm db:push` command
- `pnpm verify:supabase` — verify Supabase tables and storage after setup

---

## 13. Troubleshooting

### `SUPABASE_SERVICE_ROLE_KEY must be set`

Add the service role key to `artifacts/api-server/.env` and restart the API.

### `relation "jobs" does not exist`

Run the SQL migrations in order (Section 4).

### API returns 500 on content routes

1. Confirm migrations ran successfully
2. Check API logs for Supabase error messages
3. Verify `SUPABASE_URL` matches your project

### Empty arrays on content endpoints

Normal if no content added yet. Run `003_seed_data.sql` for default stats/FAQ/testimonial, or add rows via Table Editor.

### Images not loading

1. Confirm files exist in Storage → `images` bucket
2. Ensure `image_url` in database uses the full public URL
3. Verify bucket is set to **public**

---

## 14. Production Checklist

- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` in production API environment (secrets manager)
- [ ] Run all migrations on production Supabase project
- [ ] Upload production images to Storage bucket
- [ ] Populate content tables (jobs, news, gallery, etc.)
- [ ] Update `site_stats` row with real figures
- [ ] Restrict CORS on API to production domain
- [ ] Never expose service role key to client-side code
- [ ] Enable Supabase database backups (enabled by default on paid plans)

---

*Last updated: Supabase migration from local PostgreSQL/Docker.*
