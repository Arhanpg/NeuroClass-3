-- Migration: 00018_rls_profiles
-- Row Level Security for profiles table

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles: own read"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Instructors/Admins can read all profiles
CREATE POLICY "profiles: instructor read all"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('INSTRUCTOR','ADMIN','TEACHING_ASSISTANT')
    )
  );

-- Users can update their own profile (not role)
CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Service role can do anything (for triggers)
CREATE POLICY "profiles: service role full access"
  ON public.profiles
  USING (auth.role() = 'service_role');
