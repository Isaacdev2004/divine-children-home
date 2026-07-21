# User Management

Managing admin users for Divine Children Home Ltd.

## User model

Admin users are **Supabase Auth users** linked to **`admin_profiles`**:

| Column | Description |
|--------|-------------|
| `id` | UUID (matches `auth.users.id`) |
| `email` | Login email |
| `full_name` | Display name |
| `role` | `super_admin`, `administrator`, `content_editor` |
| `is_active` | Suspend without deleting auth user |
| `last_login_at` | Updated on each API request |

## Roles

### Super Admin
- Full system access
- Invite and manage users
- Modify roles and suspend accounts

### Administrator
- Manage content and submissions
- Site settings and SEO
- View audit logs
- Cannot manage other admin users

### Content Editor
- Create and edit website content
- Upload media
- View dashboard
- No access to submissions or settings

## Inviting users (API)

Super Admins can invite via admin UI (**Users**) or API:

```http
POST /api/admin/users/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "editor@divinechildrenhome.co.uk",
  "fullName": "Content Editor",
  "role": "content_editor",
  "password": "ChangeMeOnFirstLogin!"
}
```

This creates the Auth user and `admin_profiles` row.

## Updating users

```http
PATCH /api/admin/users/:id
{
  "fullName": "Updated Name",
  "role": "administrator",
  "isActive": false
}
```

Setting `isActive: false` blocks API access even if Auth user exists.

## Suspending users

Prefer `is_active = false` over deleting Auth users to preserve audit trail attribution.

## Password reset

Admins use `/admin/forgot-password` or Super Admin can trigger Supabase Auth password reset from dashboard.

## Activity history

- `last_login_at` on profile
- Full actions in `audit_logs` (user_email, action, entity_type, timestamp)

View at **Admin → Audit Logs**.

## First-time setup

After running `004_admin_cms.sql`:

```sql
-- Replace with your Auth user UUID after creating user in Supabase Dashboard
INSERT INTO admin_profiles (id, email, full_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'superadmin@divinechildrenhome.co.uk',
  'Super Admin',
  'super_admin'
);
```

## Security recommendations

- Minimum one Super Admin at all times
- Use unique emails per staff member
- Remove or suspend accounts when staff leave
- Never share Super Admin credentials
- Review user list quarterly

See [AUTH_GUIDE.md](./AUTH_GUIDE.md) for authentication details.
