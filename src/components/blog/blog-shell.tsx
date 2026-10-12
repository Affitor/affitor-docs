import type { ReactNode } from 'react';
import { BlogNav } from '@/components/blog/blog-nav';
import { BlogFooter } from '@/components/blog/blog-footer';

/**
 * Blog chrome — affitor.com-style marketing nav + compact footer.
 * No docs header, no search, no tab row, no sidebar: the blog wears the
 * landing brand, not docs clothing.
 */
export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-fd-background">
      <BlogNav />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
