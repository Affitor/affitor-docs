'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

/**
 * <CodeGroup> — tabbed code container, Mintlify-style.
 *
 * The most reliable MDX-compatible approach: pass an `items` prop array.
 * Inline code strings are passed as data; each item is rendered in a <pre>.
 *
 * Usage in MDX:
 *   <CodeGroup items={[
 *     { label: 'cURL', lang: 'bash', code: `curl -X POST ...` },
 *     { label: 'Node.js', lang: 'javascript', code: `const res = await fetch(...)` },
 *   ]} />
 *
 * The `label` is shown in the tab. `lang` is used for the aria-label only
 * (syntax highlighting is not applied — this is a presentation wrapper).
 * Copy button copies the active tab's code via navigator.clipboard.
 */

export interface CodeGroupItem {
  label: string;
  lang?: string;
  code: string;
}

export function CodeGroup({
  items,
  children,
}: {
  items?: CodeGroupItem[];
  children?: ReactNode;
}) {
  const tabs = items ?? [];
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  if (tabs.length === 0) {
    // Fallback: just render children if no items provided
    return <div className="docs-code-group">{children}</div>;
  }

  const handleCopy = () => {
    const code = tabs[active]?.code;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="docs-code-group">
      <div className="docs-code-group-header">
        <div className="docs-code-group-tabs">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              className={`docs-code-tab${i === active ? ' docs-code-tab--active' : ''}`}
              onClick={() => setActive(i)}
              aria-selected={i === active}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="docs-code-group-actions">
          <button
            type="button"
            className="docs-code-copy-btn"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="1" width="9" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 5H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      <div className="docs-code-group-body" role="tabpanel">
        <pre aria-label={tabs[active]?.lang}>
          <code>{tabs[active]?.code}</code>
        </pre>
      </div>
    </div>
  );
}
