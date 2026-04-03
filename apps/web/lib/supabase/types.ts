// Auto-generate with: supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
// Run after each migration

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'student' | 'instructor' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'student' | 'instructor' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'student' | 'instructor' | 'admin'
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          instructor_id: string
          join_code: string
          pedagogy: 'socratic' | 'project_based' | 'direct'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          instructor_id: string
          join_code?: string
          pedagogy?: 'socratic' | 'project_based' | 'direct'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          pedagogy?: 'socratic' | 'project_based' | 'direct'
          is_active?: boolean
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          course_id: string
          student_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          course_id: string
          student_id: string
          enrolled_at?: string
        }
        Update: Record<string, never>
      }
      lecture_notes: {
        Row: {
          id: string
          course_id: string
          title: string
          storage_path: string
          mime_type: string
          ingested: boolean
          ingested_at: string | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          storage_path: string
          mime_type: string
          ingested?: boolean
          ingested_at?: string | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          title?: string
          ingested?: boolean
          ingested_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          rubric_id: string | null
          deadline: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          rubric_id?: string | null
          deadline?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          rubric_id?: string | null
          deadline?: string | null
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          project_id: string
          name: string
          github_repo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          github_repo_url?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          github_repo_url?: string | null
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          student_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          student_id: string
          joined_at?: string
        }
        Update: Record<string, never>
      }
      rubrics: {
        Row: {
          id: string
          course_id: string
          title: string
          criteria: Json
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          criteria: Json
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          criteria?: Json
          updated_at?: string
        }
      }
      grades: {
        Row: {
          id: string
          team_id: string
          rubric_id: string
          total_score: number
          criterion_scores: Json
          ai_justification: string | null
          status: 'pending_review' | 'approved' | 'overridden' | 'rejected'
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          rubric_id: string
          total_score: number
          criterion_scores: Json
          ai_justification?: string | null
          status?: 'pending_review' | 'approved' | 'overridden' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          total_score?: number
          criterion_scores?: Json
          status?: 'pending_review' | 'approved' | 'overridden' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          read?: boolean
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      generate_join_code: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      user_role: 'student' | 'instructor' | 'admin'
      pedagogy_type: 'socratic' | 'project_based' | 'direct'
      grade_status: 'pending_review' | 'approved' | 'overridden' | 'rejected'
    }
  }
}
