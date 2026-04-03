-- Migration 00011: rubrics
CREATE TABLE public.rubrics (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id            uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  instructor_id         uuid NOT NULL REFERENCES public.profiles(id),
  natural_language_text text NOT NULL,
  schema                jsonb NOT NULL,
  is_active             bool DEFAULT true,
  version               int DEFAULT 1,
  created_at            timestamptz DEFAULT now()
);

ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;
