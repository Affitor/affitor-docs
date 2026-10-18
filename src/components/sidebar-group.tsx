'use client';

import type { Separator } from 'fumadocs-core/page-tree';

/** A sidebar group label (`---Group---` in a meta.json). globals.css styles `.aff-group` only. */
export function SidebarGroup({ item }: { item: Separator }) {
  return (
    <p className="aff-group">
      {item.icon}
      {item.name}
    </p>
  );
}
