import type { ReactNode } from 'react';

export function FlowGrid({ children }: { children: ReactNode }) {
  return <div className="docs-flow-grid not-prose">{children}</div>;
}

export function FlowCard({ step, title, children }: { step: string; title: string; children: ReactNode }) {
  return (
    <div className="docs-flow-card">
      <div className="docs-flow-step">{step}</div>
      <div className="docs-flow-title">{title}</div>
      <div className="docs-flow-body">{children}</div>
    </div>
  );
}
