'use client';

import { useState } from 'react';

/**
 * <ResponseTabs> — tabbed response examples, Mintlify-style.
 *
 * Each tab has a colored status dot (green for 2xx, red for 4xx/5xx, amber for 3xx)
 * and a label. Copy button copies the active response.
 *
 * Usage in MDX:
 *   <ResponseTabs items={[
 *     { status: 200, label: '200 Attributed', code: `{ "success": true, ... }` },
 *     { status: 200, label: '200 Window Expired', code: `{ "success": false, ... }` },
 *     { status: 409, label: '409 Duplicate', code: `{ "error": "duplicate" }` },
 *   ]} />
 */

export interface ResponseTabItem {
  status: number;
  label: string;
  code: string;
}

function statusDotClass(status: number): string {
  if (status >= 200 && status < 300) return 'docs-resp-dot--green';
  if (status >= 300 && status < 400) return 'docs-resp-dot--amber';
  return 'docs-resp-dot--red';
}

export function ResponseTabs({ items }: { items: ResponseTabItem[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!items || items.length === 0) return null;

  const handleCopy = () => {
    const code = items[active]?.code;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="docs-response-group">
      <div className="docs-response-header">
        <div className="docs-response-tabs">
          {items.map((item, i) => (
            <button
              key={`${item.status}-${item.label}`}
              type="button"
              className={`docs-resp-tab${i === active ? ' docs-resp-tab--active' : ''}`}
              onClick={() => setActive(i)}
              aria-selected={i === active}
              role="tab"
            >
              <span className={`docs-resp-dot ${statusDotClass(item.status)}`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="docs-code-group-actions">
          <button
            type="button"
            className="docs-code-copy-btn"
            onClick={handleCopy}
            aria-label="Copy response"
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
        <pre>
          <code>{items[active]?.code}</code>
        </pre>
      </div>
    </div>
  );
}
