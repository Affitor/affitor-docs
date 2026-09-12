import { source } from '@/lib/source';
import { blog, changelog } from '@/../.source/server';
import { postSlug } from '@/components/blog/post-meta';

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

export function toMarkdown(title: string, description: string | undefined, raw: string) {
  const body = raw.replace(FRONTMATTER, '').trim();
  const head = description ? `# ${title}\n\n> ${description}` : `# ${title}`;
  return `${head}\n\n${body}\n`;
}

export async function render(slug: string[]): Promise<string | null> {
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
