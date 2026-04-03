-- Migration 00007: interactions (AI Tutor sessions)
CREATE TABLE public.interactions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id             uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id            uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  thread_id             text NOT NULL,
  text_payload          text NOT NULL CHECK (char_length(text_payload) <= 4000),
  attachment_urls       text[] DEFAULT '{}',
  agent_response        text,
  cited_sources         jsonb DEFAULT '[]',
  agent_name            text,
  status                text DEFAULT 'PENDING'
                             CHECK (status IN ('PENDING','PROCESSING','COMPLETED','FAILED')),
  execution_duration_ms int,
  created_at            timestamptz DEFAULT now(),
  completed_at          timestamptz
);

ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX interactions_thread_id_idx ON public.interactions(thread_id);
CREATE INDEX interactions_student_course_idx ON public.interactions(student_id, course_id);
