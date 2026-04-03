/** User roles as defined in the profiles table */
export const USER_ROLES = {
  INSTRUCTOR: 'INSTRUCTOR',
  TEACHING_ASSISTANT: 'TEACHING_ASSISTANT',
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

/** Pedagogy styles available for courses */
export const PEDAGOGY_STYLES = [
  { value: 'DIRECT_INSTRUCTION', label: 'Direct Instruction' },
  { value: 'SOCRATIC', label: 'Socratic Method' },
  { value: 'GUIDED_DISCOVERY', label: 'Guided Discovery' },
  { value: 'FLIPPED_CLASSROOM', label: 'Flipped Classroom' },
  { value: 'CUSTOM', label: 'Custom' },
] as const

/** File size limits (in bytes) matching Supabase Storage bucket policies */
export const FILE_SIZE_LIMITS = {
  LECTURE_NOTES: 100 * 1024 * 1024,     // 100 MB
  DOUBT_IMAGE: 20 * 1024 * 1024,        // 20 MB
  DOUBT_PDF: 50 * 1024 * 1024,          // 50 MB
  PROJECT_SUBMISSION: 500 * 1024 * 1024, // 500 MB
  AVATAR: 5 * 1024 * 1024,              // 5 MB
} as const

/** Grading / approval statuses */
export const APPROVAL_STATUS = {
  PENDING_AI: 'PENDING_AI',
  PENDING_HITL: 'PENDING_HITL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

/** Interaction statuses for AI tutor sessions */
export const INTERACTION_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

/** Notification types */
export const NOTIFICATION_TYPES = {
  GRADE_APPROVAL_NEEDED: 'GRADE_APPROVAL_NEEDED',
  GRADE_RELEASED: 'GRADE_RELEASED',
  RANK_CHANGE: 'RANK_CHANGE',
  GENERAL: 'GENERAL',
} as const

/** App-wide route constants */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COURSES: '/dashboard/courses',
  ENROLL: '/dashboard/enroll',
  INSTRUCTOR: '/dashboard/instructor',
  ADMIN: '/dashboard/admin',
  SETTINGS: '/dashboard/settings',
} as const
