-- Divine Children Home Ltd — Admin CMS schema
-- Run after 001–003 in Supabase SQL Editor

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('super_admin', 'administrator', 'content_editor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'published', 'scheduled', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE workflow_status AS ENUM (
    'new', 'assigned', 'under_review', 'accepted', 'declined', 'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Admin profiles (linked to Supabase Auth)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'content_editor',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  avatar_url TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON admin_profiles (role);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_active ON admin_profiles (is_active);

-- ---------------------------------------------------------------------------
-- Extend existing content tables
-- ---------------------------------------------------------------------------

ALTER TABLE news ADD COLUMN IF NOT EXISTS status content_status NOT NULL DEFAULT 'published';
ALTER TABLE news ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE news ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE news ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS closing_date TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status content_status NOT NULL DEFAULT 'published';

ALTER TABLE gallery ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status workflow_status NOT NULL DEFAULT 'new';
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

ALTER TABLE referral_submissions ADD COLUMN IF NOT EXISTS status workflow_status NOT NULL DEFAULT 'new';
ALTER TABLE referral_submissions ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);
ALTER TABLE referral_submissions ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE referral_submissions ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS status workflow_status NOT NULL DEFAULT 'new';
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS cv_filename TEXT;
ALTER TABLE career_applications ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- ---------------------------------------------------------------------------
-- New CMS tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS homes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  services TEXT[] NOT NULL DEFAULT '{}',
  facilities TEXT[] NOT NULL DEFAULT '{}',
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  status content_status NOT NULL DEFAULT 'published',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Heart',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status content_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type TEXT,
  status content_status NOT NULL DEFAULT 'published',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_sections (
  id SERIAL PRIMARY KEY,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE (page_key, section_key)
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS seo_metadata (
  path TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  canonical_url TEXT,
  og_image_url TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  robots TEXT DEFAULT 'index, follow',
  structured_data JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS url_redirects (
  id SERIAL PRIMARY KEY,
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  bucket TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  folder TEXT NOT NULL DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs (user_id);

CREATE TABLE IF NOT EXISTS admin_notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_user ON admin_notifications (user_id, is_read);

CREATE TABLE IF NOT EXISTS referral_comments (
  id SERIAL PRIMARY KEY,
  referral_id INTEGER NOT NULL REFERENCES referral_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_attachments (
  id SERIAL PRIMARY KEY,
  referral_id INTEGER NOT NULL REFERENCES referral_submissions(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Helper: check admin role
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
      AND is_active = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.admin_role()
RETURNS admin_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM admin_profiles
  WHERE id = auth.uid() AND is_active = TRUE
  LIMIT 1;
$$;

-- ---------------------------------------------------------------------------
-- RLS — admin profiles
-- ---------------------------------------------------------------------------

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read own profile" ON admin_profiles;
CREATE POLICY "Admins read own profile"
  ON admin_profiles FOR SELECT
  USING (id = auth.uid() OR public.admin_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins manage profiles" ON admin_profiles;
CREATE POLICY "Super admins manage profiles"
  ON admin_profiles FOR ALL
  USING (public.admin_role() = 'super_admin')
  WITH CHECK (public.admin_role() = 'super_admin');

-- ---------------------------------------------------------------------------
-- RLS — CMS tables (admin via authenticated JWT)
-- ---------------------------------------------------------------------------

ALTER TABLE homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_attachments ENABLE ROW LEVEL SECURITY;

-- Public read for published content
DROP POLICY IF EXISTS "Public read published homes" ON homes;
CREATE POLICY "Public read published homes"
  ON homes FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read published services" ON services;
CREATE POLICY "Public read published services"
  ON services FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read published resources" ON resources;
CREATE POLICY "Public read published resources"
  ON resources FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public read active page sections" ON page_sections;
CREATE POLICY "Public read active page sections"
  ON page_sections FOR SELECT USING (is_active = TRUE);

-- Admin full access on CMS tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'homes', 'services', 'resources', 'page_sections', 'site_settings',
    'seo_metadata', 'url_redirects', 'media_files', 'audit_logs',
    'admin_notifications', 'referral_comments', 'referral_attachments'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin manage %I" ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY "Admin manage %I" ON %I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())',
      t, t
    );
  END LOOP;
END $$;

-- Public news: only published (update existing policy)
DROP POLICY IF EXISTS "Public read news" ON news;
CREATE POLICY "Public read published news"
  ON news FOR SELECT
  USING (status = 'published' AND (scheduled_at IS NULL OR scheduled_at <= NOW()));

DROP POLICY IF EXISTS "Public read approved testimonials" ON testimonials;
CREATE POLICY "Public read approved testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = TRUE);

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents', 'documents', TRUE, 20971520, ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  ('cvs', 'cvs', FALSE, 10485760, ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  ('attachments', 'attachments', FALSE, 20971520, ARRAY[
    'application/pdf', 'image/jpeg', 'image/png', 'image/webp'
  ]),
  ('media', 'media', TRUE, 10485760, ARRAY[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'
  ])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read media bucket" ON storage.objects;
CREATE POLICY "Public read media bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('images', 'media', 'documents'));

DROP POLICY IF EXISTS "Admin upload storage" ON storage.objects;
CREATE POLICY "Admin upload storage"
  ON storage.objects FOR ALL
  USING (bucket_id IN ('images', 'media', 'documents', 'cvs', 'attachments') AND public.is_admin())
  WITH CHECK (bucket_id IN ('images', 'media', 'documents', 'cvs', 'attachments') AND public.is_admin());

-- ---------------------------------------------------------------------------
-- Default site settings & page sections
-- ---------------------------------------------------------------------------

INSERT INTO site_settings (key, value) VALUES
  ('company', '{"name":"Divine Children Home Ltd","phone":"0800 123 4567","email":"referrals@divinechildrenhome.co.uk","address":"United Kingdom"}'),
  ('social', '{"facebook":"","twitter":"","linkedin":"","instagram":""}'),
  ('analytics', '{"googleAnalyticsId":"","googleTagManagerId":""}'),
  ('branding', '{"primaryColor":"#123B6D","accentColor":"#F39C12","logoUrl":"","faviconUrl":"/favicon.svg"}'),
  ('footer', '{"tagline":"Premium residential care for children and young people.","copyright":"Divine Children Home Ltd"}'),
  ('cookie_banner', '{"enabled":true,"message":"We use cookies to improve your experience.","policyUrl":"/cookies"}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO page_sections (page_key, section_key, title, content, sort_order) VALUES
  ('homepage', 'hero', 'Hero', '{"headline":"Premium Residential Care","subheadline":"Creating safe, nurturing environments where children thrive","ctaPrimary":"Make a Referral","ctaSecondary":"Learn More"}', 1),
  ('homepage', 'stats', 'Statistics', '{"intro":"Our impact in numbers"}', 2),
  ('homepage', 'cta', 'Call to Action', '{"title":"Ready to make a referral?","description":"Our placement team is available 24/7 for urgent enquiries.","buttonText":"Contact Us"}', 3),
  ('about', 'story', 'Our Story', '{"content":"Divine Children Home Ltd provides outstanding residential care across the UK."}', 1),
  ('about', 'mission', 'Mission', '{"content":"To deliver safe, therapeutic, child-centred care that enables every young person to reach their potential."}', 2),
  ('about', 'vision', 'Vision', '{"content":"To be the leading provider of premium residential care, recognised for excellence and innovation."}', 3),
  ('about', 'values', 'Values', '{"items":["Compassion","Integrity","Excellence","Safety","Respect"]}', 4)
ON CONFLICT (page_key, section_key) DO NOTHING;

INSERT INTO seo_metadata (path, title, description) VALUES
  ('/', 'Divine Children Home Ltd | Premium Residential Care', 'Premium residential care for children and young people across the UK.'),
  ('/about', 'About Us | Divine Children Home Ltd', 'Learn about our mission, values, and commitment to outstanding care.'),
  ('/contact', 'Contact Us | Divine Children Home Ltd', 'Get in touch with our placement team.')
ON CONFLICT (path) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Seed first super admin (replace UUID after creating auth user in dashboard)
-- Instructions: create user in Supabase Auth, then:
-- INSERT INTO admin_profiles (id, email, full_name, role) VALUES ('<uuid>', 'admin@example.com', 'Super Admin', 'super_admin');
