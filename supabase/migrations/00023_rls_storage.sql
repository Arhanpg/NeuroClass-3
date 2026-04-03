-- Migration: 00023_rls_storage
-- Supabase Storage bucket policies
-- Run this AFTER creating buckets in the dashboard or via CLI

-- Create storage buckets (idempotent via SQL)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('lecture-files', 'lecture-files', false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('submission-artifacts', 'submission-artifacts', false)
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;

-- Lecture files: instructors upload, enrolled students read
CREATE POLICY "lecture-files: instructor upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lecture-files'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('INSTRUCTOR','ADMIN')
    )
  );

CREATE POLICY "lecture-files: enrolled read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'lecture-files'
    AND auth.role() = 'authenticated'
  );

-- Submission artifacts: team members upload
CREATE POLICY "submissions: team upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'submission-artifacts'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "submissions: instructor read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'submission-artifacts'
    AND auth.role() = 'authenticated'
  );

-- Avatars: public read, own upload
CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars: own upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
