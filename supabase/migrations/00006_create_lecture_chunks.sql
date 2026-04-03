-- Migration: 00006_create_lecture_chunks
-- Stores pgvector embeddings for RAG retrieval

CREATE TABLE IF NOT EXISTS public.lecture_chunks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id   uuid NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  course_id    uuid NOT NULL REFERENCES public.courses(id),
  chunk_index  int NOT NULL,
  content      text NOT NULL,
  embedding    extensions.vector(1536) NOT NULL,
  metadata     jsonb
);

-- IVFFlat index for cosine similarity search
CREATE INDEX IF NOT EXISTS lecture_chunks_embedding_idx
  ON public.lecture_chunks
  USING ivfflat (embedding extensions.vector_cosine_ops)
  WITH (lists = 100);

ALTER TABLE public.lecture_chunks ENABLE ROW LEVEL SECURITY;
