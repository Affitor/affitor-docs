import type { ReactNode } from 'react';
import '@/components/changelog/changelog.css';
import { BlogShell } from '@/components/blog/blog-shell';

/** affitor.com/changelog wears the marketing shell of the blog zone, not docs chrome. */
export default function ChangelogLayout({ children }: { children: ReactNode }) {
  return (
    <BlogShell>
      <div className="cl">{children}</div>
    </BlogShell>
  );
}
