'use client'

import type { Notification } from '@/lib/hooks/useNotifications'
import { cn } from '@/lib/utils/cn'

interface Props {
  notification: Notification
  onRead: (id: string) => void
}

export function NotificationItem({ notification, onRead }: Props) {
  return (
    <button
      onClick={() => onRead(notification.id)}
      className={cn(
        'w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors',
        !notification.is_read && 'bg-indigo-500/5'
      )}
    >
      <div className="flex items-start gap-3">
        {!notification.is_read && (
          <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
        )}
        <div className={cn(!notification.is_read ? '' : 'pl-5')}>
          <p className="text-sm font-medium text-white">{notification.title}</p>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.body}</p>
          <p className="text-[10px] text-slate-500 mt-1">
            {new Date(notification.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </button>
  )
}
