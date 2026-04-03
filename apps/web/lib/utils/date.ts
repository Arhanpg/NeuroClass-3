import { format, formatDistanceToNow, parseISO } from 'date-fns'

/** Format ISO date string to human-readable date */
export function formatDate(dateStr: string, fmt = 'dd MMM yyyy') {
  return format(parseISO(dateStr), fmt)
}

/** Format ISO date string to relative time (e.g. "2 hours ago") */
export function formatRelative(dateStr: string) {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
}

/** Format ISO datetime to short form */
export function formatDateTime(dateStr: string) {
  return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm')
}
