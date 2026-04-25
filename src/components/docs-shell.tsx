import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { getLayoutTabs, type LayoutTab } from 'fumadocs-ui/layouts/shared';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { DocsHeader } from '@/components/docs-header';

const CHANGELOG_TAB: LayoutTab = {
  title: 'Changelog',
  url: '/changelog',
  urls: new Set(['/changelog']),
};

export function DocsShell({ children }: { children: ReactNode }) {
  const tabs = [...getLayoutTabs(source.pageTree), CHANGELOG_TAB];

  return (
    <div className="flex flex-col min-h-screen">
      <DocsHeader />
      <DocsLayout
        tree={source.pageTree}
        tabMode="top"
        tabs={tabs}
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
