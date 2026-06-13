import { source } from '@/lib/source';
import { readDocMarkdown } from '@/lib/llm-content';

// One static .md artifact per doc page, generated at build time (no runtime cost).
export const dynamic = 'force-static';

export function generateStaticParams() {
  return source.generateParams().filter((entry) => entry.slug && entry.slug.length > 0);
}

/**
 * Serves the raw markdown of a doc page at /md/<slug>, derived from the same
 * MDX source that renders the HTML. Lets AI crawlers and "copy as markdown"
 * consume clean source without parsing rendered HTML/JS.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;

  // Validate against the doc tree first so we never read arbitrary files.
  if (!source.getPage(slug)) {
    return new Response('Not found', { status: 404 });
  }

  const markdown = await readDocMarkdown(slug);
  if (markdown == null) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
