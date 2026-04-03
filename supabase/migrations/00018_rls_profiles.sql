-- Phase 1: RLS policies for profiles table
-- Must run AFTER 00002_create_profiles.sql

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper: returns the current user's role (SECURITY DEFINER bypasses RLS for this lookup)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: is the current user enrolled in a given course?
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id uuid)
RETURNS bool AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course_id
      AND student_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: is the current user the instructor of a given course?
CREATE OR REPLACE FUNCTION public.is_course_instructor(p_course_id uuid)
RETURNS bool AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = p_course_id
      AND instructor_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- POLICY: users can always read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- POLICY: instructors, TAs and admins can read all profiles
CREATE POLICY "profiles_select_privileged"
  ON public.profiles FOR SELECT
  USING (
    public.current_user_role() IN ('INSTRUCTOR', 'TEACHING_ASSISTANT', 'ADMIN')
  );

-- POLICY: users can update only their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- POLICY: new profile rows are inserted by the trigger (SECURITY DEFINER)
-- No direct INSERT from the client is allowed
CREATE POLICY "profiles_insert_trigger_only"
  ON public.profiles FOR INSERT
  WITH CHECK (false);
