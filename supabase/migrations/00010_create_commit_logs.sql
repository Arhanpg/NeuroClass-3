-- Migration: 00010_create_commit_logs
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.commit_logs (
  id           uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  team_id      uuid        NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  project_id   uuid        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id    uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  sha          text        NOT NULL,
  message      text        NOT NULL,
  additions    integer     NOT NULL DEFAULT 0,
  deletions    integer     NOT NULL DEFAULT 0,
  committed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS commit_logs_team_id_idx    ON public.commit_logs(team_id);
CREATE INDEX IF NOT EXISTS commit_logs_project_id_idx ON public.commit_logs(project_id);

ALTER TABLE public.commit_logs ENABLE ROW LEVEL SECURITY;
