'use client';

import { cn } from '@/lib/utils/cn';

const OPTIONS = [
  {
    value: 'DIRECT',
    label: 'Direct Instruction',
    description: 'Structured lecture-based teaching with clear objectives.',
  },
  {
    value: 'SOCRATIC',
    label: 'Socratic',
    description: 'Question-driven dialogue to develop critical thinking.',
  },
  {
    value: 'GUIDED',
    label: 'Guided Discovery',
    description: 'Students explore concepts with instructor scaffolding.',
  },
  {
    value: 'FLIPPED',
    label: 'Flipped Classroom',
    description: 'Students learn content at home; class time for practice.',
  },
  {
    value: 'CUSTOM',
    label: 'Custom',
    description: 'Define your own pedagogy style.',
  },
] as const;

interface PedagogySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PedagogySelector({ value, onChange }: PedagogySelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {OPTIONS.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
            value === opt.value
              ? 'border-primary bg-primary/5'
              : 'border-border hover:bg-muted'
          )}
        >
          <input
            type="radio"
            name="pedagogy"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mt-0.5 accent-primary"
          />
          <div>
            <p className="text-sm font-medium">{opt.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
