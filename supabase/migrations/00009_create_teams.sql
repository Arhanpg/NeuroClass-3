-- Migration: 00009_create_teams
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.teams (
  id         uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  project_id uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  course_id  uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  repo_url   text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  team_id    uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, student_id)
);

CREATE INDEX IF NOT EXISTS teams_project_id_idx ON public.teams(project_id);
CREATE INDEX IF NOT EXISTS team_members_student_id_idx ON public.team_members(student_id);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
