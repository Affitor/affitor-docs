'use client';

import { useId, useRef, useState, type FormEvent } from 'react';

// Page actions on every doc page (spec docs-skeleton §7.1, §8): Copy for LLM copies the
// page's .md twin (the file "View as Markdown" opens); Share feedback sends a PostHog event.

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

type PostHog = { capture?: (event: string, properties: Record<string, unknown>) => void };

/** "Share feedback" button and its dialog: Message (required) + Email (optional), as docs.x.ai. */
export function ShareFeedback({ title, className }: { title: string; className: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  const id = useId();
  const close = () => dialog.current?.close();

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get('message') ?? '').trim();
    if (!message) return;
    const email = String(form.get('email') ?? '').trim();
    try {
      (window as { posthog?: PostHog }).posthog?.capture?.('docs_feedback', {
        page: location.pathname,
        message,
        email: email || undefined,
      });
    } catch {
      // Blocked or broken analytics must not break the dialog.
    }
    event.currentTarget.reset();
    setSent(true);
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setSent(false);
          dialog.current?.showModal();
        }}
      >
        <MessageIcon />
        Share feedback
      </button>
      {/* Native modal dialog: the page behind is inert, focus stays inside, Esc closes. */}
      <dialog
        ref={dialog}
        className="aff-dialog"
        aria-labelledby={`${id}-title`}
        onClick={(event) => event.target === event.currentTarget && close()}
      >
        {sent ? (
          <div className="aff-dialog-done">
            <h2 id={`${id}-title`}>Thanks for your feedback</h2>
            <p>It helps us improve this page.</p>
            <div className="aff-dialog-foot">
              <button type="button" className="aff-btn aff-btn-secondary" onClick={close} autoFocus>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={send}>
            <div className="aff-dialog-head">
              <h2 id={`${id}-title`}>Share feedback</h2>
              <p>Tell us what is missing or unclear on &ldquo;{title}&rdquo;.</p>
            </div>
            <div className="aff-dialog-body">
              <label htmlFor={`${id}-message`}>Message</label>
              <textarea id={`${id}-message`} name="message" rows={4} required />
              <label htmlFor={`${id}-email`}>
                Email <span>optional, if you want a reply</span>
              </label>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="you@company.com" />
            </div>
            <div className="aff-dialog-foot">
              <button type="button" className="aff-btn aff-btn-secondary" onClick={close}>
                Cancel
              </button>
              <button type="submit" className="aff-btn aff-btn-primary">
                Send
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
