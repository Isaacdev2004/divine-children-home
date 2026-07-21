# CI/CD Guide — Divine Children Home Ltd

**Version:** 1.0.0

---

## Pipeline Overview

GitHub Actions workflow: `.github/workflows/ci.yml`

```
Push/PR → Install → Typecheck → Test → Build → E2E
```

---

## Jobs

### 1. Quality (`quality`)

| Step | Command | Purpose |
|------|---------|---------|
| Install | `pnpm install --frozen-lockfile` | Reproducible deps |
| Typecheck | `pnpm run typecheck` | TypeScript validation |
| Test | `pnpm run test` | Vitest unit/integration |
| Build | `pnpm run build` | Production build (web + API) |

### 2. E2E (`e2e`)

| Step | Command | Purpose |
|------|---------|---------|
| Build frontend | `pnpm --filter @workspace/divine-children-home run build` | Static assets |
| Install browsers | `playwright install chromium` | Test runner |
| E2E | `pnpm run test:e2e` | Playwright specs |

E2E uses Vite preview server on port 4173 in CI.

---

## Branch Strategy

| Branch | CI | Deploy |
|--------|-----|--------|
| `main` | Full pipeline | Production (manual or auto) |
| PR branches | Full pipeline | Vercel preview (optional) |
| Feature branches | Full pipeline | None |

---

## Deployment Automation (recommended setup)

### Vercel (Frontend)

1. Connect GitHub repo
2. Production branch: `main`
3. Auto-deploy on merge to `main`
4. Preview deployments on PRs

### Railway/Render (API)

1. Connect GitHub repo
2. Auto-deploy on merge to `main`
3. Run health check after deploy

### Optional: GitHub Actions deploy job

Add to workflow after quality passes:

```yaml
deploy:
  needs: [quality, e2e]
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - run: echo "Trigger Vercel/Railway deploy via their GitHub integration"
```

Prefer platform-native GitHub integrations over custom deploy scripts.

---

## Local CI Simulation

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run test
pnpm run build
CI=true pnpm run test:e2e
```

---

## Secrets (GitHub)

Do **not** store production secrets in GitHub Actions unless deploying from CI.

If needed for deploy automation:

| Secret | Purpose |
|--------|---------|
| `VERCEL_TOKEN` | Vercel CLI deploy |
| `RAILWAY_TOKEN` | Railway CLI deploy |
| `SUPABASE_ACCESS_TOKEN` | Migration automation |

Use environment-specific GitHub Environments with protection rules for production.

---

## Supply Chain Security

- `pnpm-workspace.yaml` enforces `minimumReleaseAge: 1440` (24h)
- Lockfile committed (`pnpm-lock.yaml`)
- CI uses `--frozen-lockfile`

---

## Troubleshooting CI

| Failure | Fix |
|---------|-----|
| Typecheck | Fix TS errors locally |
| Unit tests | Run `pnpm run test` locally |
| Build | Run `pnpm run build` locally |
| E2E timeout | Increase `webServer.timeout` in playwright.config.ts |
| Playwright browser missing | Ensure `playwright install` step runs |

---

## Release Process

1. Merge PR to `main`
2. CI passes (green)
3. Tag release: `git tag v1.0.0 && git push origin v1.0.0`
4. Deploy frontend + API (auto or manual)
5. Run production checklist (`PRODUCTION_CHECKLIST.md`)
6. Publish release notes (`RELEASE_NOTES_v1.md`)
