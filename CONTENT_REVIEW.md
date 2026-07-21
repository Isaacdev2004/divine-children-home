# Content Review — Divine Children Home Ltd

**Phase 4 · UK residential care tone & consistency**  
**Date:** July 2026

---

## Review Criteria

- British English spelling and punctuation
- Professional, warm, trustworthy tone appropriate for children's residential care
- Consistency across pages
- Accuracy for safeguarding/regulatory context
- No placeholder text that undermines credibility

---

## Corrections Applied

| Location | Before | After |
|----------|--------|-------|
| Contact page | `referrals@...` truncated | Full email with mailto link |
| Contact page | `Monday - Friday` | `Monday – Friday` (en dash) |
| Cookie consent | "analyze" | "analyse" |
| Referral form | Unescaped apostrophes in JSX | `person's`, `child's` entities |
| Resources | Straight apostrophe in "Children's Guide" | Typographic en dash in subtitle |
| 404 page | Two h1-level elements | Single h1 for accessibility |

---

## Tone Assessment by Page

| Page | Tone | Notes |
|------|------|-------|
| Home | Warm, confident, mission-led | Strong for first-time visitors |
| About | Professional, values-driven | Appropriate for commissioners |
| Homes | Descriptive, reassuring | "Nothing like an institution" — good differentiation |
| Services | Clear, needs-focused | EBD/CSE acronyms OK for professional audience |
| Referral | Formal, process-oriented | Data protection note well placed |
| Safeguarding | Authoritative, serious | Matches regulatory expectations |
| Careers | Motivating, supportive | Staff welfare messaging resonates |
| Contact | Helpful, accessible | Emergency guidance clear |
| FAQs | Plain language | Suitable for mixed audiences |
| Legal | Formal statutory tone | Appropriate for policies |

---

## Placeholder Content (flagged, not removed)

| Item | Location | Recommendation |
|------|----------|----------------|
| Address "123 Care Avenue, London, LDN 123" | Contact, footer | Replace with registered office before go-live |
| Phone "0800 123 4567" | Site-wide | Replace with real number |
| Google Maps static placeholder | Contact page | Embed real map or remove until ready |
| Trust bar "Trusted Partner" | Homepage | Replace with named partner or remove |
| Ofsted logo (Wikimedia) | Footer | Use official asset with permission |
| Resource PDFs | Resources page | Files not hosted — contact flow used instead |

These placeholders are **functional for demo/staging** but must be updated for production launch.

---

## Regulatory Language

- Site references **Ofsted** and **CQC** registration — ensure registrations are accurate before publication
- Safeguarding page content aligns with standard UK children's home expectations
- Referral form correctly warns against including child's full name in initial enquiry (GDPR/safeguarding)

---

## Grammar & Style Guide (recommended)

| Rule | Example |
|------|---------|
| British English | organisation, colour, analyse |
| Children and young people | Preferred over "kids" in formal copy |
| Local Authority | Capitalised when referring to LA as entity |
| En dash for ranges | 9am – 5pm |
| Avoid exclamation marks | None added in Phase 4 |

---

## Internal Linking

Added/improved cross-links:

- Resources → Contact (restricted documents)
- Resources → Contact (download requests)
- Footer → FAQs
- Header desktop → Gallery, Resources, FAQs

---

## SEO Content Alignment

Per-page meta descriptions added via `pageMeta` config — each unique, under 160 characters, action-oriented where appropriate.

---

## Conclusion

Content is **professionally appropriate** for a UK children's residential care provider. Replace placeholder contact details and trust assets before public launch. No tone-deaf or inappropriate copy identified.
