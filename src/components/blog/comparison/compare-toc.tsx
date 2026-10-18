'use client';

import { AnchorProvider, TOCItem } from 'fumadocs-core/toc';

/** "On this page" for a compare post: its H2s, the one in view marked. */
export function CompareToc({ items }: { items: { url: string; title: string }[] }) {
  return (
    <AnchorProvider toc={items.map((item) => ({ ...item, depth: 2 }))} single>
      <nav aria-label="On this page" className="sticky top-24 mt-[120px] self-start max-lg:hidden">
        <p className="mb-2 text-[13px] leading-[18px] font-semibold text-fd-foreground">On this page</p>
        {items.map((item) => (
          <TOCItem
            key={item.url}
            href={item.url}
            className="block border-l border-fd-border py-1 pl-3 text-[13px] leading-[18px] text-fd-muted-foreground transition-colors hover:text-fd-foreground data-[active=true]:border-fd-primary data-[active=true]:text-fd-primary"
          >
            {item.title}
          </TOCItem>
        ))}
      </nav>
    </AnchorProvider>
  );
}
