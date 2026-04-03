-- Migration: 00017_create_checkpointer
-- LangGraph state persistence table

CREATE TABLE IF NOT EXISTS public.langgraph_checkpoints (
  thread_id  text PRIMARY KEY,
  checkpoint jsonb NOT NULL,
  metadata   jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER langgraph_checkpoints_updated_at
  BEFORE UPDATE ON public.langgraph_checkpoints
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.langgraph_checkpoints ENABLE ROW LEVEL SECURITY;
