-- Migration: 00012_create_grades
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.grades (
  id            uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  project_id    uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  student_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id       uuid        REFERENCES public.teams(id) ON DELETE SET NULL,
  rubric_id     uuid        REFERENCES public.rubrics(id) ON DELETE SET NULL,
  score         numeric(5,2),
  ai_score      numeric(5,2),
  ai_feedback   text,
  manual_feedback text,
  graded_by     uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  graded_at     timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, student_id)
);

CREATE INDEX IF NOT EXISTS grades_project_id_idx  ON public.grades(project_id);
CREATE INDEX IF NOT EXISTS grades_student_id_idx  ON public.grades(student_id);

CREATE TRIGGER set_grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
