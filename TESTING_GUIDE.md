# Testing Guide — Divine Children Home Ltd

**Version:** 1.0.0

---

## Test Stack

| Layer | Tool | Location |
|-------|------|----------|
| API unit/integration | Vitest + Supertest | `artifacts/api-server/src/__tests__/` |
| Frontend unit/component | Vitest + React Testing Library | `artifacts/divine-children-home/src/__tests__/` |
| End-to-end | Playwright + axe-core | `e2e/tests/` |

---

## Running Tests

```bash
# All unit/integration tests
pnpm run test

# API only
pnpm --filter @workspace/api-server run test

# Frontend only
pnpm --filter @workspace/divine-children-home run test

# E2E (starts dev server automatically)
pnpm run test:e2e

# E2E against preview build (CI mode)
CI=true pnpm run test:e2e
```

---

## Test Coverage

### API (`8 tests`)

| File | Coverage |
|------|----------|
| `health.test.ts` | Health endpoint, 404 handler, security headers, request IDs |
| `upload-security.test.ts` | MIME validation, filename sanitization |

### Frontend (`4 tests`)

| File | Coverage |
|------|----------|
| `FormSuccessPanel.test.tsx` | Success UI, reference number display |
| `form-utils.test.ts` | Scroll-to-error behaviour |

### E2E (Playwright)

| Spec | Coverage |
|------|----------|
| `homepage.spec.ts` | Hero, CTA, skip link |
| `navigation.spec.ts` | Contact, referral, mobile menu |
| `contact.spec.ts` | Validation, phone links |
| `referral.spec.ts` | Form load, emergency phone |
| `accessibility.spec.ts` | axe WCAG scan, main landmark |
| `admin.spec.ts` | Admin login page load |

---

## Critical User Flows (manual QA)

1. **Referral flow** — LA officer submits referral → receives reference number
2. **Contact flow** — General enquiry → inline success panel
3. **Careers apply** — Job card → contact prefill via `?job=`
4. **Admin auth** — Login → dashboard → CMS edit → save
5. **News** — List → article detail
6. **Gallery** — Filter → lightbox

---

## Writing New Tests

### API example

```typescript
import request from "supertest";
import app from "../app";

it("returns 400 for invalid body", async () => {
  const res = await request(app).post("/api/forms/contact").send({});
  expect(res.status).toBe(400);
});
```

### Component example

```tsx
import { render, screen } from "@testing-library/react";
import { Router } from "wouter";

render(<Router><MyComponent /></Router>);
expect(screen.getByRole("button")).toBeInTheDocument();
```

### E2E example

```typescript
test("submits contact form", async ({ page }) => {
  await page.goto("/contact");
  await page.fill('[name="name"]', "Test User");
  // ...
});
```

---

## CI Integration

Tests run automatically on push/PR via `.github/workflows/ci.yml`:

1. Typecheck
2. Unit tests
3. Build
4. Playwright E2E (preview server)

---

## Accessibility Testing

- Automated: `@axe-core/playwright` in `accessibility.spec.ts`
- Manual: keyboard navigation, screen reader, 200% zoom
- Target: WCAG 2.2 AA

---

## Performance Testing

```bash
# Lighthouse (Chrome DevTools or CLI)
npx lighthouse https://www.divinechildrenhome.co.uk --view
```

Target: LCP < 2.5s, CLS < 0.1, INP < 200ms
