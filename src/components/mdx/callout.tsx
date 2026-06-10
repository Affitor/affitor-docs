import type { ReactNode } from 'react';

/**
 * <Callout type="info|warning|error|success"> — Mintlify-style callout box.
 *
 * This is a custom component that complements (and can override) the Fumadocs
 * built-in <Callout>. It uses the --aff-* design tokens and docs-callout-*
 * CSS classes defined in globals.css for consistent theming.
 *
 * Usage in MDX:
 *   <Callout type="info">Idempotency: re-sending the same transaction_id returns 409.</Callout>
 *   <Callout type="warning">409 means the sale was already recorded — don't retry.</Callout>
 *   <Callout type="error">Never log API keys in client-side code.</Callout>
 *   <Callout type="success">All fields successfully validated.</Callout>
 *
 * NOTE: This component replaces the Fumadocs default Callout in the MDX map.
 * If you need the Fumadocs version, import it directly as FumaCallout.
 */

type CalloutType = 'info' | 'warning' | 'error' | 'success';

const ICONS: Record<CalloutType, ReactNode> = {
  info: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14.5 13.5H1.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const LABELS: Record<CalloutType, string> = {
  info: 'Info',
  warning: 'Warning',
  error: 'Error',
  success: 'Note',
};

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`docs-callout docs-callout--${type}`} role="note">
      <div className="docs-callout-icon">{ICONS[type]}</div>
      <div className="docs-callout-body">
        <div className="docs-callout-label">{title ?? LABELS[type]}</div>
        <div className="docs-callout-text">{children}</div>
      </div>
    </div>
  );
}
