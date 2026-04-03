-- Migration: 00005_create_lectures
-- Creates lecture notes table with embedding status tracking

CREATE TABLE IF NOT EXISTS public.lectures (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id         uuid          NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title             text          NOT NULL,
  storage_path      text          NOT NULL,
  file_type         text          NOT NULL CHECK (file_type IN ('PDF', 'MARKDOWN')),
  embedding_status  text          DEFAULT 'PENDING'
                                  CHECK (embedding_status IN ('PENDING', 'PROCESSING', 'DONE', 'FAILED')),
  chunk_count       int           DEFAULT 0,
  uploaded_at       timestamptz   DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lectures_course_id ON public.lectures(course_id);
CREATE INDEX IF NOT EXISTS idx_lectures_embedding_status ON public.lectures(embedding_status);
