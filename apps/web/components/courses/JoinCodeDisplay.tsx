'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export function JoinCodeDisplay({ joinCode }: { joinCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('input');
      el.value = joinCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2">
      <span
        className="font-mono text-sm font-semibold tracking-widest select-all"
        aria-label={`Join code: ${joinCode}`}
      >
        {joinCode}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy join code'}
        type="button"
      >
        {copied
          ? <CheckIcon className="h-3.5 w-3.5 text-green-500" />
          : <CopyIcon  className="h-3.5 w-3.5" />
        }
      </Button>
    </div>
  );
}
