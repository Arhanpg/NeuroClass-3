'use client'
import { useState } from 'react'

export function JoinCodeDisplay({ joinCode }: { joinCode: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <code className="font-mono font-bold text-[var(--color-primary)] text-xl tracking-wider">{joinCode}</code>
      <button onClick={copy} className="text-xs px-2 py-1 border border-gray-300 rounded-md text-[var(--color-text-muted)] hover:bg-gray-50 transition-colors">
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}
