-- Migration: 00011_create_rubrics

CREATE TABLE IF NOT EXISTS public.rubrics (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  criteria    jsonb       NOT NULL DEFAULT '[]',
  -- criteria shape: [{name, description, weight, max_score}]
  total_weight float      GENERATED ALWAYS AS (
    (SELECT COALESCE(SUM((c->>'weight')::float), 0)
     FROM jsonb_array_elements(criteria) AS c)
  ) STORED,
  created_by  uuid        NOT NULL REFERENCES public.profiles(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER rubrics_updated_at
  BEFORE UPDATE ON public.rubrics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add FK from projects to rubrics now that rubrics table exists
ALTER TABLE public.projects
  ADD CONSTRAINT fk_projects_rubric
  FOREIGN KEY (rubric_id) REFERENCES public.rubrics(id) ON DELETE SET NULL;

CREATE INDEX idx_rubrics_course ON public.rubrics(course_id);
