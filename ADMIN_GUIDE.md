# Admin Guide

Enterprise admin dashboard for Divine Children Home Ltd at **`/admin`**.

## Access

1. Run migration `supabase/migrations/004_admin_cms.sql` in Supabase SQL Editor.
2. Create a user in **Supabase Auth → Users**.
3. Link the user to admin profiles:

```sql
INSERT INTO admin_profiles (id, email, full_name, role)
VALUES ('<auth-user-uuid>', 'admin@example.com', 'Super Admin', 'super_admin');
```

4. Set environment variables (see `.env.example`):
   - Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - API: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

5. Sign in at `http://localhost:23337/admin/login`

## Roles

| Role | Access |
|------|--------|
| **Super Admin** | Full access including user management |
| **Administrator** | Content, submissions, settings, audit (no user CRUD) |
| **Content Editor** | Content and media only |

Permissions are enforced in the API (`requirePermission`) and UI (`ProtectedRoute`, sidebar filtering).

## Dashboard

- KPI cards: referrals, applications, contacts, newsletter, news, gallery, testimonials
- 30-day activity chart (referrals, applications, contacts, subscribers)
- Recent referrals and audit activity
- Quick action links

## Modules

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/homepage` | Homepage sections (hero, stats, CTA) |
| `/admin/about` | About page sections |
| `/admin/homes` | Residential homes CRUD |
| `/admin/services` | Services CRUD |
| `/admin/news` | News/blog CMS |
| `/admin/gallery` | Gallery images |
| `/admin/testimonials` | Testimonials + approval |
| `/admin/faqs` | FAQs + ordering |
| `/admin/resources` | Downloadable documents |
| `/admin/careers` | Job listings |
| `/admin/referrals` | Referral workflow |
| `/admin/contacts` | Contact enquiries |
| `/admin/applications` | Job applications + CV download |
| `/admin/newsletter` | Subscribers + CSV export |
| `/admin/media` | Media library + upload |
| `/admin/seo` | SEO metadata per path |
| `/admin/settings` | Site settings (JSON key-value) |
| `/admin/users` | Admin user management |
| `/admin/audit` | Audit log viewer |

## Authentication features

- Email/password login via Supabase Auth
- Forgot password flow (`/admin/forgot-password`)
- Session auto-refresh (Supabase client)
- Remember me (persistent session in localStorage)
- Bearer JWT sent to `/api/admin/*` endpoints
- Sign out clears session

## Notifications

New contact, referral, and job application submissions create rows in `admin_notifications` and appear in the dashboard activity feed.

## Related docs

- [CMS_GUIDE.md](./CMS_GUIDE.md)
- [AUTH_GUIDE.md](./AUTH_GUIDE.md)
- [USER_MANAGEMENT.md](./USER_MANAGEMENT.md)
