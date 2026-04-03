-- Migration: 00005_create_lectures
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.lectures (
  id            uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id     uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title         text        NOT NULL,
  description   text,
  video_url     text,
  transcript    text,
  order_index   integer     NOT NULL DEFAULT 0,
  is_published  boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lectures_course_id_idx ON public.lectures(course_id);
CREATE INDEX IF NOT EXISTS lectures_order_idx ON public.lectures(course_id, order_index);

CREATE TRIGGER set_lectures_updated_at
  BEFORE UPDATE ON public.lectures
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
