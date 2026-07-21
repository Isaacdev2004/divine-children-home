# Backup & Recovery — Divine Children Home Ltd

**Version:** 1.0.0

---

## Backup Strategy

### 1. Database (Supabase Postgres)

| Item | Method | Frequency |
|------|--------|-----------|
| Full backup | Supabase automated backups | Daily (Pro plan) |
| Point-in-time recovery | Supabase PITR | Continuous (Pro plan) |
| Schema | Git migrations in `supabase/migrations/` | Every release |
| Manual export | Supabase Dashboard → Database → Backups | Before major releases |

**Recovery steps:**
1. Supabase Dashboard → Database → Backups → Restore
2. Or restore to new project and update `SUPABASE_URL` in API env
3. Re-run any pending migrations if restoring to empty project

### 2. Storage (Supabase Storage)

| Bucket | Contents |
|--------|----------|
| `images` | CMS images, gallery |
| `media` | General uploads |
| `documents` | Policy PDFs |
| `cvs` | Career applications |
| `attachments` | Form attachments |

**Backup:** Enable Supabase storage replication or periodic export via `supabase storage` CLI.

**Recovery:** Re-upload from backup archive; update `media_files` table URLs if paths change.

### 3. Environment Variables

| Store | Contents |
|-------|----------|
| Railway/Render | API secrets |
| Vercel | Frontend public env vars |
| Password manager | Service role key backup (encrypted) |
| `.env.example` | Template (no secrets) in Git |

**Never commit:** `SUPABASE_SERVICE_ROLE_KEY`, admin passwords, API keys.

### 4. Application Code

| Item | Method |
|------|--------|
| Source code | GitHub (main branch) |
| Deployments | Vercel/Railway deployment history |
| Release tags | Git tags `v1.0.0`, etc. |

---

## Recovery Procedures

### Scenario A: Database corruption

1. Stop API writes (scale API to 0 or enable maintenance mode)
2. Restore Supabase backup to point before corruption
3. Verify data integrity with admin dashboard
4. Resume API service
5. Document incident

**RTO target:** 4 hours  
**RPO target:** 24 hours (daily backup) / minutes (PITR)

### Scenario B: Accidental CMS deletion

1. Check Supabase audit logs / admin audit table
2. Restore from PITR to temporary project
3. Export deleted records
4. Re-import to production

### Scenario C: API deployment failure

1. Rollback Railway/Render to previous deployment
2. Verify `/api/healthz`
3. Check structured logs for root cause

### Scenario D: Frontend deployment failure

1. Vercel → Deployments → Promote previous deployment
2. Verify homepage and forms
3. Clear CDN cache if needed

### Scenario E: Storage bucket loss

1. Restore files from offline backup
2. Re-run `media_files` URL updates if bucket name changed
3. Verify public pages render images

---

## Disaster Recovery Checklist

- [ ] Supabase project documented (ID, region)
- [ ] Service role key stored in secure vault
- [ ] Backup restore tested on staging (quarterly)
- [ ] Runbook contacts updated
- [ ] DNS TTL set appropriately for failover (300–3600s)

---

## Migration Safety

All schema changes via versioned SQL in `supabase/migrations/`:

1. Test migration on staging Supabase project
2. Backup production before applying
3. Apply during low-traffic window
4. Verify RLS policies post-migration

---

## Contact

Document internal escalation path and Supabase support tier here before go-live.
