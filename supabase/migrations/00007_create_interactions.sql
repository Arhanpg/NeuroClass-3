-- Migration: 00007_create_interactions
-- Stores AI tutor chat messages (Realtime-enabled)

CREATE TABLE IF NOT EXISTS public.interactions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id    uuid        NOT NULL DEFAULT gen_random_uuid(),
  role          text        NOT NULL CHECK (role IN ('USER','ASSISTANT','SYSTEM')),
  content       text        NOT NULL,
  sources       jsonb       DEFAULT '[]',  -- cited lecture chunk IDs
  token_count   integer,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_interactions_student_course ON public.interactions(student_id, course_id);
CREATE INDEX idx_interactions_session        ON public.interactions(session_id);

-- Enable Realtime for streaming responses
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactions;
