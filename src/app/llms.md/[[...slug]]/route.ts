import { notFound } from 'next/navigation';
import { render } from '@/lib/agent-md';
import { source } from '@/lib/source';
import { blog } from '@/../.source/server';
import { postSlug } from '@/components/blog/post-meta';

// Per-page markdown for machines: `<page-url>.md` is rewritten here (see
// next.config.mjs). Fully static — every page's .md twin is prerendered at
// build time, so the filesystem reads in getText('raw') happen at build.
export const dynamic = 'force-static';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;
  const markdown = await render(slug);
  if (markdown === null) notFound();

  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

export function generateStaticParams(): { slug: string[] }[] {
  return [
    { slug: ['index'] },
    { slug: ['changelog'] },
    ...source
      .generateParams()
      .filter((entry) => entry.slug && entry.slug.length > 0)
      .map((entry) => ({ slug: entry.slug as string[] })),
    ...blog.map((post) => ({ slug: ['blog', postSlug(post.info.path)] })),
  ];
}
