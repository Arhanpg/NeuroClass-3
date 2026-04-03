-- Migration: 00008_create_projects
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.projects (
  id           uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id    uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  description  text,
  repo_url     text,
  due_date     timestamptz,
  max_score    integer     NOT NULL DEFAULT 100,
  is_team      boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_course_id_idx ON public.projects(course_id);

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
