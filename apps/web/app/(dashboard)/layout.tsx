import { DashboardShell } from '@/components/layout/DashboardShell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Dashboard | NeuroClass', template: '%s | NeuroClass' },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
