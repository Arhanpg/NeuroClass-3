export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 rounded-xl border border-border bg-card shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">NeuroClass</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <p className="text-center text-muted-foreground text-sm">
          Authentication UI — Phase 1
        </p>
      </div>
    </main>
  )
}
