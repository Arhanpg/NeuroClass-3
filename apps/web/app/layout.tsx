import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NeuroClass',
    template: '%s | NeuroClass',
  },
  description:
    'Autonomous AI Classroom Management Platform — AI Tutor, Automated Grading, Real-time Leaderboards.',
  keywords: ['education', 'AI tutor', 'classroom', 'grading', 'LangGraph'],
  authors: [{ name: 'NeuroClass Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NeuroClass',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f2' },
    { media: '(prefers-color-scheme: dark)', color: '#171614' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
