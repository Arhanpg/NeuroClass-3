-- Migration 00005: lectures table
CREATE TABLE public.lectures (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id         uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title             text NOT NULL,
  storage_path      text NOT NULL,
  file_type         text NOT NULL CHECK (file_type IN ('PDF','MARKDOWN')),
  embedding_status  text DEFAULT 'PENDING'
                         CHECK (embedding_status IN ('PENDING','PROCESSING','DONE','FAILED')),
  chunk_count       int DEFAULT 0,
  uploaded_at       timestamptz DEFAULT now()
);

ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
