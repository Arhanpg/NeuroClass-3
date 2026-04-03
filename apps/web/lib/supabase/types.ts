// Auto-generated Database types — regenerate after running migrations:
// npx supabase gen types typescript --linked > apps/web/lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: UserRole
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
        Insert: Partial<Database['public']['Tables']['courses']['Row']> & {
          name: string; code: string; term: string; instructor_id: string; join_code: string; pedagogy_style: string
        }
        Update: Partial<Database['public']['Tables']['courses']['Row']>
      }
      enrollments: {
        Row: { id: string; course_id: string; student_id: string; joined_at: string }
        Insert: { course_id: string; student_id: string }
        Update: never
      }
      lectures: {
        Row: {
          id: string
          course_id: string
          title: string
          storage_path: string
          file_type: 'PDF' | 'MARKDOWN'
          embedding_status: 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED'
          chunk_count: number
          uploaded_at: string
        }
        Insert: Omit<Database['public']['Tables']['lectures']['Row'], 'id' | 'chunk_count' | 'uploaded_at'> & { embedding_status?: string }
        Update: Partial<Database['public']['Tables']['lectures']['Row']>
      }
      interactions: {
        Row: {
          id: string
          course_id: string
          student_id: string
          thread_id: string
          text_payload: string
          attachment_urls: string[]
          agent_response: string | null
          cited_sources: Json | null
          agent_name: string | null
          status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
          execution_duration_ms: number | null
          created_at: string
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['interactions']['Row'], 'id' | 'agent_response' | 'cited_sources' | 'agent_name' | 'execution_duration_ms' | 'created_at' | 'completed_at'> & { status?: string }
        Update: Partial<Database['public']['Tables']['interactions']['Row']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          deep_link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'is_read' | 'created_at'>
        Update: { is_read?: boolean }
      }
    }
    Views: Record<string, never>
    Functions: {
      current_user_role: { Args: Record<string, never>; Returns: string }
      is_enrolled: { Args: { p_course_id: string }; Returns: boolean }
      is_course_instructor: { Args: { p_course_id: string }; Returns: boolean }
    }
    Enums: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type Lecture = Database['public']['Tables']['lectures']['Row']
export type Interaction = Database['public']['Tables']['interactions']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
