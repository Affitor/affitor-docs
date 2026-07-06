import type { ReactNode } from 'react';
import { BlogNav } from '@/components/blog/blog-nav';
import { BlogFooter } from '@/components/blog/blog-footer';
import { docsBase } from '@/lib/site';

/**
 * Blog chrome — affitor.com-style marketing nav + compact footer.
 * No docs header, no search, no tab row, no sidebar: the blog wears the
 * landing brand, not docs clothing.
 *
 * Blog pages are proxied at affitor.com/blog (multi-zone), so anything that
 * belongs to the docs host (logo asset, changelog link) is absolutized via
 * `docsBase` in production.
 */
export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-fd-background">
      <BlogNav docsBase={docsBase} />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
