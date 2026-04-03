'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { PedagogySelector } from './PedagogySelector';

export function CourseForm() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [form, setForm] = useState({
    name: '',
    code: '',
    term: '',
    enrollment_cap: 200,
    pedagogy_style: 'DIRECT_INSTRUCTION',
    pedagogy_custom: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate a random 8-char join code
      const joinCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { data, error: insertError } = await supabase
        .from('courses')
        .insert({
          name: form.name.trim(),
          code: form.code.trim().toUpperCase(),
          term: form.term.trim(),
          enrollment_cap: form.enrollment_cap,
          pedagogy_style: form.pedagogy_style,
          pedagogy_custom: form.pedagogy_style === 'CUSTOM' ? form.pedagogy_custom : null,
          instructor_id: user.id,
          join_code: joinCode,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      router.push(`/dashboard/courses/${data.id}`);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Course Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Introduction to Machine Learning"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Course Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="CS-401"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Term <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.term}
            onChange={(e) => setForm({ ...form, term: e.target.value })}
            placeholder="Spring 2026"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Enrollment Cap
        </label>
        <input
          type="number"
          min={1}
          max={1000}
          value={form.enrollment_cap}
          onChange={(e) => setForm({ ...form, enrollment_cap: Number(e.target.value) })}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
        />
      </div>

      <PedagogySelector
        value={form.pedagogy_style}
        customText={form.pedagogy_custom}
        onChange={(style, custom) =>
          setForm({ ...form, pedagogy_style: style, pedagogy_custom: custom ?? '' })
        }
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium text-sm transition-colors"
      >
        {loading ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  );
}
