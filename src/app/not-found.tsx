import type { Metadata } from 'next';
import { BlogShell } from '@/components/blog/blog-shell';
import { NotFoundBody } from '@/components/not-found-body';

export const metadata: Metadata = { title: { absolute: 'Page not found | Affitor' } };

/** Blog, changelog and any other unknown path: the affitor.com header and footer. */
export default function NotFound() {
  return (
    <BlogShell>
      <NotFoundBody />
    </BlogShell>
  );
}
