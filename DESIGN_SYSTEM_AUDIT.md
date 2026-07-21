# Design System Audit — Divine Children Home Ltd

**Phase 4 · Visual consistency & token review**  
**Date:** July 2026

---

## Design Tokens (unchanged identity)

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#123B6D` (hsl 213 72% 25%) | Headings, nav active, footer background |
| Secondary | `#4FA9DD` | Accents, category labels |
| Accent | `#F39C12` | CTAs, highlights, stars |
| Background | `#F8FAFC` | Page background |
| Foreground | `#1F2937` | Body text |
| Success | `#22C55E` | Form success states |
| Font body | Inter 400–600 | Paragraphs, UI |
| Font heading | Poppins 700–800 | h1–h6, brand |
| Radius | `0.5rem` base | Cards, buttons, inputs |

Dark mode tokens mirror light mode by design requirement.

---

## Typography System

### Base layer updates (`index.css`)

```css
h1–h6 → font-heading, tracking-tight, text-balance
p     → leading-relaxed
:focus-visible → outline-2 outline-offset-2 outline-ring
```

### New utility classes

| Class | Purpose |
|-------|---------|
| `.section-padding` | `py-16 md:py-24` — standard section vertical rhythm |
| `.section-heading` | Responsive h2 styling for section titles |
| `.section-lead` | Lead paragraph with max-width constraint |
| `.prose-width` | `max-w-prose` for readable line length |
| `.card-interactive` | Hover elevation + subtle lift |

### Responsive scale (existing, validated)

| Element | Mobile | Desktop |
|---------|--------|---------|
| Hero h1 | `text-5xl` | `text-7xl` |
| Section h2 | `text-3xl` | `text-4xl` |
| Body lead | `text-lg` | `text-lg` |
| Page header | Via `PageHeader` component | Consistent |

### Recommendations applied

- `text-balance` on headings prevents orphan words
- Lead copy capped at `max-w-3xl` for ~65 character line length
- Legal pages use `@tailwindcss/typography` prose classes

---

## Layout Consistency

| Pattern | Standard |
|---------|----------|
| Container | `container mx-auto px-4` |
| Section spacing | `py-16`–`py-24` (`.section-padding`) |
| Content max-width | `max-w-4xl` (legal), `max-w-6xl` (forms) |
| Grid gaps | `gap-6` cards, `gap-8` feature grids, `gap-12` two-column |
| Border radius | `rounded-xl` cards, `rounded-2xl` feature cards |
| Shadows | `shadow-md` default cards; `shadow-lg` forms/elevated |

---

## Cards

| Variant | Treatment |
|---------|-----------|
| Feature cards (home) | Borderless, shadow-md, `.card-interactive` |
| Process cards (referral) | Muted background, no border |
| Job cards | Hover shadow-md |
| Resource cards | Interactive border + download action |
| Testimonial cards | Quote icon, star rating, blockquote semantics |

### Hover behaviour

- `.card-interactive`: `hover:shadow-lg hover:-translate-y-0.5`
- Service tiles: group cursor + arrow translate
- News cards: image scale on hover (disabled under reduced motion)

---

## Buttons

| Variant | Use case |
|---------|----------|
| `accent` | Primary conversion (Referral, Apply, Submit) |
| `outline` | Secondary actions |
| `ghost` | Tertiary / icon actions |
| Min height | `min-h-11` (44px) on key touch targets |

---

## Forms

| Element | Standard |
|---------|----------|
| Labels | Required fields marked with red asterisk |
| Errors | `FormMessage` with `role="alert"` + `aria-live="polite"` |
| Success | `FormSuccessPanel` — green border, icon, reference optional |
| Inputs | shadcn/ui defaults; autocomplete attributes on contact form |

---

## Navigation

- Sticky header with top bar (md+) and main nav
- Breakpoint: primary links at `lg:` (was `md:`) to prevent crowding
- Active state: primary colour + bottom border
- Mobile overlay: full-height scrollable panel

---

## Footer

- 4-column grid (lg), 2-column (md), stack (mobile)
- Newsletter inline success (no toast dependency)
- Clickable tel/mailto throughout

---

## Motion tokens

```css
@media (prefers-reduced-motion: reduce) {
  animation/transition/scroll-behavior → minimal
}
```

Hook: `useReducedMotion()` for JS-controlled scroll behaviour.

---

## Component inventory

| Component | Location | Notes |
|-----------|----------|-------|
| Header | `components/layout/header.tsx` | Updated nav + a11y |
| Footer | `components/layout/footer.tsx` | Links + newsletter |
| PageHeader | `components/page-header.tsx` | Unchanged — consistent |
| FormSuccessPanel | `components/common/FormSuccessPanel.tsx` | **New** |
| StatsSection | `components/stats-section.tsx` | CMS-backed stats |
| CookieConsent | `components/cookie-consent.tsx` | Dialog semantics |
| BackToTop | `components/back-to-top.tsx` | Reduced motion aware |

---

## Gaps & future token work

1. Consolidate duplicate `@layer utilities` blocks in `index.css` (cosmetic)
2. Document spacing scale in Storybook or COMPONENT_GUIDE (optional)
3. Add `--spacing-section` CSS variable if CMS theming needed later
4. Partner logo slot component for trust bar

---

## Conclusion

The design system remains **coherent and on-brand**. Phase 4 added utility classes and interaction standards rather than new colours or typefaces. All changes are backward-compatible with existing components.
