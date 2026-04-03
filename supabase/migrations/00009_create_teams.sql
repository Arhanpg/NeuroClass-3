-- Migration: 00009_create_teams

CREATE TABLE IF NOT EXISTS public.teams (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id       uuid NOT NULL REFERENCES public.projects(id),
  name             text NOT NULL,
  github_url       text,
  jira_url         text,
  pcs_scores       jsonb,
  last_github_sync timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  team_id     uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES public.profiles(id),
  joined_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, student_id)
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
