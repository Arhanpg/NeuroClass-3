-- ============================================================
-- Migration 00005: Quizzes, Questions, Attempts
-- ============================================================

-- --------------------------------------------------------
-- QUIZZES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id    UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  created_by      UUID NOT NULL REFERENCES public.profiles(id),
  title           TEXT NOT NULL,
  description     TEXT,
  time_limit_min  INTEGER,            -- NULL = unlimited
  max_attempts    INTEGER DEFAULT 1,
  shuffle_q       BOOLEAN DEFAULT FALSE,
  show_answers    BOOLEAN DEFAULT TRUE,
  is_published    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quizzes_classroom ON public.quizzes(classroom_id);

CREATE TRIGGER trg_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- --------------------------------------------------------
-- QUESTIONS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id      UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question     TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'mcq' CHECK (type IN ('mcq', 'true_false', 'short_answer', 'code')),
  options      JSONB DEFAULT '[]',      -- for MCQ: [{label, is_correct}]
  answer_key   TEXT,                    -- for short_answer / code
  points       INTEGER NOT NULL DEFAULT 1,
  order_index  INTEGER NOT NULL DEFAULT 0,
  explanation  TEXT                     -- shown after grading
);

CREATE INDEX idx_questions_quiz ON public.questions(quiz_id);

-- --------------------------------------------------------
-- QUIZ ATTEMPTS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id      UUID NOT NULL REFERENCES public.quizzes(id)   ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES public.profiles(id)  ON DELETE CASCADE,
  answers      JSONB NOT NULL DEFAULT '{}',    -- {question_id: answer_value}
  score        NUMERIC(5,2),
  max_score    INTEGER,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at  TIMESTAMPTZ,
  status       TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded'))
);

CREATE INDEX idx_quiz_attempts_quiz    ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_student ON public.quiz_attempts(student_id);
