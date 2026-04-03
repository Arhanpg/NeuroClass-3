-- Migration: 00010_create_commit_logs
-- GitHub commit data synced via Edge Function

CREATE TABLE IF NOT EXISTS public.commit_logs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         uuid        NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  author_id       uuid        REFERENCES public.profiles(id),  -- nullable: external contributor
  github_sha      text        NOT NULL,
  message         text        NOT NULL,
  additions       integer     NOT NULL DEFAULT 0,
  deletions       integer     NOT NULL DEFAULT 0,
  files_changed   integer     NOT NULL DEFAULT 0,
  complexity_score float      DEFAULT 0,
  committed_at    timestamptz NOT NULL,
  synced_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, github_sha)
);

CREATE INDEX idx_commit_logs_team    ON public.commit_logs(team_id);
CREATE INDEX idx_commit_logs_author  ON public.commit_logs(author_id);
