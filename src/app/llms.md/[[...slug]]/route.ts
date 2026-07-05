import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import { blog, changelog } from '@/../.source/server';
import { postSlug } from '@/components/blog/post-meta';

// Per-page markdown for machines: `<page-url>.md` is rewritten here (see
// next.config.mjs). Fully static — every page's .md twin is prerendered at
// build time, so the filesystem reads in getText('raw') happen at build.
export const dynamic = 'force-static';

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

function toMarkdown(title: string, description: string | undefined, raw: string) {
  const body = raw.replace(FRONTMATTER, '').trim();
  const head = description ? `# ${title}\n\n> ${description}` : `# ${title}`;
  return `${head}\n\n${body}\n`;
}

async function render(slug: string[]): Promise<string | null> {
  // /blog/<slug>.md
  if (slug[0] === 'blog' && slug.length === 2) {
    const post = blog.find((p) => postSlug(p.info.path) === slug[1]);
    if (!post) return null;
    return toMarkdown(post.title, post.description, await post.getText('raw'));
  }

  // /changelog.md — the changelog is a single page; aggregate all entries.
  if (slug.length === 1 && slug[0] === 'changelog') {
    const entries = [...changelog].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const sections = await Promise.all(
      entries.map(async (entry) => {
        const body = (await entry.getText('raw')).replace(FRONTMATTER, '').trim();
        return `## ${entry.title} (${entry.date})\n\n> ${entry.benefit}\n\n${body}`;
      }),
    );
    return `# Affitor Changelog\n\n${sections.join('\n\n---\n\n')}\n`;
  }

  // Docs pages, including the root landing (`/index.md`).
  const page = source.getPage(
    slug.length === 1 && slug[0] === 'index' ? [] : slug,
  );
  if (!page) return null;
  return toMarkdown(
    page.data.title ?? slug.join('/'),
    page.data.description,
    await page.data.getText('raw'),
  );
}

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
