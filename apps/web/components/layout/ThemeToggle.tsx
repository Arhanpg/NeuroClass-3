'use client'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDark(mq.matches)
    document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  }

  return (
    <button onClick={toggle} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-gray-100 transition-colors">
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
