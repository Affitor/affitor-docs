import type { ReactNode } from 'react';

export function RecommendedPath({ children, title = 'Recommended path' }: { children: ReactNode; title?: string }) {
  return (
    <div className="docs-recommended-path not-prose">
      <div className="docs-block-label">{title}</div>
      <div className="docs-recommended-body">{children}</div>
    </div>
  );
}
