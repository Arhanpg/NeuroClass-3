-- ============================================================
-- Migration 00004: Assignments, Submissions, Grades
-- ============================================================

-- --------------------------------------------------------
-- ASSIGNMENTS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assignments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id   UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  created_by     UUID NOT NULL REFERENCES public.profiles(id),
  title          TEXT NOT NULL,
  description    TEXT,
  instructions   TEXT,
  type           TEXT NOT NULL DEFAULT 'written' CHECK (type IN ('written', 'code', 'quiz', 'file_upload', 'multiple_choice')),
  rubric         JSONB NOT NULL DEFAULT '[]',        -- [{criterion, max_points, description}]
  max_points     INTEGER NOT NULL DEFAULT 100,
  due_date       TIMESTAMPTZ,
  allow_late     BOOLEAN NOT NULL DEFAULT FALSE,
  is_published   BOOLEAN NOT NULL DEFAULT FALSE,
  ai_grade       BOOLEAN NOT NULL DEFAULT TRUE,      -- enable AI auto-grading
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assignments_classroom ON public.assignments(classroom_id);
CREATE INDEX idx_assignments_due_date  ON public.assignments(due_date);

CREATE TRIGGER trg_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- --------------------------------------------------------
-- SUBMISSIONS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES public.profiles(id)    ON DELETE CASCADE,
  content         JSONB NOT NULL DEFAULT '{}',     -- {text, code, file_urls, answers}
  status          TEXT NOT NULL DEFAULT 'draft'   CHECK (status IN ('draft', 'submitted', 'graded', 'returned', 'late')),
  submitted_at    TIMESTAMPTZ,
  ai_score        NUMERIC(5,2),
  ai_feedback     TEXT,
  ai_rubric_scores JSONB DEFAULT '[]',             -- [{criterion, score, comment}]
  instructor_score NUMERIC(5,2),
  instructor_feedback TEXT,
  final_score     NUMERIC(5,2) GENERATED ALWAYS AS
                    (COALESCE(instructor_score, ai_score)) STORED,
  graded_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student    ON public.submissions(student_id);
CREATE INDEX idx_submissions_status     ON public.submissions(status);

CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
