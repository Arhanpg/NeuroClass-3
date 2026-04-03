import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'NeuroClass', template: '%s — NeuroClass' },
  description: 'Autonomous AI Classroom Management Platform',
  manifest: '/manifest.json',
  themeColor: '#01696f',
  viewport: 'width=device-width, initial-scale=1',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Inline theme initialiser: prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nc-theme')||'system';document.documentElement.setAttribute('data-theme',t==='system'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t)}catch(e){}})()`
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
