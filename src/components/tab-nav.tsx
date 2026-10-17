'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';

// The tab row sits above Fumadocs' layout, outside its sidebar state, so the phone menu button
// asks the layout to open its drawer through this event (NavDrawerBridge, inside the layout).
const OPEN_NAV = 'affitor:open-nav';

/** Opens Fumadocs' sidebar drawer (below 768 px) when the tab row's menu button is pressed. */
export function NavDrawerBridge() {
  const { setOpen } = useDocsLayout().slots.sidebar.useSidebar();
  useEffect(() => {
    const open = () => setOpen(true);
    window.addEventListener(OPEN_NAV, open);
    return () => window.removeEventListener(OPEN_NAV, open);
  }, [setOpen]);
  return null;
}

type Tab = { title: string; href: string; urls: string[] };

/**
 * The docs tab row. `tabs` come from the sidebar trees (docs-shell.tsx): a page belongs to the first
 * tab whose tree lists it, so a pointer link in a later tree (API Reference's MCP server) never
 * steals the page from Guides. Unknown pages (the docs 404) fall back to Guides. Changelog is its
 * own zone (affitor.com/changelog), so it is a plain link here.
 */
export function TabNav({ tabs }: { tabs: Tab[] }) {
  const pathname = (usePathname() || '/').replace(/(.)\/$/, '$1');
  const all = [...tabs, { title: 'Changelog', href: '/changelog', urls: [] }];
  const activeIdx = Math.max(tabs.findIndex((tab) => tab.urls.includes(pathname)), 0);

  return (
    <nav className="border-b border-fd-border bg-fd-background/80 backdrop-blur-md">
      <div className="flex items-center gap-6 px-5 h-11 max-w-[1536px] mx-auto overflow-x-auto">
      {/* Phones: the left nav lives in Fumadocs' drawer (it switches below 768 px). */}
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => window.dispatchEvent(new Event(OPEN_NAV))}
        className="md:hidden -mr-2 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-fd-border text-fd-muted-foreground hover:text-fd-foreground transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
        </svg>
      </button>
      {all.map((tab, i) => {
        const active = i === activeIdx;
        return (
          <Link
            key={tab.title}
            href={tab.href}
            className={`relative inline-flex items-center h-full text-[13.5px] font-medium whitespace-nowrap transition-colors ${
              active ? 'text-fd-foreground' : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            {tab.title}
            {active && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-fd-primary rounded-full" />
            )}
          </Link>
        );
      })}
      </div>
    </nav>
  );
}
