-- ============================================================
-- Migration: 00002_create_profiles.sql
-- Creates the profiles table (extends auth.users) + RLS trigger
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text         NOT NULL UNIQUE,
  full_name   text         NOT NULL DEFAULT '',
  avatar_url  text,
  role        text         NOT NULL DEFAULT 'STUDENT'
                           CHECK (role IN ('INSTRUCTOR','TEACHING_ASSISTANT','STUDENT','ADMIN')),
  created_at  timestamptz  DEFAULT now(),
  updated_at  timestamptz  DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create a profile row whenever a new auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'STUDENT'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
