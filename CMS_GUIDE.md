# CMS Guide

Content management architecture for Divine Children Home Ltd.

## Data model

### Page sections (`page_sections`)

JSON content blocks keyed by `page_key` + `section_key`:

- **homepage**: `hero`, `stats`, `cta`
- **about**: `story`, `mission`, `vision`, `values`

Edit via **Admin → Homepage / About**. Content is stored as JSONB and served publicly when `is_active = true`.

### Structured content tables

| Table | Admin route | Public API |
|-------|-------------|------------|
| `news` | `/admin/news` | `GET /api/news` |
| `jobs` | `/admin/careers` | `GET /api/jobs` |
| `faqs` | `/admin/faqs` | `GET /api/faqs` |
| `gallery` | `/admin/gallery` | `GET /api/gallery` |
| `testimonials` | `/admin/testimonials` | `GET /api/testimonials` |
| `homes` | `/admin/homes` | (extend public API as needed) |
| `services` | `/admin/services` | (extend public API as needed) |
| `resources` | `/admin/resources` | (extend public API as needed) |
| `site_stats` | Dashboard / stats API | `GET /api/stats` |

### News workflow

Fields: `status` (draft | published | scheduled | archived), `scheduled_at`, `tags`, `seo_title`, `seo_description`, `is_featured`.

Public site only shows `status = published` and `scheduled_at <= now()`.

### Testimonials workflow

- `is_approved` — must be true for public display
- `is_featured` — highlight on homepage
- `sort_order` — display ordering

## Admin API

All CMS writes go through **`/api/admin/*`** with JWT auth:

```
GET    /api/admin/news
POST   /api/admin/news
PATCH  /api/admin/news/:id
DELETE /api/admin/news/:id
```

Same pattern for jobs, faqs, gallery, testimonials, homes, services, resources.

Page sections:

```
GET /api/admin/page-sections?pageKey=homepage
PUT /api/admin/page-sections
```

Site settings:

```
GET /api/admin/settings
PUT /api/admin/settings/:key
```

## Media

Upload via **Admin → Media Library** or `POST /api/admin/upload` (multipart):

- Buckets: `images`, `media`, `documents`, `cvs`, `attachments`
- Records stored in `media_files` table
- Public URLs for `images`, `media`, `documents`

Use returned `publicUrl` in news, gallery, and resource fields.

## SEO manager

Table `seo_metadata` — one row per path (`/`, `/about`, etc.).

Fields: title, description, canonical_url, og_image_url, twitter_card, robots, structured_data.

## Redirects

Table `url_redirects` — manage via admin API `/api/admin/redirects`.

## Audit trail

All create/update/delete/upload actions write to `audit_logs` via the API `audit()` helper.

## Extending the CMS

1. Add migration for new table/columns.
2. Add repository functions in `lib/supabase/src/repositories/admin/cms.repository.ts`.
3. Add routes in `artifacts/api-server/src/routes/admin/cms.ts`.
4. Add admin page in `artifacts/divine-children-home/src/admin/pages/`.
5. Register route in `src/admin/AdminApp.tsx`.
6. Optionally extend public OpenAPI + frontend hooks.
