import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { DocsHeader } from '@/components/docs-header';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DocsHeader />
      <DocsLayout
        tree={source.pageTree}
        tabMode="top"
        nav={{
          title: (
            <img
              src="/affitor-logo.svg"
              alt="Affitor"
              style={{ height: '24px', width: 'auto' }}
            />
          ),
          url: '/docs',
          enabled: false,
        }}
        themeSwitch={{ enabled: false }}
        searchToggle={{ enabled: false }}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
