-- Migration: 00010_create_commit_logs

CREATE TABLE IF NOT EXISTS public.commit_logs (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id            uuid NOT NULL REFERENCES public.teams(id),
  commit_sha         text NOT NULL,
  author_email       text NOT NULL,
  student_id         uuid REFERENCES public.profiles(id),
  timestamp          timestamptz NOT NULL,
  files_changed      int NOT NULL,
  lines_added        int NOT NULL,
  lines_deleted      int NOT NULL,
  commit_message     text,
  semantic_category  text
                       CHECK (semantic_category IN
                         ('CRITICAL_LOGIC','FEATURE','BUG_FIX','REFACTOR','DOCS','TRIVIAL')),
  complexity_score   numeric(5,2),
  is_flagged         bool DEFAULT false,
  flag_reason        text,
  UNIQUE (team_id, commit_sha)
);

ALTER TABLE public.commit_logs ENABLE ROW LEVEL SECURITY;
