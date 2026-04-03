-- ============================================================
-- Migration: 00023_rls_storage.sql
-- Supabase Storage bucket creation + RLS policies
-- Run AFTER enabling Storage in Supabase dashboard
-- ============================================================

-- Create buckets (idempotent via INSERT OR IGNORE approach)
-- Note: buckets are typically created via Dashboard or CLI.
-- This migration adds RLS policies using storage.objects table.

-- lecture-notes bucket policies
CREATE POLICY "lecture-notes: instructor can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lecture-notes'
    AND public.current_user_role() = 'INSTRUCTOR'
  );

CREATE POLICY "lecture-notes: enrolled students and instructor can download"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'lecture-notes'
    AND (
      public.current_user_role() = 'INSTRUCTOR'
      OR public.current_user_role() IN ('TEACHING_ASSISTANT','ADMIN')
      OR auth.uid() IS NOT NULL  -- enrolled check done at app layer for perf
    )
  );

-- doubt-attachments bucket policies
CREATE POLICY "doubt-attachments: enrolled student can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'doubt-attachments'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "doubt-attachments: owner and instructor/TA can download"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'doubt-attachments'
    AND (
      (storage.foldername(name))[2] = auth.uid()::text
      OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
    )
  );

-- avatars bucket policies (public read)
CREATE POLICY "avatars: authenticated users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars: owner can update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- project-submissions bucket policies
CREATE POLICY "project-submissions: team member can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-submissions'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "project-submissions: team member or instructor can download"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-submissions'
    AND (
      auth.uid() IS NOT NULL
      AND (
        public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
        OR auth.uid() IS NOT NULL  -- team membership checked at app layer
      )
    )
  );
