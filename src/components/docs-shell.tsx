import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { DocsHeader } from '@/components/docs-header';
import { TabNav } from '@/components/tab-nav';

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-width sticky top bar: header row + tab row (above the sidebar) */}
      <div className="sticky top-0 z-50">
        <DocsHeader />
        <TabNav />
      </div>
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <img src="/affitor-logo.svg" alt="Affitor" style={{ height: '24px', width: 'auto' }} />
          ),
          url: '/',
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
