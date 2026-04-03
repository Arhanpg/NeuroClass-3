-- Migration 00020: RLS for lectures + lecture_chunks + interactions

-- lectures
CREATE POLICY "lectures_select" ON public.lectures
  FOR SELECT USING (
    public.is_enrolled(course_id)
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

CREATE POLICY "lectures_insert_instructor" ON public.lectures
  FOR INSERT WITH CHECK (public.is_course_instructor(course_id));

CREATE POLICY "lectures_update_instructor" ON public.lectures
  FOR UPDATE USING (public.is_course_instructor(course_id));

CREATE POLICY "lectures_delete_instructor" ON public.lectures
  FOR DELETE USING (public.is_course_instructor(course_id));

-- lecture_chunks: only service role writes; enrolled users read
CREATE POLICY "lecture_chunks_select" ON public.lecture_chunks
  FOR SELECT USING (
    public.is_enrolled(course_id)
    OR public.is_course_instructor(course_id)
  );

-- interactions
CREATE POLICY "interactions_select" ON public.interactions
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() = 'TEACHING_ASSISTANT'
  );

CREATE POLICY "interactions_insert_enrolled" ON public.interactions
  FOR INSERT WITH CHECK (
    student_id = auth.uid()
    AND public.is_enrolled(course_id)
  );

CREATE POLICY "interactions_update_own" ON public.interactions
  FOR UPDATE USING (student_id = auth.uid());
