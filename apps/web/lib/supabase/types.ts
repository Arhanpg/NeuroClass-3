/**
 * Auto-generated Supabase database types.
 * Regenerate with: supabase gen types typescript --project-id <ref> > apps/web/lib/supabase/types.ts
 *
 * This file is a placeholder until migrations are applied and types are generated.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN'
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          name: string
          code: string
          term: string
          instructor_id: string
          join_code: string
          pedagogy_style: string
          pedagogy_custom: string | null
          enrollment_cap: number
          is_archived: boolean
          vector_store_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          term: string
          instructor_id: string
          join_code?: string
          pedagogy_style?: string
          pedagogy_custom?: string | null
          enrollment_cap?: number
          is_archived?: boolean
          vector_store_id?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          code?: string
          term?: string
          pedagogy_style?: string
          pedagogy_custom?: string | null
          enrollment_cap?: number
          is_archived?: boolean
          vector_store_id?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      current_user_role: {
        Args: Record<string, never>
        Returns: string
      }
      is_enrolled: {
        Args: { p_course_id: string }
        Returns: boolean
      }
      is_course_instructor: {
        Args: { p_course_id: string }
        Returns: boolean
      }
      match_lecture_chunks: {
        Args: {
          query_embedding: number[]
          course_id_filter: string
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      user_role: 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN'
    }
  }
}
