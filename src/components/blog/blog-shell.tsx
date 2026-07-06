import type { ReactNode } from 'react';
import { DocsHeader } from '@/components/docs-header';
import { TabNav } from '@/components/tab-nav';
import { docsBase } from '@/lib/site';

/**
 * Blog chrome — same header + tab row as DocsShell, minus the docs sidebar.
 *
 * Blog pages are proxied at affitor.com/blog (multi-zone), so every docs link
 * in the chrome must be absolute to docs.affitor.com (via `docsBase`) or it
 * would collide with the main app's routes. The DocsLayout sidebar renders
 * fumadocs-generated relative links we can't absolutize, so blog pages drop it.
 */
export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <DocsHeader docsBase={docsBase} />
        <TabNav docsBase={docsBase} />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
