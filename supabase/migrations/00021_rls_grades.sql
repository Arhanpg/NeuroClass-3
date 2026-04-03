-- Migration: 00021_rls_grades
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE POLICY "grades_select"
  ON public.grades FOR SELECT
  USING (
    student_id = auth.uid()
    OR public.is_course_instructor((SELECT course_id FROM public.projects WHERE id = project_id))
    OR public.current_user_role() = 'ADMIN'
  );

CREATE POLICY "grades_insert"
  ON public.grades FOR INSERT
  WITH CHECK (
    public.is_course_instructor((SELECT course_id FROM public.projects WHERE id = project_id))
    OR public.current_user_role() = 'ADMIN'
  );

CREATE POLICY "grades_update"
  ON public.grades FOR UPDATE
  USING (
    public.is_course_instructor((SELECT course_id FROM public.projects WHERE id = project_id))
    OR public.current_user_role() = 'ADMIN'
  );

-- Notifications: users only see their own
CREATE POLICY "notifications_select"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());
