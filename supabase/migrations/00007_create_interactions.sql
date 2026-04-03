-- Migration: 00007_create_interactions
-- AI Tutor session messages

CREATE TABLE IF NOT EXISTS public.interactions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id             uuid NOT NULL REFERENCES public.courses(id),
  student_id            uuid NOT NULL REFERENCES public.profiles(id),
  thread_id             text NOT NULL,
  text_payload          text CHECK (char_length(text_payload) <= 4000),
  attachment_urls       text[] DEFAULT '{}',
  agent_response        text,
  cited_sources         jsonb,
  agent_name            text,
  status                text NOT NULL DEFAULT 'PENDING'
                          CHECK (status IN ('PENDING','PROCESSING','COMPLETED','FAILED')),
  execution_duration_ms int,
  created_at            timestamptz NOT NULL DEFAULT now(),
  completed_at          timestamptz
);

ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
