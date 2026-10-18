import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { flattenTree } from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { DocsHeader } from '@/components/docs-header';
import { NavDrawerBridge, TabNav } from '@/components/tab-nav';
import { AudienceSwitch } from '@/components/audience-switch';
import { SidebarGroup } from '@/components/sidebar-group';
import { SiteFooter } from '@/components/site-footer';

// Docs tabs over the sidebar trees (root folders in content/docs/meta.json). Guides holds the Brands
// and Partners trees; the switch at the top of its sidebar picks one (audience-switch.tsx).
const TABS = [
  { title: 'Guides', href: '/docs', roots: ['brand', 'partners'] },
  { title: 'API Reference', href: '/docs/api-reference/overview', roots: ['api-reference'] },
  { title: 'Support', href: '/docs/support', roots: ['support'] },
];

export function DocsShell({ children }: { children: ReactNode }) {
  const tabs = TABS.map(({ roots, ...tab }) => ({
    ...tab,
    urls: source.pageTree.children.flatMap((node) =>
      node.type === 'folder' && roots.includes(node.$id ?? '') ? flattenTree(node.children).map((page) => page.url) : [],
    ),
  }));
  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-width sticky top bar: header row + tab row (above the sidebar, under the phone nav drawer) */}
      <div className="sticky top-0 z-30">
        <DocsHeader />
        <TabNav tabs={tabs} />
      </div>
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <img src="/docs/affitor-logo.svg" alt="Affitor" style={{ height: '24px', width: 'auto' }} />
          ),
          url: '/docs',
          enabled: false,
        }}
        // The tab row above replaces Fumadocs' root-folder dropdown.
        tabs={false}
        sidebar={{ banner: <AudienceSwitch />, components: { Separator: SidebarGroup } }}
        themeSwitch={{ enabled: false }}
        searchToggle={{ enabled: false }}
      >
        {children}
        <NavDrawerBridge />
      </DocsLayout>
      <SiteFooter />
    </div>
  );
}
