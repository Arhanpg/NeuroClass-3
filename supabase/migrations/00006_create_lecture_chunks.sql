-- Migration 00006: lecture_chunks (pgvector)
CREATE TABLE public.lecture_chunks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id   uuid NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  course_id    uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chunk_index  int NOT NULL,
  content      text NOT NULL,
  embedding    vector(1536) NOT NULL,
  metadata     jsonb DEFAULT '{}'
);

ALTER TABLE public.lecture_chunks ENABLE ROW LEVEL SECURITY;

CREATE INDEX ON public.lecture_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
