-- Migration: 00019_rls_courses
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

-- Courses: instructors can CRUD their own, enrolled students/TAs can SELECT
CREATE POLICY "courses_select_enrolled"
  ON public.courses FOR SELECT
  USING (
    instructor_id = auth.uid()
    OR public.is_enrolled(id)
    OR public.current_user_role() = 'ADMIN'
  );

CREATE POLICY "courses_insert_instructor"
  ON public.courses FOR INSERT
  WITH CHECK (public.current_user_role() IN ('INSTRUCTOR','ADMIN'));

CREATE POLICY "courses_update_instructor"
  ON public.courses FOR UPDATE
  USING (instructor_id = auth.uid() OR public.current_user_role() = 'ADMIN');

CREATE POLICY "courses_delete_instructor"
  ON public.courses FOR DELETE
  USING (instructor_id = auth.uid() OR public.current_user_role() = 'ADMIN');

-- Enrollments
CREATE POLICY "enrollments_select"
  ON public.enrollments FOR SELECT
  USING (
    student_id = auth.uid()
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() = 'ADMIN'
  );

CREATE POLICY "enrollments_insert"
  ON public.enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid() OR public.current_user_role() = 'ADMIN');

CREATE POLICY "enrollments_delete"
  ON public.enrollments FOR DELETE
  USING (student_id = auth.uid() OR public.is_course_instructor(course_id) OR public.current_user_role() = 'ADMIN');

-- Lectures
CREATE POLICY "lectures_select"
  ON public.lectures FOR SELECT
  USING (
    public.is_course_instructor(course_id)
    OR (public.is_enrolled(course_id) AND is_published = true)
    OR public.current_user_role() = 'ADMIN'
  );

CREATE POLICY "lectures_insert"
  ON public.lectures FOR INSERT
  WITH CHECK (public.is_course_instructor(course_id) OR public.current_user_role() = 'ADMIN');

CREATE POLICY "lectures_update"
  ON public.lectures FOR UPDATE
  USING (public.is_course_instructor(course_id) OR public.current_user_role() = 'ADMIN');

CREATE POLICY "lectures_delete"
  ON public.lectures FOR DELETE
  USING (public.is_course_instructor(course_id) OR public.current_user_role() = 'ADMIN');
