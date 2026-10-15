'use client';

import { useState } from 'react';

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="cl-copy"
      onClick={() => navigator.clipboard?.writeText(url).then(() => setCopied(true))}
    >
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}
