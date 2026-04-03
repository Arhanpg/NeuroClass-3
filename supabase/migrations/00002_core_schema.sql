-- ============================================================
-- Migration: 00002_core_schema
-- Creates all Phase 0/1/2 tables with RLS policies
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.pedagogy_type AS ENUM ('socratic', 'project_based', 'direct');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.grade_status AS ENUM ('pending_review', 'approved', 'overridden', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- PROFILES  (extends auth.users 1:1)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        public.user_role NOT NULL DEFAULT 'student',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: users read own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: users insert own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: users update own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger: auto-create profile stub on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: keep updated_at current
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- COURSES
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_join_code()
RETURNS TEXT LANGUAGE sql AS $$
  SELECT upper(substr(md5(random()::text), 1, 6));
$$;

CREATE TABLE IF NOT EXISTS public.courses (
  id              UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT,
  instructor_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  join_code       TEXT NOT NULL UNIQUE DEFAULT public.generate_join_code(),
  pedagogy        public.pedagogy_type NOT NULL DEFAULT 'direct',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS courses_instructor_id_idx ON public.courses(instructor_id);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "courses: instructor full access" ON public.courses
  USING (
    auth.uid() = instructor_id
    OR EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = courses.id AND e.student_id = auth.uid()
    )
  );

CREATE POLICY "courses: instructor insert" ON public.courses
  FOR INSERT WITH CHECK (
    auth.uid() = instructor_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'instructor')
  );

CREATE POLICY "courses: instructor update" ON public.courses
  FOR UPDATE USING (auth.uid() = instructor_id);

CREATE POLICY "courses: instructor delete" ON public.courses
  FOR DELETE USING (auth.uid() = instructor_id);

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ENROLLMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

CREATE INDEX IF NOT EXISTS enrollments_student_id_idx ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS enrollments_course_id_idx ON public.enrollments(course_id);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enrollments: student reads own" ON public.enrollments
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.instructor_id = auth.uid())
  );

CREATE POLICY "enrollments: student self-enroll" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "enrollments: student self-unenroll" ON public.enrollments
  FOR DELETE USING (auth.uid() = student_id);

-- ============================================================
-- LECTURE NOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lecture_notes (
  id            UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  mime_type     TEXT NOT NULL DEFAULT 'application/pdf',
  ingested      BOOLEAN NOT NULL DEFAULT FALSE,
  ingested_at   TIMESTAMPTZ,
  uploaded_by   UUID NOT NULL REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lecture_notes_course_id_idx ON public.lecture_notes(course_id);

ALTER TABLE public.lecture_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lecture_notes: enrolled can read" ON public.lecture_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      LEFT JOIN public.enrollments e ON e.course_id = c.id AND e.student_id = auth.uid()
      WHERE c.id = course_id AND (c.instructor_id = auth.uid() OR e.id IS NOT NULL)
    )
  );

CREATE POLICY "lecture_notes: instructor insert" ON public.lecture_notes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "lecture_notes: instructor delete" ON public.lecture_notes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
  );

-- ============================================================
-- LECTURE CHUNKS (pgvector RAG store)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lecture_chunks (
  id              UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  lecture_note_id UUID NOT NULL REFERENCES public.lecture_notes(id) ON DELETE CASCADE,
  course_id       UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chunk_index     INT NOT NULL,
  content         TEXT NOT NULL,
  embedding       extensions.vector(1536),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lecture_chunks_course_id_idx ON public.lecture_chunks(course_id);
CREATE INDEX IF NOT EXISTS lecture_chunks_embedding_idx
  ON public.lecture_chunks USING ivfflat (embedding extensions.vector_cosine_ops)
  WITH (lists = 100);

ALTER TABLE public.lecture_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lecture_chunks: enrolled can read" ON public.lecture_chunks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      LEFT JOIN public.enrollments e ON e.course_id = c.id AND e.student_id = auth.uid()
      WHERE c.id = course_id AND (c.instructor_id = auth.uid() OR e.id IS NOT NULL)
    )
  );

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  rubric_id   UUID,  -- FK added after rubrics table
  deadline    TIMESTAMPTZ,
  created_by  UUID NOT NULL REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_course_id_idx ON public.projects(course_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects: enrolled can read" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      LEFT JOIN public.enrollments e ON e.course_id = c.id AND e.student_id = auth.uid()
      WHERE c.id = course_id AND (c.instructor_id = auth.uid() OR e.id IS NOT NULL)
    )
  );

CREATE POLICY "projects: instructor insert" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "projects: instructor update" ON public.projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TEAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id              UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  github_repo_url TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS teams_project_id_idx ON public.teams(project_id);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teams: project members can read" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm WHERE tm.team_id = teams.id AND tm.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.courses c ON c.id = p.course_id
      WHERE p.id = project_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "teams: students can create" ON public.teams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.enrollments e ON e.course_id = p.course_id AND e.student_id = auth.uid()
      WHERE p.id = project_id
    )
  );

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  team_id     UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, student_id)
);

CREATE INDEX IF NOT EXISTS team_members_team_id_idx ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_student_id_idx ON public.team_members(student_id);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members: self read" ON public.team_members
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM public.team_members tm2 WHERE tm2.team_id = team_id AND tm2.student_id = auth.uid())
  );

CREATE POLICY "team_members: self join" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "team_members: self leave" ON public.team_members
  FOR DELETE USING (auth.uid() = student_id);

-- ============================================================
-- RUBRICS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rubrics (
  id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  criteria    JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by  UUID NOT NULL REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rubrics_course_id_idx ON public.rubrics(course_id);

ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rubrics: enrolled can read" ON public.rubrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      LEFT JOIN public.enrollments e ON e.course_id = c.id AND e.student_id = auth.uid()
      WHERE c.id = course_id AND (c.instructor_id = auth.uid() OR e.id IS NOT NULL)
    )
  );

CREATE POLICY "rubrics: instructor manage" ON public.rubrics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE TRIGGER rubrics_updated_at
  BEFORE UPDATE ON public.rubrics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add FK from projects to rubrics now that rubrics table exists
ALTER TABLE public.projects
  ADD CONSTRAINT IF NOT EXISTS projects_rubric_id_fkey
  FOREIGN KEY (rubric_id) REFERENCES public.rubrics(id) ON DELETE SET NULL;

-- ============================================================
-- GRADES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.grades (
  id                UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  team_id           UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  rubric_id         UUID NOT NULL REFERENCES public.rubrics(id),
  total_score       NUMERIC(5,2) NOT NULL DEFAULT 0,
  criterion_scores  JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_justification  TEXT,
  status            public.grade_status NOT NULL DEFAULT 'pending_review',
  reviewed_by       UUID REFERENCES public.profiles(id),
  reviewed_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS grades_team_id_idx ON public.grades(team_id);
CREATE INDEX IF NOT EXISTS grades_status_idx ON public.grades(status);

ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "grades: team members read own" ON public.grades
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = grades.team_id AND student_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.teams t
      JOIN public.projects p ON p.id = t.project_id
      JOIN public.courses c ON c.id = p.course_id
      WHERE t.id = grades.team_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "grades: instructor update" ON public.grades
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      JOIN public.projects p ON p.id = t.project_id
      JOIN public.courses c ON c.id = p.course_id
      WHERE t.id = grades.team_id AND c.instructor_id = auth.uid()
    )
  );

CREATE TRIGGER grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  data        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(user_id, read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications: user reads own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications: user updates own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS  (run via Supabase dashboard or CLI)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('lecture-notes', 'lecture-notes', false) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-artifacts', 'project-artifacts', false) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- ============================================================
-- REALTIME  — enable for Realtime subscriptions
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grades;
