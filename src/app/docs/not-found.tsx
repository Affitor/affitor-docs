import type { Metadata } from 'next';
import { NotFoundBody } from '@/components/not-found-body';

export const metadata: Metadata = { title: { absolute: 'Page not found | Affitor Docs' } };

/** Unknown /docs pages keep the docs chrome (header with search, tabs, footer) from docs/layout. */
export default function DocsNotFound() {
  return <NotFoundBody />;
}
