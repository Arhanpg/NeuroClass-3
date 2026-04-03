-- Migration 00018: RLS helper functions + profiles policies

-- Helper: current user role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper: is enrolled in course
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id uuid)
RETURNS bool LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course_id AND student_id = auth.uid()
  );
$$;

-- Helper: is instructor of course
CREATE OR REPLACE FUNCTION public.is_course_instructor(p_course_id uuid)
RETURNS bool LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = p_course_id AND instructor_id = auth.uid()
  );
$$;

-- profiles RLS
CREATE POLICY "profiles_select_own_or_staff" ON public.profiles
  FOR SELECT USING (
    id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_insert_trigger" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());
