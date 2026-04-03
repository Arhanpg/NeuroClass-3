-- Migration 00021: RLS for projects + teams + rubrics + grades + released_grades

-- projects
CREATE POLICY "projects_select" ON public.projects
  FOR SELECT USING (
    public.is_enrolled(course_id)
    OR public.is_course_instructor(course_id)
    OR public.current_user_role() IN ('ADMIN','TEACHING_ASSISTANT')
  );

CREATE POLICY "projects_insert_instructor" ON public.projects
  FOR INSERT WITH CHECK (public.is_course_instructor(course_id));

CREATE POLICY "projects_update_instructor" ON public.projects
  FOR UPDATE USING (public.is_course_instructor(course_id));

-- teams
CREATE POLICY "teams_select" ON public.teams
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.team_members tm
            JOIN public.projects p ON p.id = project_id
            WHERE tm.team_id = teams.id AND tm.student_id = auth.uid())
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "teams_insert_student" ON public.teams
  FOR INSERT WITH CHECK (public.current_user_role() = 'STUDENT');

-- team_members
CREATE POLICY "team_members_select" ON public.team_members
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "team_members_insert_own" ON public.team_members
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- rubrics: instructor/TA only
CREATE POLICY "rubrics_select_staff" ON public.rubrics
  FOR SELECT USING (
    public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "rubrics_insert_instructor" ON public.rubrics
  FOR INSERT WITH CHECK (public.current_user_role() = 'INSTRUCTOR');

CREATE POLICY "rubrics_update_instructor" ON public.rubrics
  FOR UPDATE USING (instructor_id = auth.uid());

-- grades: instructor/TA only (NOT students)
CREATE POLICY "grades_select_staff" ON public.grades
  FOR SELECT USING (
    public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );

CREATE POLICY "grades_update_instructor" ON public.grades
  FOR UPDATE USING (
    public.is_course_instructor(
      (SELECT course_id FROM public.projects WHERE id = grades.project_id)
    )
  );

-- released_grades: own row or instructor/TA
CREATE POLICY "released_grades_select" ON public.released_grades
  FOR SELECT USING (
    student_id = auth.uid()
    OR public.current_user_role() IN ('INSTRUCTOR','TEACHING_ASSISTANT','ADMIN')
  );
