-- ============================================================
-- Migration 00003: Courses, Modules, Lessons, Resources
-- ============================================================

-- --------------------------------------------------------
-- COURSES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id  UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  order_index   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_classroom ON public.courses(classroom_id);

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- --------------------------------------------------------
-- MODULES (chapters within a course)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.modules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id    UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_modules_course ON public.modules(course_id);

CREATE TRIGGER trg_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- --------------------------------------------------------
-- LESSONS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id    UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'quiz', 'code_lab', 'slide')),
  content      JSONB NOT NULL DEFAULT '{}',   -- flexible: {url, body, quiz_id, ...}
  duration_min INTEGER,
  order_index  INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_module ON public.lessons(module_id);

CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- --------------------------------------------------------
-- LESSON PROGRESS (per student)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID NOT NULL REFERENCES public.lessons(id)  ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lesson_id, student_id)
);

CREATE INDEX idx_lesson_progress_student ON public.lesson_progress(student_id);

-- --------------------------------------------------------
-- RESOURCES (file attachments per classroom/lesson)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  lesson_id    UUID REFERENCES public.lessons(id)    ON DELETE SET NULL,
  uploader_id  UUID NOT NULL REFERENCES public.profiles(id),
  name         TEXT NOT NULL,
  file_url     TEXT NOT NULL,   -- Supabase Storage public/signed URL
  file_type    TEXT,            -- MIME type
  file_size_kb INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resources_classroom ON public.resources(classroom_id);
CREATE INDEX idx_resources_lesson    ON public.resources(lesson_id);
