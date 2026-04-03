export const metadata = { title: 'Classrooms — NeuroClass' }

export default function ClassroomsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-nc-text">Classrooms</h1>
        <button className="rounded-lg bg-nc-primary px-4 py-2 text-sm font-medium text-white hover:bg-nc-primary-hover transition">
          + New Classroom
        </button>
      </div>
      <div className="rounded-xl border border-nc-border bg-nc-surface p-12 text-center">
        <p className="text-nc-muted text-sm">Classrooms list — Phase 3</p>
      </div>
    </div>
  )
}
