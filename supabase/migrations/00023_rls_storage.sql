-- Migration 00023: Storage buckets + RLS policies

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('lecture-notes',        'lecture-notes',        false, 104857600,
   ARRAY['application/pdf','text/markdown','text/plain']),
  ('doubt-attachments',    'doubt-attachments',    false, 52428800,
   ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('project-submissions',  'project-submissions',  false, 524288000,
   ARRAY['application/zip','application/x-zip-compressed']),
  ('avatars',              'avatars',              true,  5242880,
   ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- lecture-notes: instructor uploads, enrolled reads
CREATE POLICY "lecture_notes_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lecture-notes'
    AND public.is_course_instructor(
      (storage.foldername(name))[1]::uuid
    )
  );

CREATE POLICY "lecture_notes_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lecture-notes'
    AND (
      public.is_enrolled((storage.foldername(name))[1]::uuid)
      OR public.is_course_instructor((storage.foldername(name))[1]::uuid)
    )
  );

-- doubt-attachments: enrolled student own files
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
      OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT')
    )
  );

-- project-submissions: team member uploads
CREATE POLICY "project_submissions_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-submissions'
    AND EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = (storage.foldername(name))[3]::uuid
        AND student_id = auth.uid()
    )
  );

CREATE POLICY "project_submissions_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-submissions'
    AND (
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = (storage.foldername(name))[3]::uuid
          AND student_id = auth.uid()
      )
      OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT')
    )
  );

-- avatars: public read, own write
CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
