-- ============================================================
-- Migration 00008: Supabase Storage Buckets + RLS
-- ============================================================
-- NOTE: Run this in Supabase SQL Editor (dashboard) or via CLI.
-- The storage schema is managed by Supabase; we create buckets
-- and policies using the storage API functions.

-- ---- Buckets ----
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',     'avatars',     TRUE,  2097152,   ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('resources',   'resources',   FALSE, 52428800,  ARRAY['application/pdf','application/zip','text/plain','text/markdown','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('submissions', 'submissions', FALSE, 10485760,  NULL),
  ('course-media','course-media',FALSE, 104857600, ARRAY['video/mp4','video/webm','image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE RLS: avatars (public read, own write)
-- ============================================================
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_auth_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_auth_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_auth_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- ============================================================
-- STORAGE RLS: resources (enrolled/instructor read, instructor upload)
-- ============================================================
CREATE POLICY "resources_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resources'
    AND (
      public.is_enrolled((storage.foldername(name))[1]::UUID)
      OR public.is_instructor((storage.foldername(name))[1]::UUID)
    )
  );

CREATE POLICY "resources_instructor_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resources'
    AND public.is_instructor((storage.foldername(name))[1]::UUID)
  );

CREATE POLICY "resources_instructor_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resources'
    AND public.is_instructor((storage.foldername(name))[1]::UUID)
  );

-- ============================================================
-- STORAGE RLS: submissions (own student, instructor read)
-- ============================================================
CREATE POLICY "submissions_own_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'submissions'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "submissions_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'submissions'
    AND (
      auth.uid()::TEXT = (storage.foldername(name))[1]
      OR public.is_instructor((storage.foldername(name))[2]::UUID)
    )
  );
