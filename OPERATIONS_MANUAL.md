# Operations Manual — Divine Children Home Ltd

**Version:** 1.0.0  
**Audience:** DevOps, on-call engineers, system administrators

---

## System Components

| Component | Technology | Host |
|-----------|------------|------|
| Frontend | React SPA (Vite) | Vercel |
| API | Express 5 (Node 22) | Railway / Render |
| Database | PostgreSQL | Supabase |
| Storage | Object storage | Supabase Storage |
| Auth (admin) | Supabase Auth + JWT | Supabase |

---

## Daily Operations

### Health monitoring

1. Check uptime monitor for `/api/healthz`
2. Review API error logs (Railway/Render dashboard)
3. Check Supabase dashboard for connection issues

### Content updates

Content editors use `/admin/login` — no deployment required for CMS changes.

### Form submissions

View in Admin → Submissions. Referral submissions include reference numbers for LA correspondence.

---

## Commands Reference

```bash
# Development
pnpm dev:web          # Frontend :23337
pnpm dev:api          # API :8080

# Quality
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e

# Admin setup
pnpm --filter @workspace/scripts run create-admin
pnpm --filter @workspace/scripts run verify-supabase
```

---

## Environment Management

See `.env.example` for all variables.

**Critical production vars (API):**
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGIN` (required in production)
- `NODE_ENV=production`
- `TRUST_PROXY=true`

**Critical production vars (Frontend):**
- `VITE_API_BASE_URL` or Vercel rewrite to API

---

## Incident Response

### Severity 1 — Site down

1. Check Vercel status + Railway/Render status
2. Check Supabase status page
3. Review recent deployments — rollback if needed
4. Communicate to stakeholders

### Severity 2 — Forms not submitting

1. Check API logs for database errors
2. Verify Supabase connectivity
3. Test `/api/healthz`
4. Check rate limiting (429 responses)

### Severity 3 — Admin login failures

1. Verify API deployed with admin routes
2. Check `admin_profiles` table for user
3. Reset password via Supabase Auth dashboard
4. Review auth rate limit logs

---

## Maintenance Windows

Schedule during low-traffic periods (typically Sunday 02:00–04:00 UK):

- Database migrations
- Dependency updates
- SSL certificate renewals (automatic on Vercel/Railway)

---

## Scaling

| Load | Action |
|------|--------|
| Increased traffic | Vercel auto-scales; increase Railway instances |
| Database load | Supabase compute upgrade; add indexes |
| Storage growth | Monitor bucket sizes; archive old media |
| Rate limit hits | Review legitimate vs abusive traffic |

---

## Security Operations

- Rotate `SUPABASE_SERVICE_ROLE_KEY` quarterly
- Review admin user list monthly
- Audit `audit_logs` table for suspicious CMS changes
- Keep dependencies updated (`pnpm update` + CI)
- Never expose service role key to frontend

---

## Backup & Recovery

See `BACKUP_RECOVERY.md` for full procedures.

**Quick reference:**
- Database: Supabase daily backups + PITR
- Code: GitHub main branch
- Env vars: Platform secret stores

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `PRODUCTION_CHECKLIST.md` | Pre/post deploy checklist |
| `DEPLOYMENT_RUNBOOK.md` | Step-by-step deploy |
| `TESTING_GUIDE.md` | Test execution |
| `MONITORING_GUIDE.md` | Logs, analytics, alerts |
| `CI_CD_GUIDE.md` | Pipeline configuration |
| `BACKUP_RECOVERY.md` | Disaster recovery |
| `ADMIN_GUIDE.md` | CMS user guide |
| `SECURITY_GUIDE.md` | Security architecture |

---

## Support Escalation

| Level | Contact | Response time |
|-------|---------|---------------|
| L1 | Content admin | 4 business hours |
| L2 | Technical support | 2 business hours |
| L3 | On-call engineer | 1 hour (P1 incidents) |

Document actual contacts before go-live.
