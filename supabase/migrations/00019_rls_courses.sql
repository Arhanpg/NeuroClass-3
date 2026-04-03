-- ============================================================
-- Migration: 00019_rls_courses.sql
-- RLS policies for courses + enrollments tables
-- ============================================================

ALTER TABLE public.courses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- COURSES
CREATE POLICY "courses: instructor can insert"
  ON public.courses FOR INSERT
  WITH CHECK (public.current_user_role() = 'INSTRUCTOR');

CREATE POLICY "courses: visible to enrolled students, instructor, admin"
  ON public.courses FOR SELECT USING (
    instructor_id = auth.uid()
    OR public.is_enrolled(id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

CREATE POLICY "courses: only instructor can update own course"
  ON public.courses FOR UPDATE USING (instructor_id = auth.uid());

CREATE POLICY "courses: only instructor can delete own course"
  ON public.courses FOR DELETE USING (instructor_id = auth.uid());

-- ENROLLMENTS
CREATE POLICY "enrollments: student can enroll themselves"
  ON public.enrollments FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND public.current_user_role() = 'STUDENT'
  );

CREATE POLICY "enrollments: student sees own; instructor/TA sees course"
  ON public.enrollments FOR SELECT USING (
    student_id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "enrollments: instructor can remove student"
  ON public.enrollments FOR DELETE USING (
    public.is_course_instructor(course_id)
    OR public.current_user_role() = 'ADMIN'
  );

-- LECTURES RLS
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lectures: instructor of course can insert"
  ON public.lectures FOR INSERT
  WITH CHECK (public.is_course_instructor(course_id));

CREATE POLICY "lectures: enrolled students and instructor can view"
  ON public.lectures FOR SELECT USING (
    public.is_course_instructor(course_id)
    OR public.is_enrolled(course_id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

CREATE POLICY "lectures: instructor can update own course lectures"
  ON public.lectures FOR UPDATE USING (public.is_course_instructor(course_id));

CREATE POLICY "lectures: instructor can delete own course lectures"
  ON public.lectures FOR DELETE USING (public.is_course_instructor(course_id));
