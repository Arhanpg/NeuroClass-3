-- Migration: 00019_rls_courses
-- RLS policies for courses, enrollments, and lectures tables

-- ============================================================
-- Helper functions (safe to re-create)
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id uuid)
RETURNS bool
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course_id AND student_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_course_instructor(p_course_id uuid)
RETURNS bool
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.courses
    WHERE id = p_course_id AND instructor_id = auth.uid()
  );
$$;

-- ============================================================
-- COURSES RLS Policies
-- ============================================================
DROP POLICY IF EXISTS "courses_select" ON public.courses;
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT
  USING (
    instructor_id = auth.uid()
    OR public.is_enrolled(id)
    OR public.current_user_role() IN ('ADMIN', 'TEACHING_ASSISTANT')
  );

DROP POLICY IF EXISTS "courses_insert" ON public.courses;
CREATE POLICY "courses_insert" ON public.courses
  FOR INSERT
  WITH CHECK (public.current_user_role() = 'INSTRUCTOR');

DROP POLICY IF EXISTS "courses_update" ON public.courses;
CREATE POLICY "courses_update" ON public.courses
  FOR UPDATE
  USING (instructor_id = auth.uid());

DROP POLICY IF EXISTS "courses_delete" ON public.courses;
CREATE POLICY "courses_delete" ON public.courses
  FOR DELETE
  USING (instructor_id = auth.uid() OR public.current_user_role() = 'ADMIN');

-- ============================================================
-- ENROLLMENTS RLS Policies
-- ============================================================
DROP POLICY IF EXISTS "enrollments_select" ON public.enrollments;
CREATE POLICY "enrollments_select" ON public.enrollments
  FOR SELECT
  USING (
    student_id = auth.uid()
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() IN ('ADMIN', 'TEACHING_ASSISTANT')
  );

DROP POLICY IF EXISTS "enrollments_insert" ON public.enrollments;
CREATE POLICY "enrollments_insert" ON public.enrollments
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND public.current_user_role() = 'STUDENT'
  );

DROP POLICY IF EXISTS "enrollments_delete" ON public.enrollments;
CREATE POLICY "enrollments_delete" ON public.enrollments
  FOR DELETE
  USING (
    student_id = auth.uid()
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() = 'ADMIN'
  );

-- ============================================================
-- LECTURES RLS Policies
-- ============================================================
DROP POLICY IF EXISTS "lectures_select" ON public.lectures;
CREATE POLICY "lectures_select" ON public.lectures
  FOR SELECT
  USING (
    public.is_enrolled(course_id)
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() IN ('ADMIN', 'TEACHING_ASSISTANT')
  );

DROP POLICY IF EXISTS "lectures_insert" ON public.lectures;
CREATE POLICY "lectures_insert" ON public.lectures
  FOR INSERT
  WITH CHECK (public.is_course_instructor(course_id));

DROP POLICY IF EXISTS "lectures_update" ON public.lectures;
CREATE POLICY "lectures_update" ON public.lectures
  FOR UPDATE
  USING (public.is_course_instructor(course_id));

DROP POLICY IF EXISTS "lectures_delete" ON public.lectures;
CREATE POLICY "lectures_delete" ON public.lectures
  FOR DELETE
  USING (public.is_course_instructor(course_id));
