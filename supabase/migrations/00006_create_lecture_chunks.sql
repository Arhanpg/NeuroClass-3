-- Migration: 00006_create_lecture_chunks
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.lecture_chunks (
  id          uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  lecture_id  uuid        NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  content     text        NOT NULL,
  chunk_index integer     NOT NULL,
  embedding   extensions.vector(1536),
  metadata    jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lecture_chunks_lecture_id_idx ON public.lecture_chunks(lecture_id);
CREATE INDEX IF NOT EXISTS lecture_chunks_embedding_idx
  ON public.lecture_chunks
  USING ivfflat (embedding extensions.vector_cosine_ops)
  WITH (lists = 100);

ALTER TABLE public.lecture_chunks ENABLE ROW LEVEL SECURITY;
