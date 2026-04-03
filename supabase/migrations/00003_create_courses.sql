-- Migration: 00003_create_courses
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.courses (
  id             uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title          text        NOT NULL,
  description    text,
  join_code      text        UNIQUE NOT NULL,
  instructor_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_active      boolean     NOT NULL DEFAULT true,
  banner_url     text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS courses_instructor_id_idx ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS courses_join_code_idx ON public.courses(join_code);

CREATE TRIGGER set_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
