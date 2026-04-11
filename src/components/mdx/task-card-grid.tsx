import type { ReactNode } from 'react';

export function TaskCardGrid({ children }: { children: ReactNode }) {
  return <div className="docs-task-grid not-prose">{children}</div>;
}

export function TaskCard({ title, href, children }: { title: string; href: string; children: ReactNode }) {
  return (
    <a href={href} className="docs-task-card">
      <div className="docs-task-title">{title}</div>
      <div className="docs-task-body">{children}</div>
    </a>
  );
}
