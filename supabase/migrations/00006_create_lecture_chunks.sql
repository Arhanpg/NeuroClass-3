-- Migration: 00006_create_lecture_chunks (pgvector table)
-- Requires: 00001_enable_pgvector.sql

CREATE TABLE IF NOT EXISTS public.lecture_chunks (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id  uuid        NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  course_id   uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  content     text        NOT NULL,
  chunk_index integer     NOT NULL,
  embedding   vector(1536),   -- OpenAI text-embedding-3-small dimension
  metadata    jsonb       DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lecture_chunks_lecture ON public.lecture_chunks(lecture_id);
CREATE INDEX idx_lecture_chunks_course  ON public.lecture_chunks(course_id);
-- HNSW index for fast ANN search
CREATE INDEX idx_lecture_chunks_embedding
  ON public.lecture_chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
