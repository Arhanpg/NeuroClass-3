-- Migration: 00011_create_rubrics
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.rubrics (
  id          uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  project_id  uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  criteria    jsonb       NOT NULL DEFAULT '[]',
  max_score   integer     NOT NULL DEFAULT 100,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rubrics_project_id_idx ON public.rubrics(project_id);

CREATE TRIGGER set_rubrics_updated_at
  BEFORE UPDATE ON public.rubrics
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;
