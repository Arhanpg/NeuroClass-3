-- Migration: 00013_create_released_grades
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.released_grades (
  id         uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  project_id uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  course_id  uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  released_by uuid       NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  released_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS released_grades_project_id_idx ON public.released_grades(project_id);

ALTER TABLE public.released_grades ENABLE ROW LEVEL SECURITY;
