-- Migration 00009: teams + team_members
CREATE TABLE public.teams (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name              text NOT NULL,
  github_url        text,
  jira_url          text,
  pcs_scores        jsonb DEFAULT '{}',
  last_github_sync  timestamptz,
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.team_members (
  team_id    uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at  timestamptz DEFAULT now(),
  PRIMARY KEY (team_id, student_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
