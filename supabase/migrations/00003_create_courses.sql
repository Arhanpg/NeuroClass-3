-- Migration: 00003_create_courses
-- Creates the courses table with all required columns

CREATE TABLE IF NOT EXISTS public.courses (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text          NOT NULL,
  code              text          NOT NULL UNIQUE,
  term              text          NOT NULL,
  instructor_id     uuid          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  join_code         text          NOT NULL UNIQUE DEFAULT substring(md5(random()::text), 1, 8),
  pedagogy_style    text          NOT NULL DEFAULT 'DIRECT_INSTRUCTION'
                                  CHECK (pedagogy_style IN (
                                    'DIRECT_INSTRUCTION',
                                    'SOCRATIC',
                                    'GUIDED_INQUIRY',
                                    'FLIPPED_CLASSROOM',
                                    'CUSTOM'
                                  )),
  pedagogy_custom   text,
  enrollment_cap    int           DEFAULT 200,
  is_archived       bool          DEFAULT false,
  vector_store_id   text,
  created_at        timestamptz   DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Index for faster lookup by instructor
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_join_code ON public.courses(join_code);
CREATE INDEX IF NOT EXISTS idx_courses_is_archived ON public.courses(is_archived);
