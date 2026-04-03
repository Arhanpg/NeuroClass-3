-- Migration: 00008_create_projects

CREATE TABLE IF NOT EXISTS public.projects (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name            text        NOT NULL,
  description     text,
  max_team_size   integer     NOT NULL DEFAULT 4,
  deadline        timestamptz,
  rubric_id       uuid,  -- FK added after rubrics table
  created_by      uuid        NOT NULL REFERENCES public.profiles(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_projects_course ON public.projects(course_id);
