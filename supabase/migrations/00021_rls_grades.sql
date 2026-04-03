-- Migration: 00021_rls_grades

-- grades (pre-approval): INSTRUCTOR/TA only — students cannot see
CREATE POLICY "grades_select" ON public.grades
  FOR SELECT USING (
    public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "grades_update" ON public.grades
  FOR UPDATE USING (
    public.current_user_role() IN ('INSTRUCTOR','ADMIN')
  );

-- released_grades: own row (student) OR instructor/TA
CREATE POLICY "released_grades_select" ON public.released_grades
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

-- rubrics: SELECT — instructor/TA only
CREATE POLICY "rubrics_select" ON public.rubrics
  FOR SELECT USING (
    public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "rubrics_insert" ON public.rubrics
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'INSTRUCTOR'
  );

CREATE POLICY "rubrics_update" ON public.rubrics
  FOR UPDATE USING (
    public.current_user_role() = 'INSTRUCTOR'
  );

-- notifications: own row only
CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- audit_log: INSERT — service role only; SELECT — ADMIN only
CREATE POLICY "audit_log_select" ON public.audit_log
  FOR SELECT USING (public.current_user_role() = 'ADMIN');
