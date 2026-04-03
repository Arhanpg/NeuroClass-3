-- NeuroClass Dev Seed Data
-- Run after all migrations are applied: supabase db reset
-- Creates test users, a sample course, and initial data for local development.

-- NOTE: In production, users are created via Supabase Auth (not direct SQL inserts).
-- This seed is for LOCAL DEVELOPMENT ONLY.

-- Insert test users into auth.users (Supabase Auth managed table)
-- Passwords are all: TestPassword123!
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'instructor@neuroclass.dev',
    crypt('TestPassword123!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Dr. Priya Sharma"}',
    false, 'authenticated'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'student1@neuroclass.dev',
    crypt('TestPassword123!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Arhan Ghosarwade"}',
    false, 'authenticated'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'student2@neuroclass.dev',
    crypt('TestPassword123!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rohan Patil"}',
    false, 'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert profiles (normally auto-created by DB trigger on auth.users insert)
INSERT INTO public.profiles (id, email, full_name, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'instructor@neuroclass.dev', 'Dr. Priya Sharma', 'INSTRUCTOR'),
  ('00000000-0000-0000-0000-000000000002', 'student1@neuroclass.dev', 'Arhan Ghosarwade', 'STUDENT'),
  ('00000000-0000-0000-0000-000000000003', 'student2@neuroclass.dev', 'Rohan Patil', 'STUDENT')
ON CONFLICT (id) DO NOTHING;

-- Insert a sample course
INSERT INTO public.courses (id, name, code, term, instructor_id, join_code, pedagogy_style)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Introduction to Machine Learning',
  'CS-401',
  'Spring 2026',
  '00000000-0000-0000-0000-000000000001',
  'ML2026X',
  'SOCRATIC'
)
ON CONFLICT (id) DO NOTHING;

-- Enroll students
INSERT INTO public.enrollments (course_id, student_id)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;
