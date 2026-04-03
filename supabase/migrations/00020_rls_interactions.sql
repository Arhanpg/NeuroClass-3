-- Migration: 00020_rls_interactions

-- interactions: SELECT — own row OR instructor/TA of course
CREATE POLICY "interactions_select" ON public.interactions
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() = 'TEACHING_ASSISTANT'
  );

-- interactions: INSERT — enrolled student submitting own interaction
CREATE POLICY "interactions_insert" ON public.interactions
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
    AND public.is_enrolled(course_id)
  );

-- interactions: UPDATE — service role only (AI writes response back)
CREATE POLICY "interactions_update" ON public.interactions
  FOR UPDATE USING (public.current_user_role() IN ('ADMIN'));

-- lecture_chunks: SELECT — enrolled + instructor + TA
CREATE POLICY "lecture_chunks_select" ON public.lecture_chunks
  FOR SELECT USING (
    public.is_enrolled(course_id)
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );
