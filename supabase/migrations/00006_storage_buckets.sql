-- Migration: 00006_storage_buckets
-- Creates storage buckets for lecture uploads and profile avatars

-- Lecture materials bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lecture-materials',
  'lecture-materials',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'text/markdown', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Profile avatars bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Storage RLS Policies: lecture-materials
-- ============================================================
-- Instructors can upload to their course folder
DROP POLICY IF EXISTS "lecture_materials_insert" ON storage.objects;
CREATE POLICY "lecture_materials_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'lecture-materials'
    AND public.current_user_role() = 'INSTRUCTOR'
  );

-- Enrolled students and course instructor can read
DROP POLICY IF EXISTS "lecture_materials_select" ON storage.objects;
CREATE POLICY "lecture_materials_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'lecture-materials'
    AND (
      public.current_user_role() = 'INSTRUCTOR'
      OR public.current_user_role() IN ('ADMIN', 'TEACHING_ASSISTANT')
    )
  );

-- Instructor can delete their own lecture files
DROP POLICY IF EXISTS "lecture_materials_delete" ON storage.objects;
CREATE POLICY "lecture_materials_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'lecture-materials'
    AND public.current_user_role() = 'INSTRUCTOR'
  );

-- ============================================================
-- Storage RLS Policies: avatars
-- ============================================================
DROP POLICY IF EXISTS "avatars_insert" ON storage.objects;
CREATE POLICY "avatars_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "avatars_update" ON storage.objects;
CREATE POLICY "avatars_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "avatars_delete" ON storage.objects;
CREATE POLICY "avatars_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "avatars_select_public" ON storage.objects;
CREATE POLICY "avatars_select_public" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');
