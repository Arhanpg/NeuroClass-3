-- Migration 00003: courses table
CREATE TABLE public.courses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  code             text NOT NULL UNIQUE,
  term             text NOT NULL,
  instructor_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  join_code        text NOT NULL UNIQUE DEFAULT substring(md5(random()::text),1,8),
  pedagogy_style   text NOT NULL DEFAULT 'DIRECT_INSTRUCTION'
                        CHECK (pedagogy_style IN ('SOCRATIC','DIRECT_INSTRUCTION','GUIDED_INQUIRY','FLIPPED','CUSTOM')),
  pedagogy_custom  text,
  enrollment_cap   int DEFAULT 200,
  is_archived      bool DEFAULT false,
  vector_store_id  text,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
