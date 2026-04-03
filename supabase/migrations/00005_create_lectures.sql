-- Migration: 00005_create_lectures

CREATE TABLE IF NOT EXISTS public.lectures (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title         text        NOT NULL,
  storage_path  text        NOT NULL,
  file_type     text        NOT NULL CHECK (file_type IN ('PDF','MARKDOWN','DOCX')),
  embed_status  text        NOT NULL DEFAULT 'PENDING'
                            CHECK (embed_status IN ('PENDING','PROCESSING','DONE','FAILED')),
  uploaded_by   uuid        NOT NULL REFERENCES public.profiles(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lectures_course ON public.lectures(course_id);
