'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import { useRealtime } from './useRealtime'

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string
  metadata: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setNotifications(data ?? [])
        setLoading(false)
      })
  }, [user])

  useRealtime<Notification>({
    table: 'notifications',
    filter: user ? `user_id=eq.${user.id}` : undefined,
    enabled: !!user,
    onInsert: (row) => setNotifications((prev) => [row, ...prev]),
  })

  const markRead = async (id: string) => {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return { notifications, loading, unreadCount, markRead }
}
