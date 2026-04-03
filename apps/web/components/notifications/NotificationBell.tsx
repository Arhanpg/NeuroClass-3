'use client'
import { useEffect, useState, useRef } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

interface Notification { id: string; title: string; body: string; deep_link?: string; is_read: boolean; created_at: string }

export function NotificationBell({ userId }: { userId: string }) {
  const supabase = createBrowserClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const unread = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setNotifications(data) })

    const channel = supabase.channel('notifications:' + userId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        payload => setNotifications(prev => [payload.new as Notification, ...prev])
      ).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId])

  async function markAllRead() {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
    setNotifications(n => n.map(x => ({ ...x, is_read: true })))
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="relative p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-gray-100 transition-colors" aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-[var(--color-text)] text-sm">Notifications</span>
            {unread > 0 && <button onClick={markAllRead} className="text-xs text-[var(--color-primary)] hover:underline">Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">No notifications</div>
            ) : notifications.map(n => (
              <a key={n.id} href={n.deep_link ?? '#'}
                className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50' : ''}`}>
                <p className="text-sm font-medium text-[var(--color-text)]">{n.title}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{n.body}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
