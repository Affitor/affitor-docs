import type { ReactNode } from 'react';
import { BlogNav } from '@/components/blog/blog-nav';
import { SiteFooter } from '@/components/site-footer';

/**
 * Blog and changelog chrome: the affitor.com header and footer (src/config/site-nav.ts).
 * No docs header, no search, no tab row, no sidebar.
 */
export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-fd-background">
      <BlogNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
