-- Migration: 00019_rls_courses
-- RLS policies for the courses and enrollments tables.
-- Depends on: 00018_rls_profiles.sql (current_user_role, is_enrolled, is_course_instructor)

-- ── courses ───────────────────────────────────────────────────────────────────

-- Instructors can create courses (they become the owner via instructor_id)
CREATE POLICY "courses_insert_instructor"
  ON public.courses FOR INSERT
  WITH CHECK (current_user_role() = 'INSTRUCTOR');

-- Instructors see their own courses.
-- Enrolled students see their enrolled courses.
-- Admins and TAs see all courses.
CREATE POLICY "courses_select"
  ON public.courses FOR SELECT
  USING (
    instructor_id = auth.uid()
    OR is_enrolled(id)
    OR current_user_role() IN ('ADMIN', 'TEACHING_ASSISTANT')
  );

-- Only the course instructor can update their course
CREATE POLICY "courses_update_instructor"
  ON public.courses FOR UPDATE
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

-- Only the course instructor can delete their course (soft-archive preferred)
CREATE POLICY "courses_delete_instructor"
  ON public.courses FOR DELETE
  USING (instructor_id = auth.uid());


-- ── enrollments ───────────────────────────────────────────────────────────────

-- A student can enroll themselves only
CREATE POLICY "enrollments_insert_student"
  ON public.enrollments FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND current_user_role() = 'STUDENT'
  );

-- Students see their own enrollments.
-- Instructors see enrollments for courses they own.
-- Admins and TAs see all enrollments.
CREATE POLICY "enrollments_select"
  ON public.enrollments FOR SELECT
  USING (
    student_id = auth.uid()
    OR is_course_instructor(course_id)
    OR current_user_role() IN ('ADMIN', 'TEACHING_ASSISTANT')
  );

-- Instructors can remove a student from their course
CREATE POLICY "enrollments_delete_instructor"
  ON public.enrollments FOR DELETE
  USING (
    student_id = auth.uid()
    OR is_course_instructor(course_id)
    OR current_user_role() = 'ADMIN'
  );
