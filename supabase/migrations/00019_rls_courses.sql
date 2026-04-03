-- Migration 00019: RLS for courses + enrollments

-- courses
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT USING (
    instructor_id = auth.uid()
    OR public.is_enrolled(id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

CREATE POLICY "courses_insert_instructor" ON public.courses
  FOR INSERT WITH CHECK (public.current_user_role() = 'INSTRUCTOR');

CREATE POLICY "courses_update_instructor" ON public.courses
  FOR UPDATE USING (instructor_id = auth.uid());

CREATE POLICY "courses_delete_instructor" ON public.courses
  FOR DELETE USING (instructor_id = auth.uid());

-- enrollments
CREATE POLICY "enrollments_select" ON public.enrollments
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

CREATE POLICY "enrollments_insert_student" ON public.enrollments
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
    AND public.current_user_role() = 'STUDENT'
  );

CREATE POLICY "enrollments_delete_own" ON public.enrollments
  FOR DELETE USING (student_id = auth.uid());
