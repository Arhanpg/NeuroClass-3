-- Migration: 00018_rls_profiles.sql
-- RLS helper functions and policies for profiles table

-- Helper: returns current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: is current user enrolled in a course?
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id uuid)
RETURNS bool AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course_id AND student_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: is current user the instructor of a course?
CREATE OR REPLACE FUNCTION public.is_course_instructor(p_course_id uuid)
RETURNS bool AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.courses
    WHERE id = p_course_id AND instructor_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: SELECT own row, or INSTRUCTOR/TA/ADMIN can see all
CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  USING (
    id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

-- Profiles: UPDATE own row only
CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Profiles: INSERT handled by trigger only (no direct user inserts)
CREATE POLICY "profiles_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());
