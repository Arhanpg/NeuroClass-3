-- ============================================================
-- Migration 00007: Row Level Security Policies
-- Enable RLS on every table, then add granular policies.
-- ============================================================

-- ---- Enable RLS ----
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_jobs            ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER: is the current user enrolled in a classroom?
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_enrolled(p_classroom_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE classroom_id = p_classroom_id
      AND student_id   = auth.uid()
      AND status = 'active'
  );
$$;

-- ============================================================
-- HELPER: is the current user the instructor of a classroom?
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_instructor(p_classroom_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classrooms
    WHERE id = p_classroom_id AND instructor_id = auth.uid()
  );
$$;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_select_classmates"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e1
      JOIN  public.enrollments e2 ON e1.classroom_id = e2.classroom_id
      WHERE e1.student_id = auth.uid() AND e2.student_id = profiles.id
    )
    OR EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.instructor_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.enrollments e WHERE e.classroom_id = c.id AND e.student_id = profiles.id
      )
    )
  );

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ============================================================
-- CLASSROOMS
-- ============================================================
CREATE POLICY "classrooms_select_instructor"
  ON public.classrooms FOR SELECT
  USING (instructor_id = auth.uid());

CREATE POLICY "classrooms_select_enrolled"
  ON public.classrooms FOR SELECT
  USING (public.is_enrolled(id));

CREATE POLICY "classrooms_insert_instructor"
  ON public.classrooms FOR INSERT
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "classrooms_update_instructor"
  ON public.classrooms FOR UPDATE
  USING (instructor_id = auth.uid());

CREATE POLICY "classrooms_delete_instructor"
  ON public.classrooms FOR DELETE
  USING (instructor_id = auth.uid());

-- ============================================================
-- ENROLLMENTS
-- ============================================================
CREATE POLICY "enrollments_select_own"
  ON public.enrollments FOR SELECT
  USING (student_id = auth.uid() OR public.is_instructor(classroom_id));

CREATE POLICY "enrollments_insert_self"
  ON public.enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "enrollments_update_instructor"
  ON public.enrollments FOR UPDATE
  USING (public.is_instructor(classroom_id));

-- ============================================================
-- COURSES
-- ============================================================
CREATE POLICY "courses_select"
  ON public.courses FOR SELECT
  USING (public.is_enrolled(classroom_id) OR public.is_instructor(classroom_id));

CREATE POLICY "courses_manage_instructor"
  ON public.courses FOR ALL
  USING (public.is_instructor(classroom_id));

-- ============================================================
-- MODULES
-- ============================================================
CREATE POLICY "modules_select"
  ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = modules.course_id
        AND (public.is_enrolled(c.classroom_id) OR public.is_instructor(c.classroom_id))
    )
  );

CREATE POLICY "modules_manage_instructor"
  ON public.modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c WHERE c.id = modules.course_id AND public.is_instructor(c.classroom_id)
    )
  );

-- ============================================================
-- LESSONS
-- ============================================================
CREATE POLICY "lessons_select"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
        AND (public.is_enrolled(c.classroom_id) OR public.is_instructor(c.classroom_id))
    )
  );

CREATE POLICY "lessons_manage_instructor"
  ON public.lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id AND public.is_instructor(c.classroom_id)
    )
  );

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
CREATE POLICY "lesson_progress_own"
  ON public.lesson_progress FOR ALL
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

-- ============================================================
-- RESOURCES
-- ============================================================
CREATE POLICY "resources_select"
  ON public.resources FOR SELECT
  USING (
    public.is_enrolled(classroom_id) OR public.is_instructor(classroom_id)
  );

CREATE POLICY "resources_insert_instructor"
  ON public.resources FOR INSERT
  WITH CHECK (uploader_id = auth.uid() AND public.is_instructor(classroom_id));

-- ============================================================
-- ASSIGNMENTS
-- ============================================================
CREATE POLICY "assignments_select"
  ON public.assignments FOR SELECT
  USING (public.is_enrolled(classroom_id) OR public.is_instructor(classroom_id));

CREATE POLICY "assignments_manage_instructor"
  ON public.assignments FOR ALL
  USING (public.is_instructor(classroom_id));

-- ============================================================
-- SUBMISSIONS
-- ============================================================
CREATE POLICY "submissions_select_own"
  ON public.submissions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "submissions_select_instructor"
  ON public.submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = submissions.assignment_id AND public.is_instructor(a.classroom_id)
    )
  );

CREATE POLICY "submissions_insert_own"
  ON public.submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "submissions_update_own"
  ON public.submissions FOR UPDATE
  USING (student_id = auth.uid() AND status IN ('draft'));

CREATE POLICY "submissions_update_instructor"
  ON public.submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = submissions.assignment_id AND public.is_instructor(a.classroom_id)
    )
  );

-- ============================================================
-- QUIZZES & QUESTIONS
-- ============================================================
CREATE POLICY "quizzes_select"
  ON public.quizzes FOR SELECT
  USING (public.is_enrolled(classroom_id) OR public.is_instructor(classroom_id));

CREATE POLICY "quizzes_manage_instructor"
  ON public.quizzes FOR ALL
  USING (public.is_instructor(classroom_id));

CREATE POLICY "questions_select"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = questions.quiz_id
        AND (public.is_enrolled(q.classroom_id) OR public.is_instructor(q.classroom_id))
    )
  );

-- ============================================================
-- QUIZ ATTEMPTS
-- ============================================================
CREATE POLICY "quiz_attempts_own"
  ON public.quiz_attempts FOR ALL
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

CREATE POLICY "quiz_attempts_instructor_view"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND public.is_instructor(q.classroom_id)
    )
  );

-- ============================================================
-- DOCUMENT EMBEDDINGS (service-role only for write)
-- ============================================================
CREATE POLICY "embeddings_select"
  ON public.document_embeddings FOR SELECT
  USING (public.is_enrolled(classroom_id) OR public.is_instructor(classroom_id));

-- ============================================================
-- CHAT SESSIONS & MESSAGES
-- ============================================================
CREATE POLICY "chat_sessions_own"
  ON public.chat_sessions FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "chat_messages_own"
  ON public.chat_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      WHERE cs.id = chat_messages.session_id AND cs.user_id = auth.uid()
    )
  );

-- ============================================================
-- AI JOBS (service-role writes; users see their own jobs)
-- ============================================================
CREATE POLICY "ai_jobs_select_own"
  ON public.ai_jobs FOR SELECT
  USING ((payload->>'user_id')::UUID = auth.uid());
