export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-auto bg-slate-950">
      {children}
    </main>
  )
}
