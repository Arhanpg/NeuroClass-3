'use client';

import { useState } from 'react';

interface Props {
  joinCode: string;
}

export function JoinCodeDisplay({ joinCode }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400">Join Code</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-xl tracking-[0.25em] text-teal-600 dark:text-teal-400">
          {joinCode}
        </span>
        <button
          onClick={handleCopy}
          title="Copy join code"
          className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}
