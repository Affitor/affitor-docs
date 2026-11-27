'use client';

import { useRef, useState } from 'react';
import { SITE_URL } from '@/lib/site';

// Page actions on every doc page (spec docs-skeleton §7.1, §8): Copy for LLM copies the
// page's .md twin (the file "View as Markdown" opens); Share feedback opens affitor.com's feedback window.

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

/** The one feedback window on affitor.com (same name as the dashboard's): a second click focuses it. */
const FEEDBACK_WINDOW = 'affitor-feedback';

/**
 * "Share feedback": opens affitor.com's feedback form in one small window over the page, the same form the
 * dashboard uses, in a page that loads no third-party scripts. The page here never navigates and holds no copy of the text.
 * Phones open it as a tab. A blocked popup falls back to opening the form in this tab.
 */
export function ShareFeedback({ className }: { className: string }) {
  function open() {
    const href = `${SITE_URL}/feedback?${new URLSearchParams({ page: location.pathname })}`;
    const phone = typeof matchMedia === 'function' && matchMedia('(max-width: 639px)').matches;
    const w = 480, h = 560;
    const left = Math.max(0, Math.round(screenX + (outerWidth - w) / 2)), top = Math.max(0, Math.round(screenY + (outerHeight - h) / 2));
    const opened = window.open(href, FEEDBACK_WINDOW, phone ? undefined : `popup=yes,width=${w},height=${h},left=${left},top=${top}`);
    if (!opened) {
      location.assign(href);
      return;
    }
    opened.focus();
  }

  return (
    <button type="button" className={className} onClick={open}>
      <MessageIcon />
      Share feedback
    </button>
  );
}
