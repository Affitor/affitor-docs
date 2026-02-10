'use client';

import { useCallback } from 'react';
import { Link, MessageSquare } from 'lucide-react';

export function TocFooter() {
  const copyPageUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  return (
    <div className="toc-footer-links">
      <a role="button" onClick={copyPageUrl}>
        <Link size={12} />
        Copy page link
      </a>
      <a
        href="mailto:support@affitor.com?subject=Docs Feedback"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageSquare size={12} />
        Share feedback
      </a>
    </div>
  );
}
