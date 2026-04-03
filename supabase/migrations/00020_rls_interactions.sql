-- Migration: 00020_rls_interactions
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE POLICY "interactions_select"
  ON public.interactions FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_course_instructor(course_id)
    OR public.is_enrolled(course_id)
    OR public.current_user_role() = 'ADMIN'
  );

CREATE POLICY "interactions_insert"
  ON public.interactions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND (public.is_enrolled(course_id) OR public.is_course_instructor(course_id))
  );

CREATE POLICY "interactions_update"
  ON public.interactions FOR UPDATE
  USING (
    user_id = auth.uid()
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() = 'ADMIN'
  );
