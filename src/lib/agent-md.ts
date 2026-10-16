import { source } from '@/lib/source';
import { blog } from '@/../.source/server';
import { postSlug } from '@/components/blog/post-meta';
import { CHANGELOG_SUB, CHANGELOG_URL, entrySlug, entryUrl, openDeprecations, preamble, sortedEntries } from '@/lib/changelog';
import { DOCS_URL, SITE_URL } from '@/lib/site';

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

export function toMarkdown(title: string, description: string | undefined, raw: string) {
  const body = raw.replace(FRONTMATTER, '').trim();
  const head = description ? `# ${title}\n\n> ${description}` : `# ${title}`;
  return `${head}\n\n${body}\n`;
}

/** Body of /changelog.md. check-agent-surface.mjs rebuilds the same text from the sources. */
export function changelogIndex() {
  const open = openDeprecations().map(
    (d) => `- ${d.what} → ${d.replacement}, sunset ${d.sunset}: [${d.entry.title}](${entryUrl(d.entry)})`,
  );
  const lines = sortedEntries().map((e) => {
    const tags = [e.date, e.type, e.audience.join(', '), ...(e.surfaces.length ? [e.surfaces.join(', ')] : [])];
    return `- ${tags.join(' · ')} · [${e.title}](${entryUrl(e)}): ${e.description}`;
  });
  const head = `# Affitor Changelog\n\n> ${CHANGELOG_SUB}\n\n`;
  return `${head}${open.length ? `## Open deprecations\n\n${open.join('\n')}\n\n` : ''}## Entries\n\n${lines.join('\n')}\n`;
}

async function renderBody(slug: string[]): Promise<string | null> {
  // /blog/<slug>.md
  if (slug[0] === 'blog' && slug.length === 2) {
    const post = blog.find((p) => postSlug(p.info.path) === slug[1]);
    if (!post) return null;
    return toMarkdown(post.title, post.description, await post.getText('raw'));
  }

  // /changelog.md: open deprecations, then one line per entry (the entries have their own twins).
  if (slug.length === 1 && slug[0] === 'changelog') return changelogIndex();

  // /changelog/<slug>.md
  if (slug[0] === 'changelog' && slug.length === 2) {
    const entry = sortedEntries().find((e) => entrySlug(e) === slug[1]);
    if (!entry) return null;
    // The Action required block and deprecation table the entry page shows go first.
    const raw = (await entry.getText('raw')).replace(FRONTMATTER, '');
    return toMarkdown(entry.title, entry.description, `${preamble(entry)}${raw}`);
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

type DocPage = ReturnType<typeof source.getPages>[number];

export type AgentPage = {
  id: string;
  type: 'doc' | 'blog' | 'changelog';
  url: string;
  markdownUrl: string;
  /** Real content date from frontmatter: `last_updated` for docs, `updated ?? date` for posts. */
  updated?: string;
  /** Docs only: the page kind (docs standard §3). */
  kind?: string;
};

function getDocMetadata(page: DocPage): AgentPage {
  // page.url is /docs or /docs/<slug> (source baseUrl is /docs)
  const id = page.url.replace(/^\/docs\/?/, '') || 'index';
  return {
    id,
    type: 'doc',
    url: `${SITE_URL}${page.url}`,
    markdownUrl: `${DOCS_URL}/${id}.md`,
    kind: page.data.kind,
    updated: page.data.last_updated,
  };
}

function assertDates(dates: string[], label: string) {
  if (!dates.length) throw new Error(`No ${label} dates available`);
}

function changelogPages(): AgentPage[] {
  const entries = sortedEntries();
  assertDates(entries.map((e) => e.date), 'changelog');
  return [
    // The index changes whenever an entry is added, so it carries the newest entry date.
    { id: 'changelog', type: 'changelog', url: CHANGELOG_URL, markdownUrl: `${CHANGELOG_URL}.md`, updated: entries[0].date },
    ...entries.map((e): AgentPage => ({
      id: `changelog/${entrySlug(e)}`,
      type: 'changelog',
      url: entryUrl(e),
      markdownUrl: `${entryUrl(e)}.md`,
      updated: e.date,
    })),
  ];
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
        url: `${SITE_URL}/${id}`,
        markdownUrl: `${SITE_URL}/${id}.md`,
        updated,
      };
    }),
    ...changelogPages(),
  ];
}

export function getDocArticle(page: DocPage) {
  const metadata = getDocMetadata(page);
  // dateModified is the page's own last_updated, set by whoever changed its content.
  return {
    id: metadata.id,
    url: metadata.url,
    jsonLd: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      '@id': metadata.url,
      identifier: metadata.id,
      headline: page.data.title,
      description: page.data.description,
      dateModified: metadata.updated,
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
  if (page.kind) fields.kind = page.kind;
  if (page.updated) fields.updated = page.updated;
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  return `---\n${frontmatter}\n---\n${body}`;
}
