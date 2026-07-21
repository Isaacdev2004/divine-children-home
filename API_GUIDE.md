# API Guide

REST API served by `@workspace/api-server` under the `/api` prefix.

**Base URL (local):** `http://localhost:8080/api`  
**Contract:** `lib/api-spec/openapi.yaml`  
**Validation:** `@workspace/api-zod` (generated from OpenAPI)

## Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthz` | Liveness check |

## Content (read-only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/jobs` | Active job listings |
| GET | `/jobs/:id` | Single job by ID |
| GET | `/news` | News articles (newest first) |
| GET | `/news/:slug` | Single article by slug |
| GET | `/faqs` | FAQs grouped by category |
| GET | `/gallery` | Gallery images |
| GET | `/testimonials` | Testimonials |
| GET | `/stats` | Site statistics (defaults if row missing) |

## Forms (write)

| Method | Path | Rate limit | Description |
|--------|------|------------|-------------|
| POST | `/forms/contact` | 20 / 15 min | Contact enquiry |
| POST | `/forms/referral` | 20 / 15 min | Placement referral |
| POST | `/forms/career` | 20 / 15 min | Job application |
| POST | `/forms/newsletter` | 20 / 15 min | Newsletter signup |

Successful form responses return `{ success, message, referenceNumber }`. Newsletter duplicate emails still return success.

## Error format

```json
{ "error": "Human-readable message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Validation failed (Zod) |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server or database error |

## Middleware stack

Applied in order:

1. Pino HTTP logging
2. Security headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.)
3. CORS (configurable via `CORS_ORIGIN`)
4. JSON body parser (1 MB limit)
5. Global rate limit (200 req / 15 min)
6. Route handlers
7. 404 handler
8. Central error handler

Form routes apply an additional limiter (20 req / 15 min).

## Route implementation pattern

```typescript
router.get("/resource", asyncHandler(async (_req, res) => {
  const data = await listResource();
  res.json(ListResourceResponse.parse(data));
}));

router.post("/forms/example", asyncHandler(async (req, res) => {
  const body = parseBody(SubmitExampleBody, req.body);
  await insertExample(body, createReferenceNumber("EX"));
  res.status(201).json(/* … */);
}));
```

- Use `asyncHandler` so errors reach the global handler.
- Throw `ApiError(status, message)` for expected failures.
- Repository functions throw `DatabaseError` on Supabase failures.

## Frontend integration

Generated hooks live in `@workspace/api-client-react`. Example:

```typescript
import { useListNews } from "@workspace/api-client-react";

const { data, isLoading, error } = useListNews();
```

In development, Vite proxies `/api` to `VITE_API_PROXY_TARGET` (default `http://localhost:8080`).

## Changing the API

1. Update `lib/api-spec/openapi.yaml`.
2. Regenerate `@workspace/api-zod` and `@workspace/api-client-react`.
3. Update repository + route implementations.
4. Run `pnpm run typecheck`.

## Security notes

- Service role key is **never** exposed to the browser.
- All write endpoints validate body shape with Zod before insert.
- Rate limiting protects form endpoints from abuse.
- See [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for production checklist.
