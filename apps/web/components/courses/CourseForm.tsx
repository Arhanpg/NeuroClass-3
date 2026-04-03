'use client';

import { useState } from 'react';
import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CourseInsert } from '@/lib/supabase/types';

type FormPayload = Omit<CourseInsert, 'instructor_id' | 'id' | 'join_code' | 'created_at'>;

interface CourseFormProps {
  initialValues?: Partial<FormPayload>;
  onSubmit: (data: FormPayload) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

const PEDAGOGY_OPTIONS = [
  { value: 'DIRECT',   label: 'Direct Instruction' },
  { value: 'SOCRATIC', label: 'Socratic' },
  { value: 'GUIDED',   label: 'Guided Discovery' },
  { value: 'FLIPPED',  label: 'Flipped Classroom' },
  { value: 'CUSTOM',   label: 'Custom' },
] as const;

export function CourseForm({
  initialValues,
  onSubmit,
  submitLabel = 'Create Course',
  loading,
}: CourseFormProps) {
  const [name,     setName]     = useState(initialValues?.name ?? '');
  const [code,     setCode]     = useState(initialValues?.code ?? '');
  const [term,     setTerm]     = useState(initialValues?.term ?? '');
  const [pedagogy, setPedagogy] = useState<string>(initialValues?.pedagogy_style ?? 'DIRECT');
  const [custom,   setCustom]   = useState(initialValues?.pedagogy_custom ?? '');
  const [cap,      setCap]      = useState(initialValues?.enrollment_cap ?? 200);
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !code.trim() || !term.trim()) {
      setError('Name, code, and term are required.');
      return;
    }
    try {
      await onSubmit({
        name:            name.trim(),
        code:            code.trim().toUpperCase(),
        term:            term.trim(),
        pedagogy_style:  pedagogy as FormPayload['pedagogy_style'],
        pedagogy_custom: pedagogy === 'CUSTOM' ? custom.trim() || null : null,
        enrollment_cap:  Math.max(1, cap),
        is_archived:     false,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Course Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="cn-name">Course Name</Label>
          <Input
            id="cn-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Introduction to Machine Learning"
          />
        </div>

        {/* Code */}
        <div className="space-y-1.5">
          <Label htmlFor="cn-code">Course Code</Label>
          <Input
            id="cn-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. CS-401"
          />
        </div>

        {/* Term */}
        <div className="space-y-1.5">
          <Label htmlFor="cn-term">Term</Label>
          <Input
            id="cn-term"
            required
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. Spring 2026"
          />
        </div>

        {/* Enrollment Cap */}
        <div className="space-y-1.5">
          <Label htmlFor="cn-cap">Enrollment Cap</Label>
          <Input
            id="cn-cap"
            type="number"
            min={1}
            max={1000}
            value={cap}
            onChange={(e) => setCap(Number(e.target.value))}
          />
        </div>

        {/* Pedagogy */}
        <div className="space-y-1.5">
          <Label>Pedagogy Style</Label>
          <Select value={pedagogy} onValueChange={setPedagogy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PEDAGOGY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Custom pedagogy description */}
      {pedagogy === 'CUSTOM' && (
        <div className="space-y-1.5">
          <Label htmlFor="cn-custom">Describe Your Pedagogy</Label>
          <Textarea
            id="cn-custom"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Explain your teaching approach in detail…"
            rows={3}
          />
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
