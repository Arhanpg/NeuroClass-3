-- Migration 00017: langgraph_checkpoints (LangGraph state persistence)
CREATE TABLE public.langgraph_checkpoints (
  thread_id   text PRIMARY KEY,
  checkpoint  jsonb NOT NULL,
  metadata    jsonb DEFAULT '{}',
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.langgraph_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER checkpoints_updated_at
  BEFORE UPDATE ON public.langgraph_checkpoints
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
