'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

interface Props {
  courseId: string;
}

type UploadState = 'idle' | 'uploading' | 'ingesting' | 'done' | 'error';

export function LectureUploader({ courseId }: Props) {
  const supabase = createBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadedTitle, setUploadedTitle] = useState<string | null>(null);

  const ALLOWED_TYPES = ['application/pdf', 'text/markdown', 'text/plain'];
  const MAX_SIZE_MB = 100;

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setProgress(0);

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.md')) {
      setErrorMsg('Only PDF and Markdown (.md) files are supported.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setState('uploading');
    setUploadedTitle(file.name.replace(/\.[^.]+$/, ''));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileType = file.name.endsWith('.md') ? 'MARKDOWN' : 'PDF';
      const timestamp = Date.now();
      const storagePath = `${courseId}/${timestamp}_${file.name}`;

      // Upload to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('lecture-notes')
        .upload(storagePath, file, { upsert: false });

      if (storageError) throw storageError;

      setProgress(40);

      // Insert lecture record
      const { data: lecture, error: insertError } = await supabase
        .from('lectures')
        .insert({
          course_id: courseId,
          title: file.name.replace(/\.[^.]+$/, ''),
          storage_path: storagePath,
          file_type: fileType,
          embedding_status: 'PENDING',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setProgress(70);
      setState('ingesting');

      // Trigger RAG ingestion
      const response = await fetch(`/api/courses/${courseId}/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lecture_id: lecture.id, storage_path: storagePath, file_type: fileType }),
      });

      if (!response.ok) {
        // Ingestion trigger failed — lecture is uploaded but not ingested yet
        console.warn('RAG ingestion trigger failed, will retry later');
      }

      setProgress(100);
      setState('done');

      // Refresh page after a moment
      setTimeout(() => {
        setState('idle');
        setProgress(0);
        setUploadedTitle(null);
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setState('error');
      setErrorMsg(err.message ?? 'Upload failed');
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => state === 'idle' && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
            : state === 'error'
            ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
            : state === 'done'
            ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.md,application/pdf,text/markdown"
          className="hidden"
          onChange={handleFileChange}
        />

        {state === 'idle' && (
          <>
            <div className="text-3xl mb-2">{dragOver ? '📥' : '📂'}</div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drag & drop a file here, or <span className="text-teal-600 dark:text-teal-400 underline">browse</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF or Markdown &bull; Max 100MB</p>
          </>
        )}

        {(state === 'uploading' || state === 'ingesting') && (
          <>
            <div className="text-2xl mb-2">📤</div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {state === 'uploading' ? 'Uploading' : 'Triggering RAG ingestion'} &mdash; {uploadedTitle}
            </p>
            <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </>
        )}

        {state === 'done' && (
          <>
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Uploaded! RAG ingestion queued.
            </p>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="text-3xl mb-2">❌</div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{errorMsg}</p>
            <button
              onClick={(e) => { e.stopPropagation(); setState('idle'); setErrorMsg(null); }}
              className="mt-2 text-xs text-red-600 dark:text-red-400 underline"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
