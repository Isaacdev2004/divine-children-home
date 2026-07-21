# Component Guide

Frontend package: `artifacts/divine-children-home`.

## Stack

- React 19 + TypeScript
- Wouter (routing)
- TanStack Query (server state via generated hooks)
- Tailwind CSS + shadcn/ui (Radix primitives)
- Framer Motion (page animations)

## Directory map

| Path | Purpose |
|------|---------|
| `src/app/routes.tsx` | Lazy-loaded route table |
| `src/components/layout/` | Header, footer, page shell |
| `src/components/common/` | Skip link, page loader |
| `src/components/ui/` | shadcn primitives (Button, Card, …) |
| `src/pages/` | Route-level page components |
| `src/config/site.ts` | Site name, URLs, contact info |
| `src/hooks/usePageMeta.ts` | Document title + meta tags |

## Layout

`Layout` wraps every page:

- `SkipLink` — keyboard-accessible skip to `#main-content`
- `Header` — sticky nav, mobile menu, referral CTA
- `main#main-content` — page content
- `Footer` — links and legal

Global UI outside layout: cookie consent, back-to-top, toast provider.

## Pages

Each file in `src/pages/` is a default export used by `AppRoutes`. Pages should:

1. Call `usePageMeta(title, description?)` on mount.
2. Use generated API hooks for dynamic data.
3. Show loading skeletons and empty states where data is fetched.
4. Use semantic HTML (`section`, `h1`, `nav`, etc.).

## shadcn/ui

Components under `src/components/ui/` follow shadcn conventions. Many are available for future use; pages import only what they need. Do not delete unused UI files without verifying no dynamic imports reference them.

Common imports:

- `Button`, `Card`, `Input`, `Textarea`, `Select`
- `Skeleton` for loading states
- `Toaster` / `useToast` for feedback

## API data hooks

Import from `@workspace/api-client-react`:

```typescript
import { useListFaqs, useSubmitContactForm } from "@workspace/api-client-react";
```

Hooks use React Query with 5-minute stale time (configured in `App.tsx`).

## SEO

- Default meta in `index.html` (Organization JSON-LD, OpenGraph, Twitter).
- Per-page updates via `usePageMeta`.
- Static `public/sitemap.xml` and `public/robots.txt`.

## Accessibility

- Skip link to main content
- Header: `aria-label`, mobile menu `aria-expanded` / `aria-controls`
- Focus styles on interactive elements (Tailwind `focus:` utilities)
- Prefer native form controls with labels

## Performance

- Routes are lazy-loaded with `React.lazy` + `Suspense`.
- Hero and content images live under `attached_assets/` (Vite alias `@assets`).
- Query client disables refetch-on-window-focus to reduce noise.

## Adding a component

1. Place reusable UI in `src/components/` (not in `pages/`).
2. Keep props typed with an interface.
3. Co-locate only when tightly coupled to one page.
4. Match existing Tailwind spacing and color tokens (`primary`, `accent`, `muted`).

## Styling tokens

Defined in `src/index.css` — CSS variables for shadcn theme. Use `font-heading` for brand headings, `container mx-auto px-4` for page width.
