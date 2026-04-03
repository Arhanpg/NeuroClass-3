interface Source { lecture_id: string; chunk_index: number; section_title?: string }

export function SourceCitation({ sources }: { sources: Source[] }) {
  if (!sources?.length) return null
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {sources.map((s, i) => (
        <span key={i} title={s.section_title}
          className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 cursor-default">
          📎 {s.section_title ?? `Chunk ${s.chunk_index}`}
        </span>
      ))}
    </div>
  )
}
