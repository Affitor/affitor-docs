import { source } from '@/lib/source';
import { blog, changelog } from '@/../.source/server';
import { postSlug } from '@/components/blog/post-meta';

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

export function toMarkdown(title: string, description: string | undefined, raw: string) {
  const body = raw.replace(FRONTMATTER, '').trim();
  const head = description ? `# ${title}\n\n> ${description}` : `# ${title}`;
  return `${head}\n\n${body}\n`;
}

async function renderBody(slug: string[]): Promise<string | null> {
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

const DOCS_URL = 'https://docs.affitor.com';

type DocPage = ReturnType<typeof source.getPages>[number];

export type AgentPage = {
  id: string;
  type: 'doc' | 'blog' | 'changelog';
  url: string;
  markdownUrl: string;
  /** Real content date from frontmatter. Omitted for docs — they have none. */
  updated?: string;
};

function getDocMetadata(page: DocPage): AgentPage {
  const id = page.url.replace(/^\//, '') || 'index';
  return {
    id,
    type: 'doc',
    url: `${DOCS_URL}${page.url}`,
    markdownUrl: `${DOCS_URL}/${id}.md`,
  };
}

function newestChangelogDate(): string {
  const dates = changelog.map((entry) => entry.date);
  assertDates(dates, 'changelog');
  return dates.sort().at(-1)!;
}

function assertDates(dates: string[], label: string) {
  if (!dates.length) throw new Error(`No ${label} dates available`);
}

export function getAgentPages(): AgentPage[] {
  return [
    ...source.getPages().map(getDocMetadata),
    ...blog.map((post): AgentPage => {
      const id = `blog/${postSlug(post.info.path)}`;
      const updated = post.updated ?? post.date;
      if (!updated) throw new Error(`Blog post ${id} missing date`);
      return {
        id,
        type: 'blog',
        url: `https://affitor.com/${id}`,
        markdownUrl: `${DOCS_URL}/${id}.md`,
        updated,
      };
    }),
    {
      id: 'changelog',
      type: 'changelog',
      url: `${DOCS_URL}/changelog`,
      markdownUrl: `${DOCS_URL}/changelog.md`,
      updated: newestChangelogDate(),
    },
  ];
}

export function getDocArticle(page: DocPage) {
  const metadata = getDocMetadata(page);
  // Docs have no trustworthy content date — omit dateModified rather than invent one.
  return {
    id: metadata.id,
    jsonLd: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      '@id': metadata.url,
      identifier: metadata.id,
      headline: page.data.title,
      description: page.data.description,
    }).replace(/</g, '\\u003c'),
  };
}

export async function render(slug: string[]): Promise<string | null> {
  const body = await renderBody(slug);
  if (body === null) return null;

  const id = slug.join('/') || 'index';
  const page = getAgentPages().find((entry) => entry.id === id);
  if (!page) throw new Error(`Missing agent metadata for ${id}`);
  const fields: Record<string, string> = {
    id: page.id,
    type: page.type,
    url: page.url,
  };
  if (page.updated) fields.updated = page.updated;
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  return `---\n${frontmatter}\n---\n${body}`;
}
