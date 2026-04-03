-- Migration: 00017_create_checkpointer
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.
-- LangGraph Postgres checkpointer tables for AI agent state persistence.

CREATE TABLE IF NOT EXISTS public.checkpoints (
  thread_id    text        NOT NULL,
  checkpoint_id text       NOT NULL,
  parent_id    text,
  checkpoint   jsonb       NOT NULL DEFAULT '{}',
  metadata     jsonb       NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, checkpoint_id)
);

CREATE TABLE IF NOT EXISTS public.checkpoint_writes (
  thread_id    text    NOT NULL,
  checkpoint_id text   NOT NULL,
  task_id      text    NOT NULL,
  idx          integer NOT NULL,
  channel      text    NOT NULL,
  value        jsonb,
  PRIMARY KEY (thread_id, checkpoint_id, task_id, idx)
);

CREATE INDEX IF NOT EXISTS checkpoints_thread_id_idx ON public.checkpoints(thread_id);

ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkpoint_writes ENABLE ROW LEVEL SECURITY;
