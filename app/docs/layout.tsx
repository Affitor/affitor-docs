import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="text-sm font-medium tracking-tight text-fd-foreground">
            Affitor
          </span>
        ),
        url: '/',
      }}
      sidebar={{
        defaultOpenLevel: 2,
        collapsible: true,
      }}
    >
      {children}
    </DocsLayout>
  );
}
