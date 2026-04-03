-- Migration: 00014_create_leaderboard
-- Already applied on remote Supabase. This file exists to keep local CLI history in sync.

CREATE TABLE IF NOT EXISTS public.leaderboard (
  id           uuid        PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id    uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_score  numeric(8,2) NOT NULL DEFAULT 0,
  rank         integer,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, student_id)
);

CREATE INDEX IF NOT EXISTS leaderboard_course_id_idx ON public.leaderboard(course_id);
CREATE INDEX IF NOT EXISTS leaderboard_rank_idx ON public.leaderboard(course_id, rank);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
