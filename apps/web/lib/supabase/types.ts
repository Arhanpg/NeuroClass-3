// Auto-generated from live Supabase schema — regenerate after migrations:
// npx supabase gen types typescript --linked > apps/web/lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      checkpointer: {
        Row: {
          created_at: string | null
          id: string
          state: Json
          thread_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          state: Json
          thread_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          state?: Json
          thread_id?: string
        }
        Relationships: []
      }
      commit_logs: {
        Row: {
          author_github: string
          author_user_id: string | null
          committed_at: string
          complexity: string | null
          id: string
          lines_added: number | null
          lines_deleted: number | null
          message: string
          project_id: string
          sha: string
          synced_at: string | null
          team_id: string | null
        }
        Insert: {
          author_github: string
          author_user_id?: string | null
          committed_at: string
          complexity?: string | null
          id?: string
          lines_added?: number | null
          lines_deleted?: number | null
          message: string
          project_id: string
          sha: string
          synced_at?: string | null
          team_id?: string | null
        }
        Update: {
          author_github?: string
          author_user_id?: string | null
          committed_at?: string
          complexity?: string | null
          id?: string
          lines_added?: number | null
          lines_deleted?: number | null
          message?: string
          project_id?: string
          sha?: string
          synced_at?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commit_logs_author_user_id_fkey"
            columns: ["author_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commit_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commit_logs_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string
          id: string
          instructor_id: string
          join_code: string
          pedagogy: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: string
          instructor_id: string
          join_code?: string
          pedagogy?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          instructor_id?: string
          join_code?: string
          pedagogy?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          enrolled_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          ai_justification: string | null
          graded_at: string | null
          id: string
          instructor_notes: string | null
          project_id: string
          reviewed_at: string | null
          rubric_id: string
          scores: Json
          status: string
          student_id: string
          total: number | null
        }
        Insert: {
          ai_justification?: string | null
          graded_at?: string | null
          id?: string
          instructor_notes?: string | null
          project_id: string
          reviewed_at?: string | null
          rubric_id: string
          scores?: Json
          status?: string
          student_id: string
          total?: number | null
        }
        Update: {
          ai_justification?: string | null
          graded_at?: string | null
          id?: string
          instructor_notes?: string | null
          project_id?: string
          reviewed_at?: string | null
          rubric_id?: string
          scores?: Json
          status?: string
          student_id?: string
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_rubric_id_fkey"
            columns: ["rubric_id"]
            isOneToOne: false
            referencedRelation: "rubrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          content: string
          course_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          thread_id?: string
          user_id: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          course_id: string
          id: string
          rank: number
          score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          id?: string
          rank: number
          score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          id?: string
          rank?: number
          score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lecture_chunks: {
        Row: {
          chunk_index: number
          content: string
          course_id: string
          created_at: string | null
          embedding: string | null
          id: string
          lecture_id: string
        }
        Insert: {
          chunk_index: number
          content: string
          course_id: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          lecture_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          course_id?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          lecture_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lecture_chunks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lecture_chunks_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          course_id: string
          created_at: string | null
          file_type: string | null
          file_url: string | null
          id: string
          status: string | null
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lectures_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          course_id: string
          created_at: string | null
          description: string
          due_date: string | null
          github_url: string | null
          id: string
          max_team_size: number | null
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string
          due_date?: string | null
          github_url?: string | null
          id?: string
          max_team_size?: number | null
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string
          due_date?: string | null
          github_url?: string | null
          id?: string
          max_team_size?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      released_grades: {
        Row: {
          grade_id: string
          id: string
          letter_grade: string | null
          project_id: string
          released_at: string | null
          student_id: string
          total: number
        }
        Insert: {
          grade_id: string
          id?: string
          letter_grade?: string | null
          project_id: string
          released_at?: string | null
          student_id: string
          total: number
        }
        Update: {
          grade_id?: string
          id?: string
          letter_grade?: string | null
          project_id?: string
          released_at?: string | null
          student_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "released_grades_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: true
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "released_grades_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "released_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rubrics: {
        Row: {
          course_id: string
          created_at: string | null
          created_by: string
          criteria: Json
          id: string
          project_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          created_by: string
          criteria?: Json
          id?: string
          project_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          created_by?: string
          criteria?: Json
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rubrics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rubrics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rubrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      match_lecture_chunks: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
          filter_course_id?: string
        }
        Returns: {
          id: string
          lecture_id: string
          course_id: string
          content: string
          chunk_index: number
          similarity: number
        }[]
      }
    }
    Enums: Record<string, never>
  }
}

// ---- Convenience type aliases ----
export type Profile       = Database['public']['Tables']['profiles']['Row']
export type Course        = Database['public']['Tables']['courses']['Row']
export type Enrollment    = Database['public']['Tables']['enrollments']['Row']
export type Lecture       = Database['public']['Tables']['lectures']['Row']
export type LectureChunk  = Database['public']['Tables']['lecture_chunks']['Row']
export type Interaction   = Database['public']['Tables']['interactions']['Row']
export type Notification  = Database['public']['Tables']['notifications']['Row']
export type Project       = Database['public']['Tables']['projects']['Row']
export type Team          = Database['public']['Tables']['teams']['Row']
export type TeamMember    = Database['public']['Tables']['team_members']['Row']
export type Rubric        = Database['public']['Tables']['rubrics']['Row']
export type Grade         = Database['public']['Tables']['grades']['Row']
export type CommitLog     = Database['public']['Tables']['commit_logs']['Row']
export type AuditLog      = Database['public']['Tables']['audit_log']['Row']
export type UserRole      = 'student' | 'instructor' | 'admin'
