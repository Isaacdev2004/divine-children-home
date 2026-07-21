# Storage Guide

Supabase Storage configuration for Divine Children Home.

## Buckets

| Bucket | Public | Max size | Use |
|--------|--------|----------|-----|
| `images` | Yes | 10 MB | Legacy site images |
| `media` | Yes | 10 MB | CMS media library |
| `documents` | Yes | 20 MB | Resources, policies, PDFs |
| `cvs` | No | 10 MB | Job application CVs |
| `attachments` | No | 20 MB | Referral attachments |

Created in `002_storage.sql` and extended in `004_admin_cms.sql`.

## Allowed MIME types

- **Images**: jpeg, png, webp, gif, svg+xml
- **Documents**: pdf, doc, docx
- **CVs**: pdf, doc, docx

## Upload flow

1. Admin selects file in Media Library or form.
2. `POST /api/admin/upload` (multipart `file`, optional `bucket`, `folder`).
3. API uses service role → `uploadFile()` in `lib/supabase/src/storage.ts`.
4. Record inserted in `media_files` table.
5. Response includes `publicUrl` for public buckets.

## Public URLs

```
https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
```

Helper: `getPublicStorageUrl(bucket, path)`.

## Private files (CVs, attachments)

Use signed URLs:

```typescript
getSignedUrl('cvs', path, 3600) // 1 hour
```

Admin API: `GET /api/admin/submissions/applications/:id/cv` returns `{ url }`.

## RLS policies

- Public read: `images`, `media`, `documents`
- Admin upload/manage: all buckets when `is_admin()` is true

## Code references

| File | Purpose |
|------|---------|
| `lib/supabase/src/storage.ts` | Upload, delete, signed URLs |
| `artifacts/api-server/src/routes/admin/upload.ts` | HTTP upload endpoint |
| `supabase/migrations/004_admin_cms.sql` | Bucket + policy definitions |

## Production tips

- Use descriptive folder names (`news/`, `gallery/`, `branding/`)
- Set `alt_text` on media records for accessibility
- Prefer WebP for photos (browser + bucket support)
- Monitor bucket size in Supabase dashboard
