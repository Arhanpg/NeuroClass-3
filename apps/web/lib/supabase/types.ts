/**
 * Database type definitions for Supabase.
 *
 * IMPORTANT: This file is a scaffold. After running all migrations,
 * regenerate with:
 *   npx supabase gen types typescript --project-id tvizwaysproajwebglwv > apps/web/lib/supabase/types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          avatar_url?: string | null;
          role?: 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN';
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          code: string;
          term: string;
          instructor_id: string;
          join_code: string;
          pedagogy_style: 'SOCRATIC' | 'DIRECT' | 'GUIDED' | 'FLIPPED' | 'CUSTOM';
          pedagogy_custom: string | null;
          enrollment_cap: number;
          is_archived: boolean;
          vector_store_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          term: string;
          instructor_id: string;
          join_code?: string;
          pedagogy_style?: 'SOCRATIC' | 'DIRECT' | 'GUIDED' | 'FLIPPED' | 'CUSTOM';
          pedagogy_custom?: string | null;
          enrollment_cap?: number;
          is_archived?: boolean;
          vector_store_id?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          code?: string;
          term?: string;
          pedagogy_style?: 'SOCRATIC' | 'DIRECT' | 'GUIDED' | 'FLIPPED' | 'CUSTOM';
          pedagogy_custom?: string | null;
          enrollment_cap?: number;
          is_archived?: boolean;
          vector_store_id?: string | null;
        };
      };
      enrollments: {
        Row: {
          id: string;
          course_id: string;
          student_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          student_id: string;
          joined_at?: string;
        };
        Update: {
          joined_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_enrolled: {
        Args: { p_course_id: string };
        Returns: boolean;
      };
      is_course_instructor: {
        Args: { p_course_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
};

// ── Convenience type aliases ──────────────────────────────────────────────────
export type Profile    = Database['public']['Tables']['profiles']['Row'];
export type UserRole   = Profile['role'];
export type Course     = Database['public']['Tables']['courses']['Row'];
export type CourseInsert = Database['public']['Tables']['courses']['Insert'];
export type CourseUpdate = Database['public']['Tables']['courses']['Update'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
