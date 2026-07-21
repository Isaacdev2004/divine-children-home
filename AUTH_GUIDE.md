# Auth Guide

Authentication and authorization for the Divine Children Home admin CMS.

## Architecture

```
Browser (/admin)
  → Supabase Auth (email/password, JWT)
  → Authorization: Bearer <access_token>
  → API /api/admin/* 
      → verifyAccessToken() via SUPABASE_ANON_KEY
      → Load admin_profiles row
      → requirePermission(role, ...)
  → Service role writes to PostgreSQL
```

The **service role key never reaches the browser**. The frontend only uses the **anon key** for Supabase Auth.

## Supabase Auth setup

1. Enable **Email** provider in Supabase Dashboard → Authentication → Providers.
2. Configure **Site URL** and **Redirect URLs**:
   - Site URL: `http://localhost:23337` (dev) or production URL
   - Redirect: `http://localhost:23337/admin/reset-password`
3. Optional: disable public sign-ups (invite-only admins).

## Creating admin users

### Option A — Dashboard + SQL

1. Create user in Supabase Auth.
2. Insert profile:

```sql
INSERT INTO admin_profiles (id, email, full_name, role, is_active)
VALUES ('uuid-from-auth', 'user@company.com', 'Jane Smith', 'administrator', true);
```

### Option B — Admin invite (Super Admin)

`POST /api/admin/users/invite` with:

```json
{
  "email": "new@company.com",
  "fullName": "New User",
  "role": "content_editor",
  "password": "temporary-secure-password"
}
```

Requires `users.write` permission (super_admin only).

## Roles & permissions

Defined in `lib/supabase/src/permissions.ts` and mirrored in `src/admin/lib/permissions.ts`.

| Permission | Super Admin | Administrator | Content Editor |
|------------|:-----------:|:-------------:|:--------------:|
| dashboard.view | ✓ | ✓ | ✓ |
| content.read/write | ✓ | ✓ | ✓ |
| submissions.read/write | ✓ | ✓ | |
| settings.read/write | ✓ | ✓ | |
| users.read/write | ✓ | | |
| audit.read | ✓ | ✓ | |
| media.write | ✓ | ✓ | ✓ |

## Session management

- Frontend: `@supabase/supabase-js` with `persistSession: true`, `autoRefreshToken: true`
- Storage key: `dch-admin-auth`
- API validates token on every request; expired tokens return `401`

## Password reset

1. User visits `/admin/forgot-password`.
2. Supabase sends reset email.
3. User follows link → set new password (configure redirect URL).

## Row Level Security

Migration `004_admin_cms.sql` adds:

- `is_admin()` — checks active `admin_profiles` row for `auth.uid()`
- `admin_role()` — returns role enum
- Policies on CMS tables for authenticated admins
- Public read policies for published content

## Security checklist

- [ ] Disable public sign-up in Supabase if using invite-only
- [ ] Set strong passwords for all admin accounts
- [ ] Use HTTPS in production
- [ ] Set `CORS_ORIGIN` on API to frontend origin only
- [ ] Rotate service role key if compromised
- [ ] Review audit logs regularly

## Environment variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | Frontend | Auth client |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Auth client |
| `SUPABASE_URL` | API | Auth verification + DB |
| `SUPABASE_ANON_KEY` | API | JWT verification |
| `SUPABASE_SERVICE_ROLE_KEY` | API | Database writes |
