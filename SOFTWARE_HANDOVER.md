# Divine Children Home Ltd — Software Handover Document

**Document version:** 1.0  
**Date:** 21 July 2026  
**Purpose:** Complete technical handover for migration from Replit to Cursor (and general off-platform deployment)  
**Repository root:** `Divine-Children-Home/`

---

## Table of Contents

1. [Overall Project Architecture](#1-overall-project-architecture)
2. [Folder Structure with Explanations](#2-folder-structure-with-explanations)
3. [Every Dependency and Why It Is Used](#3-every-dependency-and-why-it-is-used)
4. [Routing Structure](#4-routing-structure)
5. [Every Page](#5-every-page)
6. [Every Reusable Component](#6-every-reusable-component)
7. [Styling System](#7-styling-system)
8. [State Management](#8-state-management)
9. [Data Fetching Architecture](#9-data-fetching-architecture)
10. [API Layer](#10-api-layer)
11. [Database Schema](#11-database-schema)
12. [Environment Variables Required](#12-environment-variables-required)
13. [SEO Implementation](#13-seo-implementation)
14. [Accessibility Implementation](#14-accessibility-implementation)
15. [Animation System](#15-animation-system)
16. [Forms Architecture](#16-forms-architecture)
17. [Image Handling](#17-image-handling)
18. [Performance Optimizations](#18-performance-optimizations)
19. [Security Considerations](#19-security-considerations)
20. [Known Limitations](#20-known-limitations)
21. [Recommended Improvements](#21-recommended-improvements)
22. [Remaining Work](#22-remaining-work)
23. [Deployment Instructions](#23-deployment-instructions)
24. [Complete Project Tree](#24-complete-project-tree)

---

## 1. Overall Project Architecture

Divine Children Home Ltd is a **pnpm monorepo** corporate website for a UK children's residential care and supported living provider. The system follows an **OpenAPI-first, contract-driven** architecture with a decoupled frontend SPA and REST API backed by PostgreSQL.

### High-Level Diagram

```mermaid
flowchart TB
  subgraph client [Browser]
    SPA[React SPA<br/>Vite + Wouter]
    RQ[TanStack React Query]
  end

  subgraph server [API Server]
    Express[Express 5]
    ZodVal[Zod Validation<br/>@workspace/api-zod]
    Drizzle[Drizzle ORM]
  end

  subgraph shared [Shared Libraries]
    OpenAPI[openapi.yaml]
    Orval[Orval Codegen]
    DBSchema[db/schema]
    ClientGen[api-client-react]
  end

  subgraph data [Data Layer]
    PG[(PostgreSQL 16)]
  end

  OpenAPI --> Orval
  Orval --> ClientGen
  Orval --> ZodVal
  SPA --> RQ
  RQ -->|"/api/*"| Express
  Express --> ZodVal --> Drizzle --> PG
  DBSchema --> Drizzle
```

### Architectural Principles

| Principle | Implementation |
|-----------|----------------|
| **Contract-first API** | `lib/api-spec/openapi.yaml` is the single source of truth; Orval generates React Query hooks and Zod validators |
| **Type safety end-to-end** | TypeScript 5.9 across all packages; Drizzle schema types; generated API types |
| **Monorepo workspaces** | pnpm workspaces with shared dependency catalog (`pnpm-workspace.yaml`) |
| **Separation of concerns** | Frontend (`artifacts/divine-children-home`), API (`artifacts/api-server`), shared libs (`lib/*`) |
| **Static + dynamic content** | Marketing pages are static React; CMS-like content (news, jobs, FAQs, gallery, testimonials) comes from PostgreSQL |
| **Form tracking** | All form submissions receive server-generated reference numbers (`CNT-`, `REF-`, `APP-` prefixes) |

### Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 24 |
| Package manager | pnpm (workspaces) |
| Frontend | React 19, Vite 7, Wouter 3, Tailwind CSS 4 |
| Backend | Express 5, Pino logging |
| Database | PostgreSQL 16, Drizzle ORM |
| Validation | Zod 3.x |
| API codegen | Orval 8.x |
| Deployment (current) | Replit autoscale with multi-artifact routing |

### Deployable Artifacts

| Artifact | Package | Role |
|----------|---------|------|
| `artifacts/divine-children-home` | `@workspace/divine-children-home` | Production website (static SPA) |
| `artifacts/api-server` | `@workspace/api-server` | REST API at `/api` |
| `artifacts/mockup-sandbox` | `@workspace/mockup-sandbox` | Replit Canvas component preview at `/__mockup` (dev tooling only) |

---

## 2. Folder Structure with Explanations

```
Divine-Children-Home/
├── artifacts/                    # Deployable applications
│   ├── divine-children-home/     # Production React SPA
│   ├── api-server/               # Express REST API
│   └── mockup-sandbox/           # Replit design preview sandbox
├── lib/                          # Shared libraries consumed by artifacts
│   ├── api-spec/                 # OpenAPI spec + Orval config
│   ├── api-zod/                  # Generated Zod schemas (server validation)
│   ├── api-client-react/         # Generated React Query hooks (client)
│   └── db/                       # Drizzle ORM schema + PostgreSQL pool
├── scripts/                      # Utility scripts (post-merge hook, hello)
├── attached_assets/              # Static assets (Vite alias @assets)
│   └── generated_images/         # Hero, about, gallery JPG images
├── .replit                       # Replit project configuration
├── pnpm-workspace.yaml           # Workspace definition + dependency catalog
├── replit.md                     # Operational runbook (Replit-oriented)
└── tsconfig.json                 # Root TypeScript project references
```

### Package Purposes

| Path | Package Name | Purpose |
|------|--------------|---------|
| `artifacts/divine-children-home/` | `@workspace/divine-children-home` | Public-facing website with 16 routes, forms, and API-driven content |
| `artifacts/api-server/` | `@workspace/api-server` | Express server exposing `/api/*` endpoints; esbuild-bundled for production |
| `artifacts/mockup-sandbox/` | `@workspace/mockup-sandbox` | Isolated shadcn/ui preview server for Replit Canvas (not required for production) |
| `lib/db/` | `@workspace/db` | PostgreSQL connection pool, Drizzle schema, `drizzle-kit push` scripts |
| `lib/api-spec/` | `@workspace/api-spec` | OpenAPI 3.1 spec; Orval codegen entry point |
| `lib/api-zod/` | `@workspace/api-zod` | Auto-generated Zod request/response validators for API routes |
| `lib/api-client-react/` | `@workspace/api-client-react` | Auto-generated React Query hooks + custom fetch layer |
| `scripts/` | `@workspace/scripts` | Post-merge DB sync script and placeholder utilities |
| `attached_assets/` | — | Static image assets referenced via Vite alias `@assets` |

### Key Frontend Subdirectories

| Path | Purpose |
|------|---------|
| `artifacts/divine-children-home/src/pages/` | Route-level page components (16 pages) |
| `artifacts/divine-children-home/src/components/layout/` | Site chrome: Header, Footer, Layout wrapper |
| `artifacts/divine-children-home/src/components/ui/` | shadcn/ui primitive components (55 files) |
| `artifacts/divine-children-home/src/hooks/` | Custom hooks (`use-toast`, `use-mobile`) |
| `artifacts/divine-children-home/src/lib/utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `artifacts/divine-children-home/public/` | Static public assets (favicon, robots.txt) |

### Key API Subdirectories

| Path | Purpose |
|------|---------|
| `artifacts/api-server/src/routes/` | Express route handlers grouped by domain |
| `artifacts/api-server/src/lib/logger.ts` | Pino logger with header redaction |
| `artifacts/api-server/build.mjs` | esbuild production bundle script |

> **Note:** `lib/integrations/` is referenced in `pnpm-workspace.yaml` but does not exist in the repository.

---

## 3. Every Dependency and Why It Is Used

Dependencies are managed via a **shared catalog** in `pnpm-workspace.yaml` and referenced with `catalog:` in individual `package.json` files.

### Root (`package.json`)

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@replit/connectors-sdk` | ^0.4.1 | Replit platform integrations (connectors) |
| `prettier` | ^3.9.5 | Code formatting |
| `typescript` | ~5.9.3 | Type checking across monorepo |

### Frontend — `@workspace/divine-children-home`

| Dependency | Version | Purpose |
|------------|---------|---------|
| `react` / `react-dom` | 19.1.0 | UI framework |
| `vite` | ^7.3.2 | Dev server and production bundler |
| `@vitejs/plugin-react` | ^5.0.4 | React Fast Refresh and JSX transform |
| `wouter` | ^3.3.5 | Lightweight client-side routing |
| `@tanstack/react-query` | ^5.90.21 | Server state, caching, mutations |
| `@workspace/api-client-react` | workspace:* | Generated API hooks |
| `tailwindcss` | ^4.1.14 | Utility-first CSS |
| `@tailwindcss/vite` | ^4.1.14 | Tailwind v4 Vite integration |
| `@tailwindcss/typography` | ^0.5.15 | Prose styling for rich text content |
| `tw-animate-css` | ^1.4.0 | Tailwind animation utilities |
| `framer-motion` | ^12.23.24 | Page entrance animations, gallery lightbox |
| `react-hook-form` | ^7.55.0 | Form state management |
| `@hookform/resolvers` | ^3.10.0 | Zod resolver for react-hook-form |
| `zod` | ^3.25.76 | Client-side form validation schemas |
| `class-variance-authority` | ^0.7.1 | Variant-based component styling (shadcn) |
| `clsx` | ^2.1.1 | Conditional class names |
| `tailwind-merge` | ^3.3.1 | Merge Tailwind classes without conflicts |
| `lucide-react` | ^0.545.0 | Icon library |
| `react-icons` | ^5.4.0 | Additional icons (social, brand) |
| `date-fns` | ^3.6.0 | Date formatting (careers job posted dates) |
| `embla-carousel-react` | ^8.6.0 | Carousel component (shadcn carousel) |
| `recharts` | ^2.15.2 | Chart components (available via shadcn chart) |
| `sonner` | ^2.0.7 | Toast notifications (alternative to shadcn toast) |
| `next-themes` | ^0.4.6 | Theme switching support (dark mode infrastructure) |
| `cmdk` | ^1.1.1 | Command palette component |
| `vaul` | ^1.1.2 | Drawer component |
| `input-otp` | ^1.4.2 | OTP input component |
| `react-day-picker` | ^9.11.1 | Calendar/date picker |
| `react-resizable-panels` | ^2.1.7 | Resizable panel layouts |
| `@radix-ui/react-*` (20 packages) | ^1.1.3–^2.2.7 | Accessible headless UI primitives for shadcn |
| `@replit/vite-plugin-cartographer` | ^0.5.21 | Replit dev: codebase navigation overlay |
| `@replit/vite-plugin-dev-banner` | ^0.1.1 | Replit dev: development banner |
| `@replit/vite-plugin-runtime-error-modal` | ^0.0.6 | Replit dev: runtime error overlay |

### API Server — `@workspace/api-server`

| Dependency | Version | Purpose |
|------------|---------|---------|
| `express` | ^5.2.1 | HTTP server and routing |
| `cors` | ^2.8.6 | Cross-origin resource sharing (open by default) |
| `cookie-parser` | ^1.4.7 | Cookie parsing (**installed but not wired in `app.ts`**) |
| `drizzle-orm` | ^0.45.2 | Database query builder |
| `@workspace/db` | workspace:* | Shared database schema and pool |
| `@workspace/api-zod` | workspace:* | Generated request/response validation |
| `pino` | ^9.14.0 | Structured JSON logging |
| `pino-http` | ^10.5.0 | HTTP request logging middleware |
| `esbuild` | 0.27.3 | Production bundle (devDependency) |
| `esbuild-plugin-pino` | ^2.3.3 | Bundle Pino worker threads |
| `pino-pretty` | ^13.1.3 | Human-readable logs in development |
| `thread-stream` | 3.1.0 | Pino worker thread support |

### Database — `@workspace/db`

| Dependency | Version | Purpose |
|------------|---------|---------|
| `drizzle-orm` | ^0.45.2 | ORM for PostgreSQL |
| `drizzle-zod` | ^0.8.3 | Generate Zod schemas from Drizzle tables |
| `pg` | ^8.22.0 | PostgreSQL client |
| `zod` | ^3.25.76 | Schema validation types |
| `drizzle-kit` | ^0.31.10 | Schema push/migration tooling |

### API Spec — `@workspace/api-spec`

| Dependency | Version | Purpose |
|------------|---------|---------|
| `orval` | ^8.22.0 | Generate React Query hooks and Zod schemas from OpenAPI |

### API Client — `@workspace/api-client-react`

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@tanstack/react-query` | ^5.90.21 | Underlying query/mutation primitives for generated hooks |

### API Zod — `@workspace/api-zod`

| Dependency | Version | Purpose |
|------------|---------|---------|
| `zod` | ^3.25.76 | Server-side request/response validation |

### Scripts — `@workspace/scripts`

| Dependency | Version | Purpose |
|------------|---------|---------|
| `tsx` | ^4.21.0 | TypeScript script execution |

---

## 4. Routing Structure

**Router:** [Wouter](https://github.com/molefrog/wouter) v3 (not React Router or Next.js)  
**Configuration:** `artifacts/divine-children-home/src/App.tsx`  
**Base path:** `import.meta.env.BASE_URL` (derived from `BASE_PATH` environment variable)

### Route Table

| Path | Component | Layout |
|------|-----------|--------|
| `/` | `Home` | Yes |
| `/about` | `About` | Yes |
| `/homes` | `Homes` | Yes |
| `/services` | `Services` | Yes |
| `/referral` | `Referral` | Yes |
| `/careers` | `Careers` | Yes |
| `/news` | `News` | Yes |
| `/news/:slug` | `NewsArticle` | Yes |
| `/resources` | `Resources` | Yes |
| `/contact` | `Contact` | Yes |
| `/safeguarding` | `Safeguarding` | Yes |
| `/faqs` | `FAQs` | Yes |
| `/gallery` | `Gallery` | Yes |
| `/privacy` | `Legal type="privacy"` | Yes |
| `/terms` | `Legal type="terms"` | Yes |
| `/cookies` | `Legal type="cookies"` | Yes |
| `/complaints` | `Legal type="complaints"` | Yes |
| *(fallback)* | `NotFound` | Yes |

### Routing Behaviors

- **SPA fallback:** Production Replit artifact rewrites `/*` → `/index.html` for client-side routing
- **Scroll reset:** `ScrollToTop` component resets scroll position on route change
- **Legal pages:** Single `Legal` component renders different static content based on `type` prop
- **Query params:** Careers "Apply" links to `/contact?job={id}` (job ID passed but not consumed by contact form)
- **Services anchors:** `/services#residential`, `/services#supported-living`, etc. (hash navigation)

### Global App Providers (outside routes)

```
QueryClientProvider
  └── TooltipProvider
        └── WouterRouter (base = BASE_URL)
              └── Layout
                    └── Switch (routes)
        CookieConsent
        BackToTop
        Toaster
```

---

## 5. Every Page

All pages live in `artifacts/divine-children-home/src/pages/`.

### Page Reference

| File | Route | Title (document.title) | Data Source | Key Features |
|------|-------|------------------------|-------------|--------------|
| `home.tsx` | `/` | Divine Children Home Ltd \| Premium Residential Care | API: testimonials, news; component: StatsSection | Hero, services overview, testimonials carousel, news preview, CTA sections; Framer Motion animations |
| `about.tsx` | `/about` | About Us \| Divine Children Home Ltd | Static + `@assets` images | Mission, values, team section, partner logo placeholders |
| `homes.tsx` | `/homes` | Our Homes \| Divine Children Home Ltd | Static + `@assets` images | Individual home cards with photos and descriptions |
| `services.tsx` | `/services` | Our Services \| Divine Children Home Ltd | Static | Residential care, supported living, emergency placements; hash anchor sections |
| `referral.tsx` | `/referral` | Make a Referral \| Divine Children Home Ltd | Form → API | Multi-step referral form for Local Authority workflows (urgency, placement type, support needs) |
| `careers.tsx` | `/careers` | Careers \| Divine Children Home Ltd | API: jobs list | Job cards; "Apply" links to `/contact?job={id}` (no dedicated application form) |
| `news.tsx` | `/news` | News & Updates \| Divine Children Home Ltd | API: news list | Article grid with category badges, excerpts, images |
| `news-article.tsx` | `/news/:slug` | `{article.title}` \| Divine Children Home Ltd | API: single article + recent news | Full article content, sidebar with recent articles |
| `resources.tsx` | `/resources` | Resources & Downloads \| Divine Children Home Ltd | Static hardcoded | PDF download list (metadata only; no actual files) |
| `contact.tsx` | `/contact` | Contact Us \| Divine Children Home Ltd | Form → API | Contact form, office details, map placeholder |
| `safeguarding.tsx` | `/safeguarding` | Safeguarding \| Divine Children Home Ltd | Static | Safeguarding policy content, whistleblowing info |
| `faqs.tsx` | `/faqs` | Frequently Asked Questions \| Divine Children Home Ltd | API: FAQs | Accordion grouped by category |
| `gallery.tsx` | `/gallery` | Gallery \| Divine Children Home Ltd | API: gallery images | Category filter, masonry grid, Dialog lightbox with AnimatePresence |
| `legal.tsx` | `/privacy`, `/terms`, `/cookies`, `/complaints` | `{content.title}` \| Divine Children Home Ltd | Static HTML strings | Shared legal page template with prose styling |
| `not-found.tsx` | 404 fallback | *(not set)* | Static | 404 message and home link |

### Page → API Hook Mapping

| Page | React Query Hooks |
|------|-------------------|
| Home | `useListTestimonials`, `useListNews` + `StatsSection` uses `useGetStats` |
| Careers | `useListJobs` |
| News | `useListNews` |
| News Article | `useGetNewsArticle`, `useListNews` |
| FAQs | `useListFaqs` |
| Gallery | `useListGalleryImages` |
| Contact | `useSubmitContactForm` |
| Referral | `useSubmitReferralForm` |
| Footer (global) | `useSubscribeNewsletter` |

---

## 6. Every Reusable Component

### Application Components (custom, non-shadcn)

Located in `artifacts/divine-children-home/src/components/`.

| Component | File | Purpose | Props / Behavior |
|-----------|------|---------|------------------|
| **Layout** | `layout/layout.tsx` | Page shell wrapping Header, `<main>`, Footer | Wraps all routed content |
| **Header** | `layout/header.tsx` | Sticky navigation with top utility bar | Desktop dropdown menus, mobile hamburger menu, active route highlighting |
| **Footer** | `layout/footer.tsx` | 4-column site footer | Newsletter signup form, legal links, social icons, contact info |
| **PageHeader** | `page-header.tsx` | Hero banner with title, description, breadcrumbs | Used on all inner pages |
| **StatsSection** | `stats-section.tsx` | Animated homepage statistics counters | Fetches `useGetStats`, Framer Motion `useInView`, custom RAF counter animation |
| **CookieConsent** | `cookie-consent.tsx` | GDPR-style cookie banner | Persists choice in `localStorage` key `cookie-consent` |
| **BackToTop** | `back-to-top.tsx` | Floating scroll-to-top button | Appears after scroll threshold; `aria-label="Back to top"` |
| **ScrollToTop** | `scroll-to-top.tsx` | Resets scroll on route change | Uses Wouter location hook |

### Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useToast` | `hooks/use-toast.ts` | Toast notification state (shadcn pattern) |
| `useMobile` | `hooks/use-mobile.tsx` | Responsive breakpoint detection (`768px`) |

### Utilities

| Utility | File | Purpose |
|---------|------|---------|
| `cn()` | `lib/utils.ts` | Combines `clsx` + `tailwind-merge` for conditional classes |

### shadcn/ui Primitives (55 components)

Located in `artifacts/divine-children-home/src/components/ui/`. These are copy-paste Radix-based components, not npm packages.

| Component | Primary Use in Project |
|-----------|------------------------|
| `accordion` | FAQs page |
| `alert`, `alert-dialog` | Available; limited direct page usage |
| `aspect-ratio` | Image containers |
| `avatar` | Testimonials |
| `badge` | News categories, job departments |
| `breadcrumb` | PageHeader navigation |
| `button` | CTAs, forms, navigation |
| `button-group` | Available |
| `calendar` | Available (date picker infrastructure) |
| `card` | Content sections, job listings, contact info |
| `carousel` | Testimonials on homepage |
| `chart` | Available (Recharts wrapper) |
| `checkbox` | Form fields |
| `collapsible` | Available |
| `command` | Available (cmdk) |
| `context-menu` | Available |
| `dialog` | Gallery lightbox |
| `drawer` | Available (vaul) |
| `dropdown-menu` | Header navigation dropdowns |
| `empty` | Empty states |
| `field` | Form field wrapper |
| `form` | Contact, referral, newsletter forms |
| `hover-card` | Available |
| `input`, `input-group`, `input-otp` | Form inputs |
| `item` | List item component |
| `kbd` | Keyboard shortcut display |
| `label` | Form labels |
| `menubar` | Available |
| `navigation-menu` | Header desktop nav |
| `pagination` | Available |
| `popover` | Available |
| `progress` | Available |
| `radio-group` | Available |
| `resizable` | Available |
| `scroll-area` | Available |
| `select` | Referral form dropdowns |
| `separator` | Visual dividers |
| `sheet` | Mobile navigation drawer |
| `sidebar` | Available |
| `skeleton` | Loading states (news, jobs, gallery, stats) |
| `slider` | Available |
| `sonner` | Available (alternative toast) |
| `spinner` | Loading indicator |
| `switch` | Available |
| `table` | Available |
| `tabs` | Available |
| `textarea` | Contact, referral forms |
| `toast`, `toaster` | Form submission feedback |
| `toggle`, `toggle-group` | Available |
| `tooltip` | Global tooltip provider |

---

## 7. Styling System

### Approach

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **shadcn/ui** component pattern with Radix UI primitives
- **CSS custom properties** for brand theming
- **No CSS Modules, Sass, or Styled Components**

### Global Styles

**File:** `artifacts/divine-children-home/src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@700;800&display=swap');
@import 'tailwindcss';
@import 'tw-animate-css';
@plugin "@tailwindcss/typography";
```

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary (Deep Navy) | `#123B6D` | Headings, primary buttons, navigation |
| Secondary (Sky Blue) | `#4FA9DD` | Accents, secondary actions |
| Accent (Warm Orange) | `#F39C12` | CTAs, highlights |
| Background | `#F8FAFC` | Page background |

### Typography

| Role | Font | Weight |
|------|------|--------|
| Body | Inter | 400, 500, 600 |
| Headings | Poppins | 700, 800 |

CSS variables: `--font-sans` (Inter), `--font-heading` (Poppins)

### Theming

- HSL-based design tokens in `:root` (shadcn convention)
- `.dark` variant defined but **uses same light palette** (comment in CSS: "Using light mode defaults for dark mode")
- `next-themes` installed for future dark mode support

### Component Styling Pattern

```tsx
// class-variance-authority for variants
// tailwind-merge via cn() for conflict resolution
className={cn("base-classes", conditional && "conditional-classes", className)}
```

### shadcn Configuration

**File:** `artifacts/divine-children-home/components.json` — defines component aliases and Tailwind paths.

---

## 8. State Management

The project uses a **minimal, layered state approach** without global state libraries.

| Layer | Technology | Scope |
|-------|------------|-------|
| **Server/async state** | TanStack React Query v5 | All API data fetching and form mutations |
| **Form state** | React Hook Form | Contact, referral forms |
| **Local UI state** | React `useState` / `useEffect` | Mobile menu, gallery filter, cookie consent, back-to-top visibility |
| **Persistent client state** | `localStorage` | Cookie consent preference |

### Not Used

- Redux, Zustand, Jotai, Recoil
- React Context for application state (only library providers)

### React Query Configuration

**File:** `artifacts/divine-children-home/src/App.tsx`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

### Global Providers

1. `QueryClientProvider` — API data caching
2. `TooltipProvider` — Radix tooltip context
3. `Toaster` — Toast notifications

---

## 9. Data Fetching Architecture

### Flow

```
Page Component
  └── Generated Hook (e.g., useListNews)
        └── TanStack React Query
              └── customFetch() in lib/api-client-react
                    └── fetch("/api/news")
                          └── Express Route Handler
                                └── Drizzle ORM → PostgreSQL
```

### Generated Hooks

**Source:** `lib/api-client-react/src/generated/api.ts` (auto-generated by Orval)

| Hook | Method | Endpoint | Type |
|------|--------|----------|------|
| `useHealthCheck` | GET | `/api/healthz` | Query |
| `useListJobs` | GET | `/api/jobs` | Query |
| `useGetJob` | GET | `/api/jobs/:id` | Query |
| `useListNews` | GET | `/api/news` | Query |
| `useGetNewsArticle` | GET | `/api/news/:slug` | Query |
| `useListFaqs` | GET | `/api/faqs` | Query |
| `useListTestimonials` | GET | `/api/testimonials` | Query |
| `useListGalleryImages` | GET | `/api/gallery` | Query |
| `useGetStats` | GET | `/api/stats` | Query |
| `useSubmitContactForm` | POST | `/api/forms/contact` | Mutation |
| `useSubmitReferralForm` | POST | `/api/forms/referral` | Mutation |
| `useSubmitCareerApplication` | POST | `/api/forms/career` | Mutation |
| `useSubscribeNewsletter` | POST | `/api/forms/newsletter` | Mutation |

### Custom Fetch Layer

**File:** `lib/api-client-react/src/custom-fetch.ts`

- Base URL prepending via `setBaseUrl()` (for mobile/Expo clients)
- Bearer token injection via `setAuthTokenGetter()` (not used by web app)
- Structured error handling with `ApiError` class
- JSON/text/blob response parsing
- React Native compatibility considerations

### Caching Strategy

- **Stale time:** 5 minutes (queries considered fresh)
- **Refetch on window focus:** Disabled
- **No persistence:** No React Query persist layer
- **Loading states:** Skeleton components shown during fetch
- **Error handling:** Toast notifications on mutation failure; some pages show error states

---

## 10. API Layer

### Server Entry

- **App setup:** `artifacts/api-server/src/app.ts`
- **Server start:** `artifacts/api-server/src/index.ts`
- **Mount point:** `/api`
- **Production bundle:** `artifacts/api-server/dist/index.mjs` (esbuild ESM)

### Middleware Stack

```typescript
pinoHttp({ logger })  // Request logging with redaction
cors()                // Open CORS (no origin restriction)
express.json()        // JSON body parsing
express.urlencoded()  // Form body parsing
```

### Route Handlers

| File | Endpoints | Notes |
|------|-----------|-------|
| `routes/health.ts` | `GET /healthz` | Returns `{ status: "ok" }` |
| `routes/jobs.ts` | `GET /jobs`, `GET /jobs/:id` | Filters `isActive = true` |
| `routes/news.ts` | `GET /news`, `GET /news/:slug` | Ordered by `publishedAt` desc |
| `routes/faqs.ts` | `GET /faqs` | Ordered by category, `sortOrder` |
| `routes/testimonials.ts` | `GET /testimonials` | All testimonials |
| `routes/gallery.ts` | `GET /gallery` | All gallery images |
| `routes/stats.ts` | `GET /stats` | **Hardcoded static values** |
| `routes/forms.ts` | `POST /forms/*` | Zod-validated form submissions |

### Validation Pattern

```typescript
const parsed = SubmitContactFormBody.safeParse(req.body);
if (!parsed.success) {
  res.status(400).json({ error: parsed.error.message });
  return;
}
// Insert to database...
res.status(201).json(SubmitContactFormResponse.parse({ ... }));
```

### Reference Number Generation

```typescript
function generateRef(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}
// Prefixes: CNT (contact), REF (referral), APP (career)
```

### OpenAPI Codegen Workflow

1. Edit `lib/api-spec/openapi.yaml`
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. Orval generates:
   - `lib/api-client-react/src/generated/` — React Query hooks
   - `lib/api-zod/src/generated/` — Zod schemas
4. Run `pnpm run typecheck` to verify

### Logging

**File:** `artifacts/api-server/src/lib/logger.ts`

- Production: JSON logs via Pino
- Development: Pretty-printed via `pino-pretty`
- Redacts: `authorization`, `cookie`, `set-cookie` headers
- Configurable via `LOG_LEVEL` env var (default: `info`)

---

## 11. Database Schema

### ORM & Connection

- **ORM:** Drizzle ORM
- **Driver:** `pg` (node-postgres)
- **Config:** `lib/db/drizzle.config.ts`
- **Connection:** `lib/db/src/index.ts` — requires `DATABASE_URL`
- **Schema push:** `pnpm --filter @workspace/db run push` (no SQL migration files)

### Entity Relationship Overview

```mermaid
erDiagram
  jobs ||--o{ career_applications : "jobId (optional FK)"
  jobs {
    serial id PK
    text title
    text department
    text location
    text type
    text description
    text requirements
    text salary
    timestamp posted_at
    boolean is_active
  }
  news {
    serial id PK
    text title
    text slug UK
    text excerpt
    text content
    text category
    timestamp published_at
    text image_url
    text author
  }
  faqs {
    serial id PK
    text question
    text answer
    text category
    integer sort_order
  }
  testimonials {
    serial id PK
    text name
    text role
    text organisation
    text quote
    integer rating
    text avatar_url
  }
  gallery {
    serial id PK
    text title
    text image_url
    text category
    text caption
  }
  contact_submissions {
    serial id PK
    text reference_number UK
    timestamp submitted_at
  }
  referral_submissions {
    serial id PK
    text reference_number UK
    timestamp submitted_at
  }
  career_applications {
    serial id PK
    integer job_id
    text reference_number UK
    timestamp submitted_at
  }
  newsletter_subscribers {
    serial id PK
    text email UK
    timestamp subscribed_at
  }
```

### Table Definitions

#### Content Tables

| Table | Drizzle File | Key Columns |
|-------|--------------|-------------|
| `jobs` | `schema/jobs.ts` | id, title, department, location, type, description, requirements, salary, postedAt, isActive |
| `news` | `schema/news.ts` | id, title, slug (unique), excerpt, content, category, publishedAt, imageUrl, author |
| `faqs` | `schema/faqs.ts` | id, question, answer, category, sortOrder |
| `testimonials` | `schema/testimonials.ts` | id, name, role, organisation, quote, rating, avatarUrl |
| `gallery` | `schema/gallery.ts` | id, title, imageUrl, category, caption |

#### Form Submission Tables

| Table | Drizzle File | Key Columns |
|-------|--------------|-------------|
| `contact_submissions` | `schema/forms.ts` | id, name, email, phone, subject, message, organisation, referenceNumber, submittedAt |
| `referral_submissions` | `schema/forms.ts` | referrer fields, childAge, childGender, localAuthority, placementType, urgency, supportNeeds, additionalInfo, referenceNumber, submittedAt |
| `career_applications` | `schema/forms.ts` | firstName, lastName, email, phone, position, jobId, coverLetter, experience, qualifications, rightToWork, referenceNumber, submittedAt |
| `newsletter_subscribers` | `schema/forms.ts` | id, email (unique), name, subscribedAt |

### Schema Management

- **No seed scripts** — content must be inserted manually or via admin tooling (not built)
- **Post-merge hook:** `scripts/post-merge.sh` runs `pnpm --filter db push` after merges
- **Type generation:** Drizzle-zod insert schemas exported from schema files

---

## 12. Environment Variables Required

> **No `.env` or `.env.example` files exist in the repository.** Create these manually for local/Cursor development.

### Required Variables

| Variable | Used By | Description | Example |
|----------|---------|-------------|---------|
| `DATABASE_URL` | `@workspace/db`, API server | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/divine_children_home` |
| `PORT` | Frontend Vite, API server | Server port (strictly required by Vite config) | Frontend: `23337`, API: `8080` |
| `BASE_PATH` | Frontend Vite | Base URL path for assets and routing | `/` |

### Optional Variables

| Variable | Used By | Default | Description |
|----------|---------|---------|-------------|
| `NODE_ENV` | API logger, Vite plugins, build | — | `development` or `production` |
| `LOG_LEVEL` | API logger | `info` | Pino log level |
| `REPL_ID` | Vite Replit plugins | — | Enables Replit dev plugins when set |
| `CI` | Replit postBuild | — | Set to `true` during deployment builds |

### Replit Artifact Defaults

| Artifact | PORT | BASE_PATH | NODE_ENV |
|----------|------|-----------|----------|
| Frontend | 23337 | `/` | — |
| API Server | 8080 | — | production |
| Mockup Sandbox | 8081 | `/__mockup` | — |

### Recommended `.env.example`

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/divine_children_home

# Frontend (artifacts/divine-children-home)
PORT=23337
BASE_PATH=/

# API Server (artifacts/api-server)
# PORT=8080
# NODE_ENV=development
# LOG_LEVEL=info
```

---

## 13. SEO Implementation

### Current State: Partial / Placeholder

#### Static Meta Tags

**File:** `artifacts/divine-children-home/index.html`

| Tag | Current Value | Status |
|-----|---------------|--------|
| `<title>` | Divine Children Home Ltd | ✅ Set |
| `<meta name="description">` | "built on Replit. Update this description..." | ⚠️ Placeholder |
| `<meta name="robots">` | index, follow | ✅ Set |
| `og:title` | Divine Children Home Ltd | ✅ Set |
| `og:description` | Placeholder text | ⚠️ Placeholder |
| `og:type` | website | ✅ Set |
| `twitter:card` | summary_large_image | ✅ Set |
| `og:image` | — | ❌ Missing |
| Canonical URL | — | ❌ Missing |
| JSON-LD / Schema.org | — | ❌ Missing |

#### Per-Page Titles

Most pages set `document.title` via `useEffect`:

| Page | Title Pattern |
|------|---------------|
| Home | Divine Children Home Ltd \| Premium Residential Care |
| About | About Us \| Divine Children Home Ltd |
| Inner pages | `{Page Name} \| Divine Children Home Ltd` |
| News Article | `{article.title} \| Divine Children Home Ltd` |
| Legal | `{content.title} \| Divine Children Home Ltd` |
| 404 | *(not set)* |

#### robots.txt

**File:** `artifacts/divine-children-home/public/robots.txt`

```
User-agent: *
Allow: /
```

#### Not Implemented

- Server-side rendering (SSR) or static site generation (SSG)
- Dynamic meta tags per route (no react-helmet or similar)
- Sitemap.xml
- Structured data (Organization, LocalBusiness, FAQ schema)
- Social sharing images

---

## 14. Accessibility Implementation

### Implemented

| Feature | Location | Notes |
|---------|----------|-------|
| Document language | `index.html` | `lang="en"` |
| Radix UI primitives | shadcn components | Built-in ARIA for dialogs, menus, accordions |
| Form accessibility | shadcn Form | `aria-invalid`, `aria-describedby` on fields |
| Back to top button | `back-to-top.tsx` | `aria-label="Back to top"` |
| Pagination | shadcn pagination | `aria-label`, `sr-only` text |
| Carousel | shadcn carousel | Keyboard navigation via Radix |
| Breadcrumbs | shadcn breadcrumb | Semantic nav structure |

### Gaps (PRD targets WCAG 2.1 AA)

| Gap | Location | Recommendation |
|-----|----------|----------------|
| No skip-to-content link | Layout | Add skip link as first focusable element |
| Mobile menu toggle | `header.tsx` | Add `aria-label`, `aria-expanded` |
| PageHeader breadcrumb | `page-header.tsx` | Add `aria-label="Breadcrumb"` to nav |
| Cookie banner buttons | `cookie-consent.tsx` | Add explicit ARIA labels |
| 404 page title | `not-found.tsx` | Set `document.title` |
| Color contrast | Brand colors | Audit against WCAG AA (especially orange accent) |
| Focus management | Route changes | Consider focus trap in modals, focus reset on navigation |

---

## 15. Animation System

### Libraries

| Library | Version | Usage |
|---------|---------|-------|
| **framer-motion** | ^12.23.24 | Primary animation library |
| **tw-animate-css** | ^1.4.0 | Tailwind CSS animation utilities |
| **embla-carousel-react** | ^8.6.0 | Testimonials carousel (via shadcn) |

### Framer Motion Usage by Page

| Page/Component | Animation Pattern |
|----------------|-------------------|
| `home.tsx` | Staggered fade-in/slide-up on hero, sections, cards |
| `about.tsx` | Fade-in on content blocks |
| `homes.tsx` | Slide-in on home cards |
| `services.tsx` | Fade-in on service sections |
| `news.tsx` | Staggered card animations |
| `gallery.tsx` | Layout animations, `AnimatePresence` for lightbox |
| `stats-section.tsx` | `useInView` trigger + custom RAF counter easing |

### Custom Animation

**StatsSection Counter** (`stats-section.tsx`):

```typescript
// requestAnimationFrame with cubic ease-out
const easeOut = 1 - Math.pow(1 - progress, 3);
setCount(Math.floor(end * easeOut));
```

### Not Used

- SwiperJS (mentioned in PRD only)
- CSS `@keyframes` beyond tw-animate-css utilities
- Lottie or SVG animations

---

## 16. Forms Architecture

### Pattern

```
React Hook Form
  └── @hookform/resolvers/zod (client validation)
        └── shadcn Form components (UI)
              └── Generated mutation hook (API submission)
                    └── Server Zod validation (@workspace/api-zod)
                          └── Drizzle insert
```

### Form Inventory

| Form | Location | Client Schema | API Hook | Server Schema | Reference Prefix |
|------|----------|---------------|----------|---------------|------------------|
| Contact | `contact.tsx` | `contactSchema` | `useSubmitContactForm` | `SubmitContactFormBody` | `CNT-` |
| Referral | `referral.tsx` | `referralSchema` | `useSubmitReferralForm` | `SubmitReferralFormBody` | `REF-` |
| Newsletter | `footer.tsx` | Minimal (email only) | `useSubscribeNewsletter` | `SubscribeNewsletterBody` | — |
| Career Application | **Not implemented** | — | `useSubmitCareerApplication` *(unused)* | `SubmitCareerApplicationBody` | `APP-` |

### Contact Form Fields

| Field | Validation |
|-------|------------|
| name | min 2 chars |
| email | valid email |
| phone | min 10 chars |
| organisation | optional |
| subject | min 2 chars |
| message | min 10 chars |

### Referral Form Fields

| Field | Validation | Notes |
|-------|------------|-------|
| referrerName, referrerRole, referrerOrganisation | min 2 chars | Referrer details |
| referrerEmail | valid email | |
| referrerPhone | min 10 chars | |
| childAge | 0–18 | Coerced number |
| childGender | required | |
| localAuthority | min 2 chars | |
| placementType | required | residential, supported-living, emergency |
| urgency | required | immediate, within-week, within-month, planned |
| supportNeeds | min 10 chars | |
| additionalInfo | optional | |

### Feedback Mechanism

- **Success:** Toast notification via `useToast` hook
- **Error:** Toast with `variant: "destructive"`
- **Referral success:** Displays reference number in toast description

---

## 17. Image Handling

### Image Sources

| Source | Path/Pattern | Usage |
|--------|--------------|-------|
| Vite alias `@assets` | `attached_assets/generated_images/*.jpg` | Hero, about, homes page imagery |
| API `imageUrl` fields | Database (news, gallery) | Dynamic content images |
| Public folder | `public/favicon.svg` | Site favicon |
| External URLs | Wikimedia, Google Maps | Ofsted logo, map placeholder |

### Available Static Images

```
attached_assets/generated_images/
├── about-team.jpg
├── gallery-dining.jpg
├── gallery-interior.jpg
├── gallery-outdoor.jpg
├── hero-bg.jpg
├── news-awards.jpg
├── news-community.jpg
└── news-training.jpg
```

### Vite Alias Configuration

```typescript
// vite.config.ts
'@assets': path.resolve(import.meta.dirname, '..', '..', 'attached_assets')
```

### Gallery Lightbox

- Click opens shadcn `Dialog` with full-size image
- Category filter applied client-side
- `AnimatePresence` for enter/exit animations

### Not Implemented

- Image optimization (Next/Image equivalent)
- Lazy loading library (native `loading="lazy"` may be used ad hoc)
- CDN integration
- File upload handling
- Responsive srcset generation

---

## 18. Performance Optimizations

### Implemented

| Optimization | Location | Details |
|--------------|----------|---------|
| React Query caching | `App.tsx` | 5-minute stale time reduces API calls |
| Code splitting | Vite | Automatic route-based chunking |
| esbuild bundling | API server | Single ESM bundle for fast cold starts |
| Skeleton loading states | Multiple pages | Perceived performance during data fetch |
| pnpm workspace deduplication | Monorepo | Shared dependencies across packages |
| Platform-specific binary exclusion | `pnpm-workspace.yaml` | Reduces install size on Linux (Replit) |
| Supply-chain defense | `pnpm-workspace.yaml` | 1-day minimum release age for npm packages |

### Vite Build Configuration

```typescript
build: {
  outDir: 'dist/public',
  emptyOutDir: true,
}
```

### Potential Improvements (Not Yet Implemented)

- Image compression and WebP conversion
- Route-based lazy loading (`React.lazy`)
- Service worker / PWA caching
- API response compression (gzip/brotli)
- Database query pagination
- CDN for static assets

---

## 19. Security Considerations

### Implemented

| Control | Implementation |
|---------|----------------|
| Input validation | Zod schemas on all POST endpoints |
| Email enumeration prevention | Newsletter duplicates return success silently |
| Log redaction | Pino redacts auth headers and cookies |
| Supply-chain defense | 1-day npm package release age requirement |
| Native module externals | esbuild excludes native modules from bundle |

### Present but Unused

| Item | Notes |
|------|-------|
| `cookie-parser` | Listed in API dependencies but not imported in `app.ts` |
| `setAuthTokenGetter()` | Bearer token support exists for mobile clients, not used by web |

### Not Implemented (PRD mentions, code lacks)

| Control | Risk | Recommendation |
|---------|------|----------------|
| Authentication/authorization | Admin endpoints would be unprotected | Add auth if admin panel built |
| Rate limiting | Form spam, DoS | Add express-rate-limit |
| CSRF protection | Cross-site form submission | Add CSRF tokens or SameSite cookies |
| Security headers | XSS, clickjacking | Add Helmet middleware |
| CORS restriction | Open to all origins | Configure allowed origins |
| Input sanitization | XSS in stored content | Sanitize HTML in news/content fields |
| HTTPS enforcement | — | Handle at reverse proxy level |

### Current CORS Configuration

```typescript
app.use(cors()); // Default: allows all origins
```

---

## 20. Known Limitations

| # | Limitation | Location | Impact |
|---|------------|----------|--------|
| 1 | Stats endpoint returns hardcoded values | `routes/stats.ts` | Homepage stats not reflect real data |
| 2 | Career application form not built | `careers.tsx` | Users redirected to contact page instead |
| 3 | Placeholder SEO meta descriptions | `index.html` | Poor search engine appearance |
| 4 | No `og:image` for social sharing | `index.html` | Broken social previews |
| 5 | Resources page PDFs are hardcoded | `resources.tsx` | Download buttons have no actual files |
| 6 | Google Maps uses placeholder API key | `contact.tsx` | Map does not render |
| 7 | Partner logos are text placeholders | `home.tsx`, `about.tsx` | Missing brand assets |
| 8 | No admin panel / CMS | — | Content requires direct DB access |
| 9 | No database seed data | — | Empty site on fresh install |
| 10 | `lib/integrations/` referenced but missing | `pnpm-workspace.yaml` | Workspace config inconsistency |
| 11 | OpenAPI `format: email` unsupported | Orval/Zod config | Must omit from spec |
| 12 | Replit-specific Vite plugins | `vite.config.ts` | Require `REPL_ID` or removal for local dev |
| 13 | No `.env.example` file | — | Onboarding friction |
| 14 | Contact form ignores `?job=` query param | `contact.tsx` | Job application context lost |
| 15 | 404 page has no title update | `not-found.tsx` | SEO/accessibility gap |

---

## 21. Recommended Improvements

### Priority 1 — Migration Blockers

1. **Create `.env.example`** with all required variables documented
2. **Remove or conditionalize Replit Vite plugins** for Cursor/local development
3. **Update SEO meta tags** in `index.html` with real descriptions and `og:image`
4. **Add database seed script** for initial content (jobs, news, FAQs, testimonials, gallery)

### Priority 2 — Feature Completion

5. **Build career application form** using existing `useSubmitCareerApplication` hook
6. **Make stats endpoint dynamic** or remove API call and use static frontend values
7. **Implement Resources downloads** with actual PDF files or external links
8. **Add Google Maps API key** or replace with static map image
9. **Handle `?job=` query param** on contact page or create dedicated application route

### Priority 3 — Production Hardening

10. **Add rate limiting** on form endpoints
11. **Configure CORS** for specific allowed origins
12. **Add Helmet** for security headers
13. **Implement sitemap.xml** and structured data (Organization schema)
14. **Add skip-to-content link** and fix accessibility gaps
15. **Set up CI/CD** (GitHub Actions) for typecheck, build, and deploy

### Priority 4 — Architecture

16. **Consider admin panel** for content management (or headless CMS integration)
17. **Add proper database migrations** instead of `drizzle-kit push`
18. **Implement email notifications** on form submissions
19. **Add image upload** for gallery and news management
20. **Remove unused dependencies** (`cookie-parser`, unused shadcn components)

---

## 22. Remaining Work

Based on PRD (`attached_assets/Pasted--Divine-Children-Home-Ltd-Product-Requirements-Document_*.txt`) and current implementation gaps:

### Content & Assets

- [ ] Replace placeholder SEO copy
- [ ] Add partner/trust logos (Ofsted, local authorities)
- [ ] Create/upload Resources PDFs
- [ ] Configure Google Maps with valid API key
- [ ] Add social sharing image (`og:image`)

### Features

- [ ] Career application form with file upload (CV)
- [ ] Job detail pages (`/careers/:id`)
- [ ] Admin dashboard for content management
- [ ] Email notifications for form submissions
- [ ] Dynamic homepage statistics
- [ ] Search functionality (news, FAQs)

### Technical

- [ ] Create `.env.example`
- [ ] Database seed script
- [ ] Remove Replit-specific dependencies for standalone deployment
- [ ] Docker/docker-compose for local development
- [ ] CI/CD pipeline
- [ ] Proper database migrations
- [ ] Rate limiting and security headers
- [ ] Sitemap and structured data
- [ ] WCAG 2.1 AA accessibility audit and fixes

### Documentation

- [ ] Root README.md (currently only `replit.md` exists)
- [ ] API documentation beyond OpenAPI spec
- [ ] Content editing guide for non-technical staff

---

## 23. Deployment Instructions

### Prerequisites

- Node.js 24+
- pnpm 9+
- PostgreSQL 16+

### Local Development (Cursor)

```bash
# 1. Clone and install
cd Divine-Children-Home
pnpm install

# 2. Set environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/divine_children_home"
export PORT=23337
export BASE_PATH=/

# 3. Push database schema
pnpm --filter @workspace/db run push

# 4. (Optional) Seed database with content
# No seed script exists — insert data manually

# 5. Run API server (terminal 1)
export PORT=8080
pnpm --filter @workspace/api-server run dev

# 6. Run frontend (terminal 2)
export PORT=23337
export BASE_PATH=/
pnpm --filter @workspace/divine-children-home run dev
```

### Production Build

```bash
# Full typecheck and build
pnpm run build

# Or individually:
pnpm --filter @workspace/divine-children-home run build
pnpm --filter @workspace/api-server run build
```

**Outputs:**
- Frontend: `artifacts/divine-children-home/dist/public/`
- API: `artifacts/api-server/dist/index.mjs`

### Replit Deployment (Current)

Configuration in `.replit`:

```toml
modules = ["nodejs-24", "postgresql-16"]
deploymentTarget = "autoscale"
```

**Artifacts:**

| Artifact | Port | Serve Method |
|----------|------|--------------|
| Frontend | 23337 | Static from `dist/public` with SPA rewrite |
| API | 8080 | Node.js running `dist/index.mjs` |
| Mockup | 8081 | Dev preview only |

**Health check:** `GET /api/healthz`

### Standalone Deployment (Post-Replit)

#### Option A: Single Server with Reverse Proxy

```
Nginx/Caddy
├── / → static files (dist/public)
└── /api → proxy to localhost:8080
```

#### Option B: Separate Hosting

- **Frontend:** Vercel, Netlify, Cloudflare Pages (with `/api` proxy rewrite)
- **API:** Railway, Render, Fly.io, AWS ECS
- **Database:** Managed PostgreSQL (Neon, Supabase, RDS)

#### Environment Variables for Production

```bash
DATABASE_URL=postgresql://...
PORT=8080
NODE_ENV=production
LOG_LEVEL=info

# Frontend build-time
BASE_PATH=/
```

### Post-Merge Hook

**File:** `scripts/post-merge.sh`

```bash
pnpm install --frozen-lockfile
pnpm --filter db push
```

Runs automatically on Replit after merges.

### Codegen After API Changes

```bash
# After editing lib/api-spec/openapi.yaml
pnpm --filter @workspace/api-spec run codegen
pnpm run typecheck
```

---

## 24. Complete Project Tree

Source files only (excluding `node_modules`, `.git`, `.local`, build artifacts, and compiled `dist/` output).

```
Divine-Children-Home/
├── .gitignore
├── .npmrc
├── .replit
├── .replitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── replit.md
├── SOFTWARE_HANDOVER.md
├── tsconfig.base.json
├── tsconfig.json
│
├── attached_assets/
│   ├── generated_images/
│   │   ├── about-team.jpg
│   │   ├── gallery-dining.jpg
│   │   ├── gallery-interior.jpg
│   │   ├── gallery-outdoor.jpg
│   │   ├── hero-bg.jpg
│   │   ├── news-awards.jpg
│   │   ├── news-community.jpg
│   │   └── news-training.jpg
│   └── Pasted--Divine-Children-Home-Ltd-Product-Requirements-Document_1784642018717.txt
│
├── artifacts/
│   ├── api-server/
│   │   ├── .replit-artifact/
│   │   │   └── artifact.toml
│   │   ├── build.mjs
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── app.ts
│   │       ├── index.ts
│   │       ├── lib/
│   │       │   ├── .gitkeep
│   │       │   └── logger.ts
│   │       ├── middlewares/
│   │       │   └── .gitkeep
│   │       └── routes/
│   │           ├── faqs.ts
│   │           ├── forms.ts
│   │           ├── gallery.ts
│   │           ├── health.ts
│   │           ├── index.ts
│   │           ├── jobs.ts
│   │           ├── news.ts
│   │           ├── stats.ts
│   │           └── testimonials.ts
│   │
│   ├── divine-children-home/
│   │   ├── .replit-artifact/
│   │   │   └── artifact.toml
│   │   ├── components.json
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   └── robots.txt
│   │   └── src/
│   │       ├── App.tsx
│   │       ├── main.tsx
│   │       ├── index.css
│   │       ├── components/
│   │       │   ├── back-to-top.tsx
│   │       │   ├── cookie-consent.tsx
│   │       │   ├── page-header.tsx
│   │       │   ├── scroll-to-top.tsx
│   │       │   ├── stats-section.tsx
│   │       │   ├── layout/
│   │       │   │   ├── footer.tsx
│   │       │   │   ├── header.tsx
│   │       │   │   └── layout.tsx
│   │       │   └── ui/
│   │       │       ├── accordion.tsx
│   │       │       ├── alert-dialog.tsx
│   │       │       ├── alert.tsx
│   │       │       ├── aspect-ratio.tsx
│   │       │       ├── avatar.tsx
│   │       │       ├── badge.tsx
│   │       │       ├── breadcrumb.tsx
│   │       │       ├── button-group.tsx
│   │       │       ├── button.tsx
│   │       │       ├── calendar.tsx
│   │       │       ├── card.tsx
│   │       │       ├── carousel.tsx
│   │       │       ├── chart.tsx
│   │       │       ├── checkbox.tsx
│   │       │       ├── collapsible.tsx
│   │       │       ├── command.tsx
│   │       │       ├── context-menu.tsx
│   │       │       ├── dialog.tsx
│   │       │       ├── drawer.tsx
│   │       │       ├── dropdown-menu.tsx
│   │       │       ├── empty.tsx
│   │       │       ├── field.tsx
│   │       │       ├── form.tsx
│   │       │       ├── hover-card.tsx
│   │       │       ├── input-group.tsx
│   │       │       ├── input-otp.tsx
│   │       │       ├── input.tsx
│   │       │       ├── item.tsx
│   │       │       ├── kbd.tsx
│   │       │       ├── label.tsx
│   │       │       ├── menubar.tsx
│   │       │       ├── navigation-menu.tsx
│   │       │       ├── pagination.tsx
│   │       │       ├── popover.tsx
│   │       │       ├── progress.tsx
│   │       │       ├── radio-group.tsx
│   │       │       ├── resizable.tsx
│   │       │       ├── scroll-area.tsx
│   │       │       ├── select.tsx
│   │       │       ├── separator.tsx
│   │       │       ├── sheet.tsx
│   │       │       ├── sidebar.tsx
│   │       │       ├── skeleton.tsx
│   │       │       ├── slider.tsx
│   │       │       ├── sonner.tsx
│   │       │       ├── spinner.tsx
│   │       │       ├── switch.tsx
│   │       │       ├── table.tsx
│   │       │       ├── tabs.tsx
│   │       │       ├── textarea.tsx
│   │       │       ├── toast.tsx
│   │       │       ├── toaster.tsx
│   │       │       ├── toggle-group.tsx
│   │       │       ├── toggle.tsx
│   │       │       └── tooltip.tsx
│   │       ├── hooks/
│   │       │   ├── use-mobile.tsx
│   │       │   └── use-toast.ts
│   │       ├── lib/
│   │       │   └── utils.ts
│   │       └── pages/
│   │           ├── about.tsx
│   │           ├── careers.tsx
│   │           ├── contact.tsx
│   │           ├── faqs.tsx
│   │           ├── gallery.tsx
│   │           ├── home.tsx
│   │           ├── homes.tsx
│   │           ├── legal.tsx
│   │           ├── news-article.tsx
│   │           ├── news.tsx
│   │           ├── not-found.tsx
│   │           ├── referral.tsx
│   │           ├── resources.tsx
│   │           ├── safeguarding.tsx
│   │           └── services.tsx
│   │
│   └── mockup-sandbox/
│       ├── .replit-artifact/
│       │   └── artifact.toml
│       ├── components.json
│       ├── index.html
│       ├── mockupPreviewPlugin.ts
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── src/
│           ├── App.tsx
│           ├── main.tsx
│           ├── index.css
│           ├── .generated/
│           │   └── mockup-components.ts
│           ├── components/ui/          # (55 shadcn components, same as frontend)
│           ├── hooks/
│           │   ├── use-mobile.tsx
│           │   └── use-toast.ts
│           └── lib/
│               └── utils.ts
│
├── lib/
│   ├── api-client-react/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── custom-fetch.ts
│   │       ├── index.ts
│   │       └── generated/
│   │           ├── api.schemas.ts
│   │           └── api.ts
│   │
│   ├── api-spec/
│   │   ├── openapi.yaml
│   │   ├── orval.config.ts
│   │   └── package.json
│   │
│   ├── api-zod/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       └── generated/
│   │           ├── api.ts
│   │           └── types/
│   │               ├── careerApplicationInput.ts
│   │               ├── contactInput.ts
│   │               ├── faq.ts
│   │               ├── formResponse.ts
│   │               ├── galleryImage.ts
│   │               ├── healthStatus.ts
│   │               ├── index.ts
│   │               ├── job.ts
│   │               ├── newsArticle.ts
│   │               ├── newsletterInput.ts
│   │               ├── referralInput.ts
│   │               ├── siteStats.ts
│   │               └── testimonial.ts
│   │
│   └── db/
│       ├── drizzle.config.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           └── schema/
│               ├── faqs.ts
│               ├── forms.ts
│               ├── gallery.ts
│               ├── index.ts
│               ├── jobs.ts
│               ├── news.ts
│               └── testimonials.ts
│
└── scripts/
    ├── package.json
    ├── post-merge.sh
    ├── tsconfig.json
    └── src/
        └── hello.ts
```

---

## Appendix A: Quick Reference Commands

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Run frontend dev | `PORT=23337 BASE_PATH=/ pnpm --filter @workspace/divine-children-home run dev` |
| Run API dev | `PORT=8080 DATABASE_URL=... pnpm --filter @workspace/api-server run dev` |
| Typecheck all | `pnpm run typecheck` |
| Build all | `pnpm run build` |
| Push DB schema | `pnpm --filter @workspace/db run push` |
| Regenerate API client | `pnpm --filter @workspace/api-spec run codegen` |

## Appendix B: Key File Paths

| Purpose | Path |
|---------|------|
| Router config | `artifacts/divine-children-home/src/App.tsx` |
| OpenAPI spec | `lib/api-spec/openapi.yaml` |
| DB schema | `lib/db/src/schema/` |
| Generated hooks | `lib/api-client-react/src/generated/api.ts` |
| Generated validators | `lib/api-zod/src/generated/api.ts` |
| Vite config | `artifacts/divine-children-home/vite.config.ts` |
| Global styles | `artifacts/divine-children-home/src/index.css` |
| Replit config | `.replit` |
| Operational docs | `replit.md` |
| PRD | `attached_assets/Pasted--Divine-Children-Home-Ltd-Product-Requirements-Document_*.txt` |

---

*End of Software Handover Document*
