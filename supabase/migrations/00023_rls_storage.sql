-- Migration: 00023_rls_storage
-- Supabase Storage bucket RLS policies
-- NOTE: Buckets must be created manually in the Supabase Dashboard or via CLI.
-- This migration sets up the RLS policies for storage.objects.

-- lecture-notes bucket: INSERT — instructor of course; SELECT — enrolled or instructor
CREATE POLICY "lecture_notes_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lecture-notes'
    AND public.current_user_role() = 'INSTRUCTOR'
  );

CREATE POLICY "lecture_notes_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lecture-notes'
    AND (
      public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
    )
  );

-- doubt-attachments bucket
CREATE POLICY "doubt_attachments_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'doubt-attachments'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

CREATE POLICY "doubt_attachments_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'doubt-attachments'
    AND (
      auth.uid()::text = (storage.foldername(name))[2]
      OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
    )
  );

-- project-submissions bucket
CREATE POLICY "project_submissions_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-submissions'
    AND EXISTS (
      SELECT 1 FROM public.team_members
      WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "project_submissions_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-submissions'
    AND (
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE student_id = auth.uid()
      )
      OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
    )
  );

-- avatars bucket (public)
CREATE POLICY "avatars_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
