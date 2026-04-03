'use client'
import { useState } from 'react'

interface Criterion { name: string; weight: number; max_score: number; description: string }

export function RubricEditor({ onSave }: { onSave: (schema: Criterion[], naturalText: string) => void }) {
  const [text, setText] = useState('')
  const [criteria, setCriteria] = useState<Criterion[]>([
    { name: '', weight: 0, max_score: 100, description: '' },
  ])
  const totalWeight = criteria.reduce((s, c) => s + Number(c.weight), 0)

  function addCriterion() {
    setCriteria(c => [...c, { name: '', weight: 0, max_score: 100, description: '' }])
  }

  function updateCriterion(i: number, field: keyof Criterion, value: string | number) {
    setCriteria(c => c.map((cr, idx) => idx === i ? { ...cr, [field]: value } : cr))
  }

  function removeCriterion(i: number) {
    setCriteria(c => c.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Natural Language Description</label>
        <textarea rows={3} value={text} onChange={e => setText(e.target.value)}
          placeholder="Describe how this project should be graded..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
      </div>

      <div className="space-y-2">
        {criteria.map((c, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input placeholder="Criterion name" value={c.name} onChange={e => updateCriterion(i, 'name', e.target.value)}
              className="col-span-4 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            <input type="number" placeholder="Weight %" value={c.weight} min={0} max={100} onChange={e => updateCriterion(i, 'weight', Number(e.target.value))}
              className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            <input type="number" placeholder="Max score" value={c.max_score} min={1} onChange={e => updateCriterion(i, 'max_score', Number(e.target.value))}
              className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            <input placeholder="Description" value={c.description} onChange={e => updateCriterion(i, 'description', e.target.value)}
              className="col-span-3 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
            <button onClick={() => removeCriterion(i)} className="col-span-1 text-red-400 hover:text-red-600 text-lg transition-colors">×</button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={addCriterion} className="text-sm text-[var(--color-primary)] hover:underline">+ Add Criterion</button>
        <span className={`text-sm font-mono ${totalWeight === 100 ? 'text-green-600' : 'text-red-500'}`}>
          Total: {totalWeight}% {totalWeight !== 100 && '(must equal 100%)'}
        </span>
      </div>

      <button type="button" disabled={totalWeight !== 100 || !text.trim()}
        onClick={() => onSave(criteria, text)}
        className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors">
        Save Rubric
      </button>
    </div>
  )
}
