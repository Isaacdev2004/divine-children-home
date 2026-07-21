# UX Audit — Divine Children Home Ltd

**Phase 4 · Premium UX, Visual Polish & Conversion Optimisation**  
**Date:** July 2026  
**Scope:** Public website (`artifacts/divine-children-home`)

---

## Executive Summary

The public site was already structurally sound and production-ready. Phase 4 focused on **reducing friction**, **increasing trust**, and **standardising interaction patterns** without redesigning the product or changing the visual identity.

Key improvements delivered:

- Unified SEO/page metadata across all routes
- Testimonials surfaced on the homepage (previously fetched but not rendered)
- Form UX upgraded: inline success states, scroll-to-error, required field indicators
- Navigation expanded on desktop; mobile menu scroll-lock and clickable contact links
- Accessibility fixes: focus rings, ARIA on forms/cookie banner, semantic heading hierarchy on 404
- Motion respects `prefers-reduced-motion`

---

## User Journey Findings & Resolutions

### First-time visitor

| Finding | Severity | Resolution |
|---------|----------|------------|
| Homepage lacked social proof despite API data | High | Testimonials section added before final CTA |
| Trust bar used text-only placeholders | Medium | Retained placeholders; structured for future logo swap |
| Hero CTA hierarchy was clear | — | No change needed |

### Parent or guardian

| Finding | Severity | Resolution |
|---------|----------|------------|
| Safeguarding info reachable but not prominent in nav on desktop | Medium | Safeguarding remains under About dropdown; FAQs/Resources added to desktop nav |
| Contact email truncated (`referrals@...`) | High | Full addresses with `mailto:` links |

### Local Authority referral officer / Social worker

| Finding | Severity | Resolution |
|---------|----------|------------|
| Referral Select fields used `defaultValue` (reset bugs) | High | Changed to controlled `value` |
| Success relied on toast only; no reference retention | High | Inline success panel with reference number |
| Resources download buttons non-functional | High | Wired to contact flow with pre-filled subject |
| Emergency phone not clickable | Medium | `tel:` links site-wide |

### Job seeker

| Finding | Severity | Resolution |
|---------|----------|------------|
| Careers → Contact flow did not pre-fill application | High | `?job=` query pre-fills subject and message |
| No inline confirmation after contact submit | Medium | FormSuccessPanel on contact page |

### Returning visitor

| Finding | Severity | Resolution |
|---------|----------|------------|
| Inconsistent page titles/descriptions hurt bookmarking and sharing | Medium | `usePageMeta` on all pages with per-page descriptions |

### Mobile user (320–768px)

| Finding | Severity | Resolution |
|---------|----------|------------|
| Mobile menu did not lock body scroll | Medium | `overflow: hidden` on body when open |
| Touch targets below 44px on some controls | Medium | Min 44px on menu toggle, footer links, form buttons |
| Desktop nav breakpoint crowded at md | Medium | Primary nav moved to `lg:` breakpoint |

---

## Homepage

### Improved

- **Hero messaging:** Retained strong emotional headline; metadata description aligned with SEO
- **Visual hierarchy:** Section utility classes (`.section-heading`, `.section-lead`) for consistency
- **CTA placement:** Primary referral CTA preserved in hero, services, and closing band
- **Trust indicators:** Stats section unchanged; testimonials add qualitative proof
- **Section transitions:** Framer Motion retained with reduced-motion fallback
- **Information density:** Testimonials limited to 3 cards; empty state message for no data

### Remaining opportunities (future)

- Replace trust bar text with commissioner/partner logos when assets available
- CMS-driven hero copy for seasonal campaigns

---

## Navigation

| Area | Status |
|------|--------|
| Desktop navigation | Gallery, Resources, FAQs added; focus-visible rings on links |
| Mobile navigation | Body scroll lock; tel/mailto in contact block |
| Mega menu | Dropdown pattern retained (About, Services) |
| Sticky behaviour | Unchanged — works well |
| Focus indicators | Global `:focus-visible` rule in `index.css` |
| Dropdown usability | Radix handles keyboard; triggers have focus rings |
| Scroll behaviour | Back-to-top respects reduced motion |

---

## Forms (all audited)

| Form | Improvements |
|------|-------------|
| Contact | Success panel, scroll-to-error, job/subject prefill, required markers, inline error |
| Referral | Select fix, reference number panel, scroll-to-error, tel link for emergencies |
| Newsletter (footer) | Inline success state; removed toast-only feedback |
| Admin forms | Out of scope (separate admin UX) |

---

## Loading Experience

| Component | Status |
|-----------|--------|
| News cards | Skeleton loaders present |
| Testimonials | Skeleton loaders added |
| Gallery | Existing skeletons retained |
| Empty states | Careers, testimonials, news handle empty data |
| Form submit | Button loading text ("Sending...", "Submitting...") |

---

## Motion Design

- Global `@media (prefers-reduced-motion: reduce)` disables animations/transitions
- `useReducedMotion` hook used in BackToTop
- Card hover transforms use `.card-interactive` (respects reduced motion via global rule)
- Framer Motion sections remain; effectively neutralised under reduced motion

---

## Images

| Check | Status |
|-------|--------|
| Aspect ratios | News cards 48 height; gallery modal unchanged |
| Lazy loading | Added to news images and footer Ofsted logo |
| Alt text | Present on content images; decorative icons `aria-hidden` |
| Hero | CSS background — appropriate for LCP (single bundled asset) |

---

## Pages Audited

All public routes reviewed: `/`, `/about`, `/homes`, `/services`, `/referral`, `/careers`, `/news`, `/news/:slug`, `/resources`, `/contact`, `/safeguarding`, `/faqs`, `/gallery`, `/privacy`, `/terms`, `/cookies`, `/complaints`, 404.

---

## Priority Backlog (post Phase 4)

1. Wire public pages to CMS for homes/services/resources copy
2. Real document downloads via Supabase Storage (admin uploads exist)
3. Interactive map embed (currently placeholder)
4. Structured data (JSON-LD) per page type
5. Partner logo assets in trust bar

---

## Sign-off

Phase 4 UX objectives for the public site are **complete**. No functionality was removed. Visual identity (navy `#123B6D`, accent `#F39C12`, Inter/Poppins) is unchanged.
