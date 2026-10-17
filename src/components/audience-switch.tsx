'use client';

import Link from 'next/link';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';

// The Guides tab holds two sidebar trees, the root folders content/docs/brand and content/docs/partners
// (a folder's tree id is its path). Each meta.json lists its pages, wherever their files sit.
const AUDIENCES = [
  { root: 'brand', title: 'Brands', href: '/docs' },
  { root: 'partners', title: 'Partners', href: '/docs/partners' },
];

/** Brands | Partners at the top of the Guides sidebar (mock D1, P2); hidden in the other tabs. */
export function AudienceSwitch() {
  const { root } = useTreeContext();
  if (!AUDIENCES.some((audience) => audience.root === root.$id)) return null;
  return (
    <nav aria-label="Guides for" className="aff-audience">
      {AUDIENCES.map((audience) => {
        const active = audience.root === root.$id;
        return (
          <Link key={audience.root} href={audience.href} aria-current={active ? 'true' : undefined}>
            {audience.title}
          </Link>
        );
      })}
    </nav>
  );
}
