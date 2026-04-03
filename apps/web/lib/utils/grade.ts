/**
 * Maps a normalized score (0-100) to a letter grade.
 * Standard 10-point scale used throughout NeuroClass.
 */
export function scoreToLetterGrade(score: number): string {
  if (score >= 97) return 'A+'
  if (score >= 93) return 'A'
  if (score >= 90) return 'A-'
  if (score >= 87) return 'B+'
  if (score >= 83) return 'B'
  if (score >= 80) return 'B-'
  if (score >= 77) return 'C+'
  if (score >= 73) return 'C'
  if (score >= 70) return 'C-'
  if (score >= 67) return 'D+'
  if (score >= 63) return 'D'
  if (score >= 60) return 'D-'
  return 'F'
}

/** Returns tailwind color class based on letter grade */
export function gradeColor(letterGrade: string): string {
  if (letterGrade.startsWith('A')) return 'text-green-600 dark:text-green-400'
  if (letterGrade.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
  if (letterGrade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400'
  if (letterGrade.startsWith('D')) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}
