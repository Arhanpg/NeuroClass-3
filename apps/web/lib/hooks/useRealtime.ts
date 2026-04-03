'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Options<T> {
  table: string
  filter?: string           // e.g. 'course_id=eq.abc-123'
  onInsert?: (row: T) => void
  onUpdate?: (row: T) => void
  onDelete?: (row: T) => void
  enabled?: boolean
}

export function useRealtime<T = Record<string, unknown>>({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: Options<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!enabled) return

    const supabase = createClient()
    const channelName = `realtime:${table}:${filter ?? 'all'}:${Date.now()}`

    let q = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table, filter } as Parameters<typeof supabase.channel>[0] extends never ? never : any,
        (payload) => onInsert?.(payload.new as T)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table, filter } as any,
        (payload) => onUpdate?.(payload.new as T)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table, filter } as any,
        (payload) => onDelete?.(payload.old as T)
      )

    channelRef.current = q.subscribe()

    return () => {
      supabase.removeChannel(channelRef.current!)
    }
  }, [table, filter, enabled])
}
