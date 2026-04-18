import type { ReactNode } from 'react';

type Item = {
  label: string;
  value: ReactNode;
};

export function PageMeta({ items }: { items: Item[] }) {
  return (
    <div className="docs-meta-grid not-prose">
      {items.map((item) => (
        <div key={item.label} className="docs-meta-card">
          <div className="docs-meta-label">{item.label}</div>
          <div className="docs-meta-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
