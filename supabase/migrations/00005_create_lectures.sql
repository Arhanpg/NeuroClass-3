-- ============================================================
-- Migration: 00005_create_lectures.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lectures (
  id               uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid          NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title            text          NOT NULL,
  storage_path     text          NOT NULL,
  file_type        text          NOT NULL CHECK (file_type IN ('PDF','MARKDOWN')),
  embedding_status text          DEFAULT 'PENDING'
                                 CHECK (embedding_status IN ('PENDING','PROCESSING','DONE','FAILED')),
  chunk_count      int           DEFAULT 0,
  uploaded_at      timestamptz   DEFAULT now()
);

CREATE INDEX idx_lectures_course ON public.lectures(course_id);
