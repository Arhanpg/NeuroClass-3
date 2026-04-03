'use client'
import { useState } from 'react'

export function CodeBlock({ code, language = 'text' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 my-2">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-200">
        <span className="text-xs font-mono text-gray-500">{language}</span>
        <button onClick={copy} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm bg-gray-50">
        <code>{code}</code>
      </pre>
    </div>
  )
}
