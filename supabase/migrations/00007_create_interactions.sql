-- Migration: 00007_create_interactions
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.interactions (
  id           uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id    uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lecture_id   uuid        REFERENCES public.lectures(id) ON DELETE SET NULL,
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type         text        NOT NULL CHECK (type IN ('QA','DOUBT','QUIZ','DISCUSSION')),
  question     text        NOT NULL,
  answer       text,
  is_resolved  boolean     NOT NULL DEFAULT false,
  metadata     jsonb       NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS interactions_course_id_idx   ON public.interactions(course_id);
CREATE INDEX IF NOT EXISTS interactions_user_id_idx     ON public.interactions(user_id);
CREATE INDEX IF NOT EXISTS interactions_lecture_id_idx  ON public.interactions(lecture_id);

CREATE TRIGGER set_interactions_updated_at
  BEFORE UPDATE ON public.interactions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
