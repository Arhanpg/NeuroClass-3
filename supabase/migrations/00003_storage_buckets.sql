-- Storage buckets for NeuroClass
-- Run this after 00002_core_schema.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('lecture-notes', 'lecture-notes', false, 52428800, ARRAY['application/pdf', 'text/markdown', 'text/plain']),
  ('project-artifacts', 'project-artifacts', false, 104857600, ARRAY['application/zip', 'application/x-zip-compressed']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ========= LECTURE NOTES bucket policies =========
CREATE POLICY "lecture-notes: instructor upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lecture-notes' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "lecture-notes: enrolled can download"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lecture-notes' AND auth.role() = 'authenticated');

-- ========= AVATARS bucket policies =========
CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars: owner upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars: owner update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
