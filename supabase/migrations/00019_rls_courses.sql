-- Migration: 00019_rls_courses

ALTER TABLE public.courses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- COURSES: instructors see own; students see enrolled
CREATE POLICY "courses: instructor owns"
  ON public.courses FOR ALL
  USING (instructor_id = auth.uid());

CREATE POLICY "courses: enrolled student read"
  ON public.courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = id AND e.student_id = auth.uid()
    )
  );

-- ENROLLMENTS
CREATE POLICY "enrollments: student own"
  ON public.enrollments FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "enrollments: student self-enroll"
  ON public.enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "enrollments: instructor reads"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

-- LECTURES: instructor full, enrolled student read
CREATE POLICY "lectures: instructor full"
  ON public.lectures FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "lectures: enrolled student read"
  ON public.lectures FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = course_id AND e.student_id = auth.uid()
    )
  );

-- PROJECTS: instructor full, enrolled student read
CREATE POLICY "projects: instructor full"
  ON public.projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "projects: enrolled student read"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = course_id AND e.student_id = auth.uid()
    )
  );
