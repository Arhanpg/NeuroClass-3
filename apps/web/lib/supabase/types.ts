/**
 * Database type definitions for Supabase.
 * 
 * IMPORTANT: This file is a scaffold. After running all migrations,
 * regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > apps/web/lib/supabase/types.ts
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

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = Profile['role'];
