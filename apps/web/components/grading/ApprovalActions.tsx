'use client'
import { useState } from 'react'

interface ApprovalActionsProps {
  gradeId: string
  onAction: (action: 'APPROVE' | 'OVERRIDE' | 'REJECT', justification: string) => Promise<void>
}

export function ApprovalActions({ gradeId, onAction }: ApprovalActionsProps) {
  const [justification, setJustification] = useState('')
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<'APPROVE' | 'OVERRIDE' | 'REJECT' | null>(null)

  async function submit() {
    if (!selected || (selected !== 'APPROVE' && !justification.trim())) return
    setLoading(true)
    await onAction(selected, justification)
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(['APPROVE', 'OVERRIDE', 'REJECT'] as const).map(action => (
          <button key={action} onClick={() => setSelected(action)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
              selected === action
                ? action === 'APPROVE' ? 'bg-green-600 text-white border-green-600'
                  : action === 'REJECT' ? 'bg-red-600 text-white border-red-600'
                  : 'bg-orange-500 text-white border-orange-500'
                : 'border-gray-300 text-[var(--color-text)] hover:bg-gray-50'
            }`}>
            {action === 'APPROVE' ? '✓ Approve' : action === 'OVERRIDE' ? '✏️ Override' : '✗ Reject'}
          </button>
        ))}
      </div>
      {selected && selected !== 'APPROVE' && (
        <textarea rows={3} value={justification} onChange={e => setJustification(e.target.value)}
          placeholder="Required: Provide justification for your decision..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
      )}
      {selected && (
        <button onClick={submit} disabled={loading || (selected !== 'APPROVE' && !justification.trim())}
          className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors">
          {loading ? 'Submitting…' : `Confirm ${selected}`}
        </button>
      )}
    </div>
  )
}
