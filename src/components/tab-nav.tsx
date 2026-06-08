'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = { title: string; href: string; match: (p: string) => boolean };

const TABS: Tab[] = [
  { title: 'Getting Started', href: '/', match: (p) => p === '/' || ['/how-it-works', '/pricing-performance-model', '/glossary'].some((x) => p.startsWith(x)) },
  { title: 'For Advertisers', href: '/advertisers/quickstart/create-account', match: (p) => p.startsWith('/advertisers') },
  { title: 'FAQ', href: '/faq', match: (p) => p.startsWith('/faq') },
  { title: 'Support', href: '/support', match: (p) => p.startsWith('/support') },
  { title: 'Changelog', href: '/changelog', match: (p) => p.startsWith('/changelog') },
];

export function TabNav() {
  const pathname = usePathname() || '/';
  const activeIdx = (() => {
    // most specific match wins; Getting Started is the fallback
    for (let i = 1; i < TABS.length; i++) if (TABS[i].match(pathname)) return i;
    return 0;
  })();

  return (
    <nav className="border-b border-fd-border bg-fd-background/80 backdrop-blur-md">
      <div className="flex items-center gap-6 px-5 h-11 max-w-[1536px] mx-auto overflow-x-auto">
      {TABS.map((tab, i) => {
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
