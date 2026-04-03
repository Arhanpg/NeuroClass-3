'use client';

const OPTIONS = [
  {
    value: 'DIRECT_INSTRUCTION',
    label: 'Direct Instruction',
    desc: 'AI gives clear, structured explanations with worked examples.',
  },
  {
    value: 'SOCRATIC',
    label: 'Socratic',
    desc: 'AI responds with guiding questions to develop critical thinking.',
  },
  {
    value: 'GUIDED',
    label: 'Guided Discovery',
    desc: 'AI provides hints and scaffolding for independent discovery.',
  },
  {
    value: 'FLIPPED',
    label: 'Flipped Classroom',
    desc: 'AI reinforces concepts students prepared before class.',
  },
  {
    value: 'CUSTOM',
    label: 'Custom',
    desc: 'Define your own pedagogical style in free text.',
  },
];

interface Props {
  value: string;
  customText?: string;
  onChange: (style: string, custom?: string) => void;
}

export function PedagogySelector({ value, customText, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Pedagogy Style <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              value === opt.value
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <input
              type="radio"
              name="pedagogy"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value, customText)}
              className="mt-0.5 accent-teal-600"
            />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{opt.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.desc}</div>
            </div>
          </label>
        ))}
      </div>

      {value === 'CUSTOM' && (
        <textarea
          value={customText ?? ''}
          onChange={(e) => onChange('CUSTOM', e.target.value)}
          placeholder="Describe your pedagogical approach..."
          rows={3}
          className="mt-3 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
        />
      )}
    </div>
  );
}
