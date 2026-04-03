// Route group layout - pass-through only, no UI wrapping here.
// The actual dashboard layout (sidebar + header) is in app/dashboard/layout.tsx
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
