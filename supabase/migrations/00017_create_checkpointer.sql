-- Migration: 00017_create_checkpointer
-- LangGraph state persistence tables (used by supabase_checkpointer.py)

CREATE TABLE IF NOT EXISTS public.checkpoints (
  thread_id     text        NOT NULL,
  checkpoint_id text        NOT NULL,
  parent_id     text,
  checkpoint    jsonb       NOT NULL DEFAULT '{}',
  metadata      jsonb       NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, checkpoint_id)
);

CREATE TABLE IF NOT EXISTS public.checkpoint_writes (
  thread_id     text        NOT NULL,
  checkpoint_id text        NOT NULL,
  task_id       text        NOT NULL,
  idx           integer     NOT NULL,
  channel       text        NOT NULL,
  value         jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, checkpoint_id, task_id, idx)
);

CREATE INDEX idx_checkpoints_thread ON public.checkpoints(thread_id);
