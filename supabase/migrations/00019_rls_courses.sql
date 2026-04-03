-- Migration: 00019_rls_courses

-- courses: SELECT — enrolled students, instructor, admin/TA
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT USING (
    instructor_id = auth.uid()
    OR public.is_enrolled(id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

-- courses: INSERT — INSTRUCTOR role only
CREATE POLICY "courses_insert" ON public.courses
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'INSTRUCTOR'
  );

-- courses: UPDATE — instructor of course only
CREATE POLICY "courses_update" ON public.courses
  FOR UPDATE USING (instructor_id = auth.uid());

-- courses: DELETE — instructor of course only
CREATE POLICY "courses_delete" ON public.courses
  FOR DELETE USING (instructor_id = auth.uid());

-- enrollments: INSERT — student enrolling themselves
CREATE POLICY "enrollments_insert" ON public.enrollments
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
    AND public.current_user_role() = 'STUDENT'
  );

-- enrollments: SELECT — own row OR instructor/TA
CREATE POLICY "enrollments_select" ON public.enrollments
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

-- lectures: SELECT — enrolled + instructor + TA
CREATE POLICY "lectures_select" ON public.lectures
  FOR SELECT USING (
    public.is_enrolled(course_id)
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

-- lectures: INSERT/UPDATE/DELETE — instructor of course
CREATE POLICY "lectures_insert" ON public.lectures
  FOR INSERT WITH CHECK (public.is_course_instructor(course_id));

CREATE POLICY "lectures_update" ON public.lectures
  FOR UPDATE USING (public.is_course_instructor(course_id));
