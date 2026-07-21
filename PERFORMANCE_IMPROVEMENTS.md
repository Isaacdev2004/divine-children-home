# Performance Improvements Report

**Divine Children Home Ltd · Phase 4**  
**Date:** July 2026

---

## Summary

Performance optimisations focused on **perceived speed**, **network efficiency**, and **respecting user preferences** without changing application architecture (still Vite SPA + lazy routes).

---

## Implemented Improvements

### Images

| Change | Benefit |
|--------|---------|
| `loading="lazy"` on news card images | Defers off-screen image loads |
| `loading="lazy"` on footer Ofsted logo | Reduces initial payload |
| `decoding="async"` on lazy images | Non-blocking decode |
| Hero remains CSS background from bundled asset | Predictable LCP, no layout shift |

### JavaScript

| Area | Status |
|------|--------|
| Route lazy loading | Already in `routes.tsx` — retained |
| Testimonials fetch | Same query as before; now renders (no extra request) |
| `useListJobs()` on contact | Small payload; acceptable for job prefill |
| Framer Motion | Tree-shaken per import; reduced-motion disables animations |

### Fonts

- Google Fonts loaded via `@import` in CSS (Inter + Poppins, limited weights)
- **Recommendation:** Self-host fonts or use `font-display: swap` link params for faster FCP

### Network

| Request | Notes |
|---------|-------|
| API calls | React Query caching unchanged |
| External map URL | Placeholder only — not loaded functionally |
| Wikimedia Ofsted logo | Lazy loaded; consider local asset |

### Re-renders

- Form success state uses local `useState` — minimal re-render scope
- `usePageMeta` runs once per route change via `useEffect`
- No unnecessary context providers added

### Motion & CPU

- `prefers-reduced-motion` reduces GPU/CPU from animations site-wide
- Scroll listeners use `{ passive: true }` on BackToTop

---

## Bundle Analysis (recommendations)

Run locally:

```bash
pnpm --filter @workspace/divine-children-home run build
npx vite-bundle-visualizer
```

### Expected heavy dependencies

| Package | Notes |
|---------|-------|
| framer-motion | Used on marketing pages — consider `LazyMotion` if bundle grows |
| date-fns | Tree-shakeable — import specific functions only (already done) |
| lucide-react | Icon-level imports — good |

### Future optimisations

1. **Self-host fonts** — remove render-blocking `@import`
2. **Preload hero image** — `<link rel="preload" as="image">` in index.html
3. **Responsive images** — `srcset` when CMS provides multiple sizes
4. **API pagination** — news list if catalogue grows beyond 20 items
5. **Service worker** — optional offline shell for repeat visitors

---

## Core Web Vitals (estimated)

| Metric | Risk | Mitigation |
|--------|------|------------|
| LCP | Medium | Hero is large; preload hero-bg.jpg |
| INP | Low | Minimal main-thread work on interaction |
| CLS | Low | Skeleton loaders match card dimensions |
| FCP | Medium | Font @import — self-host recommended |

---

## Route Loading

Public routes remain code-split via `React.lazy`. Admin routes separate in `/admin/*` — no impact on public bundle.

---

## Verification

```bash
cd artifacts/divine-children-home
pnpm run build    # Verify production build succeeds
pnpm run typecheck
```

Lighthouse audit recommended on `/`, `/referral`, and `/contact` at mobile viewport after deploy.

---

## Conclusion

Phase 4 delivered **targeted, low-risk performance wins**. Largest future gain is font loading strategy and hero image preload. No functionality was sacrificed for performance.
