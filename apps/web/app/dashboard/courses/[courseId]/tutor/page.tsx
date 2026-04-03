'use client'
import { useState, useRef, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

interface Message { role: 'user' | 'assistant'; content: string; sources?: string[] }

export default function TutorPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const supabase = createBrowserClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId, message: userMsg }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.response ?? data.error ?? 'No response', sources: data.cited_sources }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Failed to reach AI service. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-140px)]">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-4">AI Tutor</h1>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-[var(--color-surface)] rounded-xl border border-gray-200">
        {messages.length === 0 && (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <p className="text-lg font-medium mb-1">Ask me anything about this course!</p>
            <p className="text-sm">I have access to all lecture notes and materials.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
              m.role === 'user'
                ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-[var(--color-text)] rounded-bl-sm'
            }`}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-white border border-gray-200 rounded-bl-sm">
              <div className="flex gap-1">
                {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about the course…"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        <button type="submit" disabled={loading || !input.trim()}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors">
          Send
        </button>
      </form>
    </div>
  )
}
