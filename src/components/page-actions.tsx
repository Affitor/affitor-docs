'use client';

import { useRef, useState } from 'react';
import { FEEDBACK_URL } from '@/config/site-nav';

// Page actions on every doc page (spec docs-skeleton §7.1, §8): Copy for LLM copies the
// page's .md twin (the file "View as Markdown" opens); Send feedback opens the app's feedback form.

const ICON = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export const CopyIcon = () => (
  <svg {...ICON}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
export const MarkdownIcon = () => (
  <svg {...ICON}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </svg>
);
const MessageIcon = () => (
  <svg {...ICON}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const CheckIcon = () => (
  <svg {...ICON}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** Copies the page's markdown twin to the clipboard. */
export function CopyForLLM({ href, className }: { href: string; className: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);

  async function copy() {
    const text = fetch(href).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    });
    text.catch(() => {}); // handled below; avoids an unhandled rejection if the first write throws early
    try {
      try {
        // Safari keeps the click's permission only if the write starts now, with the text still loading.
        await navigator.clipboard.write([
          new ClipboardItem({ 'text/plain': text.then((t) => new Blob([t], { type: 'text/plain' })) }),
        ]);
      } catch {
        await navigator.clipboard.writeText(await text);
      }
      setState('copied');
    } catch {
      setState('failed');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {state === 'copied' ? <CheckIcon /> : <CopyIcon />}
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy for LLM'}</span>
    </button>
  );
}

/**
 * "Send feedback": a link to the app's feedback form (one feedback inbox for the team, Sơn 17/10),
 * with this page's path so the team sees where it came from.
 */
export function SendFeedback({ page, className }: { page: string; className: string }) {
  return (
    <a href={`${FEEDBACK_URL}?page=${encodeURIComponent(page)}`} className={className}>
      <MessageIcon />
      Send feedback
    </a>
  );
}
