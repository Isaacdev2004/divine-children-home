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
