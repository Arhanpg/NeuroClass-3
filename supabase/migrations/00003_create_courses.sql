-- Migration: 00003_create_courses

CREATE TABLE IF NOT EXISTS public.courses (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text        NOT NULL,
  code            text        NOT NULL UNIQUE,
  term            text        NOT NULL,
  description     text,
  instructor_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  join_code       text        NOT NULL UNIQUE DEFAULT upper(substring(gen_random_uuid()::text,1,8)),
  pedagogy_style  text        NOT NULL DEFAULT 'SOCRATIC'
                              CHECK (pedagogy_style IN ('SOCRATIC','DIRECT','INQUIRY','PROJECT_BASED')),
  is_active       boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_join_code  ON public.courses(join_code);
