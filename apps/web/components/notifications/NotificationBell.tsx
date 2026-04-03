'use client'

import { useState } from 'react'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

export function NotificationBell() {
  const { notifications, unreadCount, markRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-slate-400">{unreadCount} unread</span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-700">
              {notifications.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">All caught up!</p>
              ) : (
                notifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} onRead={markRead} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
