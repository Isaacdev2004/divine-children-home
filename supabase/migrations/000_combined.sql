-- Divine Children Home Ltd — ALL migrations combined
-- Run this entire file once in Supabase Dashboard → SQL Editor
-- ---------------------------------------------------------------------------

-- Divine Children Home Ltd — initial Supabase schema
-- Run in Supabase SQL Editor or via supabase db push

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  salary TEXT NOT NULL,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url TEXT NOT NULL,
  author TEXT
);

CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  organisation TEXT NOT NULL,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  caption TEXT
);

CREATE TABLE IF NOT EXISTS site_stats (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  years_experience INTEGER NOT NULL,
  children_supported INTEGER NOT NULL,
  staff_members INTEGER NOT NULL,
  homes_operating INTEGER NOT NULL,
  ofsted_rating TEXT NOT NULL,
  success_rate INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- Form submission tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  organisation TEXT,
  reference_number TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_submissions (
  id SERIAL PRIMARY KEY,
  referrer_name TEXT NOT NULL,
  referrer_role TEXT NOT NULL,
  referrer_organisation TEXT NOT NULL,
  referrer_email TEXT NOT NULL,
  referrer_phone TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  child_gender TEXT NOT NULL,
  local_authority TEXT NOT NULL,
  placement_type TEXT NOT NULL,
  urgency TEXT NOT NULL,
  support_needs TEXT NOT NULL,
  additional_info TEXT,
  reference_number TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_applications (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  cover_letter TEXT NOT NULL,
  experience TEXT,
  qualifications TEXT,
  right_to_work BOOLEAN NOT NULL,
  reference_number TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs (is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs (posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news (slug);
CREATE INDEX IF NOT EXISTS idx_faqs_category_sort ON faqs (category, sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery (category);
CREATE INDEX IF NOT EXISTS idx_contact_reference ON contact_submissions (reference_number);
CREATE INDEX IF NOT EXISTS idx_referral_reference ON referral_submissions (reference_number);
CREATE INDEX IF NOT EXISTS idx_career_reference ON career_applications (reference_number);

-- ---------------------------------------------------------------------------
-- Row Level Security — public read for published content
-- ---------------------------------------------------------------------------

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active jobs"
  ON jobs FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Public read news"
  ON news FOR SELECT
  USING (TRUE);

CREATE POLICY "Public read faqs"
  ON faqs FOR SELECT
  USING (TRUE);

CREATE POLICY "Public read testimonials"
  ON testimonials FOR SELECT
  USING (TRUE);

CREATE POLICY "Public read gallery"
  ON gallery FOR SELECT
  USING (TRUE);

CREATE POLICY "Public read site stats"
  ON site_stats FOR SELECT
  USING (TRUE);

-- Form tables: no public policies (API uses service role key)
-- Supabase Storage configuration for site images

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  TRUE,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read access for image assets
DROP POLICY IF EXISTS "Public read images bucket" ON storage.objects;
CREATE POLICY "Public read images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Authenticated/service uploads are handled via service role key in the API
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
