-- Migration: 00003_create_courses
-- Creates the courses table with all columns defined in the SRS.

CREATE TABLE IF NOT EXISTS public.courses (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  code             text        NOT NULL UNIQUE,
  term             text        NOT NULL,
  instructor_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  join_code        text        NOT NULL UNIQUE DEFAULT substring(md5(random()::text), 1, 8),
  pedagogy_style   text        NOT NULL DEFAULT 'DIRECT'
                               CHECK (pedagogy_style IN ('SOCRATIC','DIRECT','GUIDED','FLIPPED','CUSTOM')),
  pedagogy_custom  text,
  enrollment_cap   int         NOT NULL DEFAULT 200,
  is_archived      boolean     NOT NULL DEFAULT false,
  vector_store_id  text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS (policies are in migration 00019)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Index: fast lookup by instructor
CREATE INDEX IF NOT EXISTS courses_instructor_id_idx ON public.courses (instructor_id);

-- Index: fast lookup by join_code (used during enrollment)
CREATE INDEX IF NOT EXISTS courses_join_code_idx ON public.courses (join_code);
