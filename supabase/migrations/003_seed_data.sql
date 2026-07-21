-- Seed default homepage statistics and sample content (optional)

INSERT INTO site_stats (
  id,
  years_experience,
  children_supported,
  staff_members,
  homes_operating,
  ofsted_rating,
  success_rate
) VALUES (
  1,
  10,
  250,
  85,
  6,
  'Good',
  94
)
ON CONFLICT (id) DO UPDATE SET
  years_experience = EXCLUDED.years_experience,
  children_supported = EXCLUDED.children_supported,
  staff_members = EXCLUDED.staff_members,
  homes_operating = EXCLUDED.homes_operating,
  ofsted_rating = EXCLUDED.ofsted_rating,
  success_rate = EXCLUDED.success_rate;

-- Sample FAQ (safe to re-run: only inserts when table is empty)
INSERT INTO faqs (question, answer, category, sort_order)
SELECT
  'How do I make a referral?',
  'Use our online referral form or contact our placement team directly. Urgent referrals are reviewed within 2 hours.',
  'Referrals',
  1
WHERE NOT EXISTS (SELECT 1 FROM faqs LIMIT 1);

-- Sample testimonial
INSERT INTO testimonials (name, role, organisation, quote, rating)
SELECT
  'Sarah Mitchell',
  'Social Worker',
  'Local Authority',
  'Divine Children Home provides outstanding care with a truly child-centred approach.',
  5
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
