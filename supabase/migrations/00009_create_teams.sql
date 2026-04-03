-- Migration: 00009_create_teams

CREATE TABLE IF NOT EXISTS public.teams (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name          text        NOT NULL,
  github_url    text,
  github_repo   text,  -- owner/repo format
  submission_url text,
  submitted_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid        NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  student_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, student_id)
);

CREATE INDEX idx_teams_project         ON public.teams(project_id);
CREATE INDEX idx_team_members_team     ON public.team_members(team_id);
CREATE INDEX idx_team_members_student  ON public.team_members(student_id);
