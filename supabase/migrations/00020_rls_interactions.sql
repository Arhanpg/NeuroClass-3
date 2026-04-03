-- Migration: 00020_rls_interactions

ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Students see only their own interactions
CREATE POLICY "interactions: student own"
  ON public.interactions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "interactions: student insert"
  ON public.interactions FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Instructors can read all interactions for their courses
CREATE POLICY "interactions: instructor read course"
  ON public.interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

-- Service role (AI backend) full access
CREATE POLICY "interactions: service full"
  ON public.interactions
  USING (auth.role() = 'service_role');
