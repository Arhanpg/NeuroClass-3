-- Migration: 00018_rls_profiles
-- RLS helper functions + profiles policies

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: check enrollment
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id uuid)
RETURNS bool AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course_id AND student_id = auth.uid()
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: check instructor ownership
CREATE OR REPLACE FUNCTION public.is_course_instructor(p_course_id uuid)
RETURNS bool AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = p_course_id AND instructor_id = auth.uid()
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- profiles: SELECT — own row OR instructor/TA/admin sees all
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (
    id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

-- profiles: INSERT — handled by trigger only
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- profiles: UPDATE — own row only
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (id = auth.uid());
