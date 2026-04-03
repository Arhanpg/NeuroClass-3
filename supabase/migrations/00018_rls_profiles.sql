-- ============================================================
-- Migration: 00018_rls_profiles.sql
-- RLS helper functions + policies for profiles table
-- ============================================================

-- Helper: returns the role of the currently authenticated user
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper: is the current user enrolled in a given course?
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id uuid)
RETURNS bool LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course_id AND student_id = auth.uid()
  );
$$;

-- Helper: is the current user the instructor of a given course?
CREATE OR REPLACE FUNCTION public.is_course_instructor(p_course_id uuid)
RETURNS bool LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses
    WHERE id = p_course_id AND instructor_id = auth.uid()
  );
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "profiles: anyone can read own row or staff can read all"
  ON public.profiles FOR SELECT USING (
    id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "profiles: user can update own row"
  ON public.profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles: service role can insert"
  ON public.profiles FOR INSERT WITH CHECK (true);
