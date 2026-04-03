/**
 * Shared TypeScript types used across both apps/web and apps/ai-service (via OpenAPI).
 * Keep this file framework-agnostic — no Next.js or Python-specific imports.
 */

// ---- User & Auth ----
export type UserRole = 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'STUDENT' | 'ADMIN'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// ---- Course ----
export type PedagogyStyle =
  | 'DIRECT_INSTRUCTION'
  | 'SOCRATIC'
  | 'GUIDED_DISCOVERY'
  | 'FLIPPED_CLASSROOM'
  | 'CUSTOM'

export interface Course {
  id: string
  name: string
  code: string
  term: string
  instructor_id: string
  join_code: string
  pedagogy_style: PedagogyStyle
  pedagogy_custom?: string | null
  enrollment_cap: number
  is_archived: boolean
  created_at: string
}

// ---- AI Tutor ----
export type InteractionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface Interaction {
  id: string
  course_id: string
  student_id: string
  thread_id: string
  text_payload?: string
  attachment_urls: string[]
  agent_response?: string
  cited_sources?: CitedSource[]
  agent_name?: string
  status: InteractionStatus
  execution_duration_ms?: number
  created_at: string
  completed_at?: string
}

export interface CitedSource {
  lecture_id: string
  chunk_index: number
  section_title: string
}

// ---- AI Service API Payloads ----
export interface InvokePayload {
  thread_id: string
  student_id: string
  course_id: string
  message: string
  attachments?: string[]
}

export interface InvokeResponse {
  response: string
  cited_sources: CitedSource[]
  agent_name: string
  execution_duration_ms: number
}

export interface IngestPayload {
  course_id: string
  lecture_id: string
  storage_path: string
  file_type: 'PDF' | 'MARKDOWN'
}

// ---- Grading ----
export type ApprovalStatus = 'PENDING_AI' | 'PENDING_HITL' | 'APPROVED' | 'REJECTED'

export interface RubricCriterion {
  name: string
  weight: number
  max_score: number
  description: string
}

export interface RubricSchema {
  criteria: RubricCriterion[]
  total_weight: number
}

// ---- Notifications ----
export type NotificationType =
  | 'GRADE_APPROVAL_NEEDED'
  | 'GRADE_RELEASED'
  | 'RANK_CHANGE'
  | 'GENERAL'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  deep_link?: string
  is_read: boolean
  created_at: string
}
