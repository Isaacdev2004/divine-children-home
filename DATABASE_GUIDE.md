# Database Guide

Divine Children Home uses **Supabase** (managed PostgreSQL + Storage). The API connects with the **service role** key server-side only.

## Migrations

| File | Purpose |
|------|---------|
| `supabase/migrations/001_initial_schema.sql` | Tables + RLS policies |
| `supabase/migrations/002_storage.sql` | `images` public bucket |
| `supabase/migrations/003_seed_data.sql` | Demo content |
| `supabase/migrations/000_combined.sql` | All-in-one for SQL Editor |

Apply via Supabase Dashboard → SQL Editor, or Supabase CLI.

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for step-by-step setup.

## Tables

### Content

| Table | Description |
|-------|-------------|
| `jobs` | Career listings (`is_active`, `posted_at`) |
| `news` | Articles (`slug` unique) |
| `faqs` | FAQ entries (`category`, `sort_order`) |
| `testimonials` | Quotes with rating |
| `gallery` | Image metadata |
| `site_stats` | Single row (`id = 1`) homepage metrics |

### Submissions

| Table | Description |
|-------|-------------|
| `contact_submissions` | Contact form |
| `referral_submissions` | Referral form |
| `career_applications` | Job applications |
| `newsletter_subscribers` | Email list (`email` unique) |

All submission tables include `reference_number` and `created_at`.

## Row Level Security

Public read policies allow anonymous `SELECT` on content tables. Inserts on submission tables are intended for the service role via API (no anon insert policies).

Review policies in migration SQL before production.

## Storage

- Bucket: `images` (public read)
- Helpers: `lib/supabase/src/storage.ts`
- `getPublicImageUrl(path)` builds public URLs
- `uploadImage(file, path)` for admin/upload flows

## Application layer

```
lib/supabase/src/
├── client.ts              getSupabase() — lazy singleton
├── mappers.ts             snake_case rows → camelCase DTOs
├── repositories/          One module per domain
└── errors.ts              DatabaseError + assertNoError
```

Routes must not call `supabase.from()` directly — use repositories.

### Example mapper flow

DB row `{ years_experience: 10 }` → API `{ yearsExperience: 10 }` via `mapSiteStats`.

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `SUPABASE_URL` | Yes | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server only; bypasses RLS |

## Verification

```bash
pnpm verify:supabase
```

Checks table access and `images` bucket existence.

## Backup and ops

- Enable Supabase daily backups on paid plans.
- Use Supabase dashboard for row inspection and manual fixes.
- For schema changes: new numbered migration + update `000_combined.sql`.

## Stats fallback

If `site_stats` row is missing, API returns hardcoded defaults from `content.repository.ts` (matches seed values).
