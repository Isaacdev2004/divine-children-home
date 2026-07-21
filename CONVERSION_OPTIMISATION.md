# Conversion Optimisation Report

**Divine Children Home Ltd · Phase 4**  
**Date:** July 2026  
**Goal:** Increase referral submissions, career applications, and contact enquiries without adding friction

---

## Conversion Funnel Overview

```
Homepage → Referral / Contact / Careers
    ↓
Referral form (LA officers)     Contact form (general / careers)
    ↓                                  ↓
Reference number + follow-up      Inline confirmation + email
```

---

## CTA Audit & Changes

### Primary conversion: Make a Referral

| Location | Copy | Status |
|----------|------|--------|
| Header top bar | "Make a Referral" | Unchanged — high visibility |
| Header CTA button | "Make a Referral" | Unchanged |
| Hero | "Make a Referral" | Primary accent button |
| Services section | Per-card "Learn more" | Links to anchored services |
| Closing band | "Make a Referral Now" | Strong urgency copy |
| Footer services | Accent link | Added visual weight |

**Improvements:**
- Emergency phone on referral sidebar is now clickable (`tel:`)
- Success panel displays **reference number** — reduces anxiety and support calls
- Select field bug fixed — prevents drop-off from broken form state

### Secondary conversion: Contact

| Location | Copy | Status |
|----------|------|--------|
| Hero secondary | "Discover Our Approach" | Routes to About |
| Header | "Contact" | Desktop nav expanded |
| Closing band | "Contact Our Team" | Paired with referral |
| Footer | Full contact block | tel/mailto links |

**Improvements:**
- Inline success panel replaces toast-only confirmation
- Careers apply flow: `/contact?job={id}` pre-fills application
- Resources: download → `/contact?subject=Document request: ...`
- Truncated email fixed — full addresses visible

### Tertiary conversion: Careers

| Location | Copy | Status |
|----------|------|--------|
| Header top bar | "Join Our Team" | Links to /careers |
| About dropdown | Careers | Unchanged |
| Job cards | "Apply for this role" | Links to pre-filled contact |

**Improvements:**
- Application subject and message auto-generated from job listing
- Empty state CTA to contact when no vacancies

---

## Friction Reduction

| Before | After | Impact |
|--------|-------|--------|
| Form errors only in toast | Scroll + focus first error | Fewer abandonments |
| Referral success in toast only | Persistent success panel with reference | Higher completion confidence |
| Resource downloads dead ends | Contact with pre-filled subject | Captures intent |
| Phone numbers plain text | Click-to-call | Mobile conversion ↑ |
| No testimonials on homepage | Social proof section | Trust ↑ for commissioners |

---

## Copywriting Refinements (UK tone)

- En dash used in office hours ("Monday – Friday")
- Apostrophe encoding fixed (`child's`, `person's`)
- Cookie banner: British spelling ("analyse")
- Emergency messaging emphasises 2-hour response for urgent referrals

---

## CTA Frequency Balance

The site maintains **3 referral entry points** on homepage (hero, implicit via services, closing band) without feeling aggressive — appropriate for a B2B/B2G care provider where referral is the primary business action.

Contact and referral CTAs are **contextual** rather than pop-up driven (no interstitials added).

---

## Metrics to Track (post-launch)

| Metric | Tool suggestion |
|--------|-----------------|
| Referral form completion rate | Analytics event on FormSuccessPanel mount |
| Contact form completion | Same |
| Careers apply clicks | Track `/contact?job=` arrivals |
| Tel link clicks | `tel:` click events |
| Bounce rate on /referral | GA4 landing page report |
| Time to first CTA click | Hotjar / Clarity |

---

## A/B Test Ideas (future)

1. Hero secondary CTA: "Speak to Admissions" → `/contact` vs `/about`
2. Trust bar: logos vs icon+text
3. Referral sidebar: sticky on scroll (desktop)
4. Closing band: single CTA vs dual

---

## Conclusion

Conversion paths are **clearer, more trustworthy, and less error-prone**. The highest-impact changes are referral form reliability, success state visibility, and careers-to-contact prefill.
