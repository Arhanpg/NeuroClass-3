import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'TEACHING_ASSISTANT']),
})

export const courseSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  code: z.string().min(2).max(20, 'Course code max 20 characters'),
  term: z.string().min(2, 'Term is required'),
  description: z.string().optional(),
  pedagogy_style: z.enum(['SOCRATIC', 'DIRECT', 'INQUIRY', 'PROJECT_BASED']),
})

export const enrollSchema = z.object({
  join_code: z.string().length(8, 'Join code must be exactly 8 characters').toUpperCase(),
})

export const rubricCriterionSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  weight: z.number().min(0).max(1),
  max_score: z.number().min(1).max(100),
})

export const rubricSchema = z.object({
  name: z.string().min(2),
  criteria: z.array(rubricCriterionSchema).min(1),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type RubricInput = z.infer<typeof rubricSchema>
