import { statSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import { CHANGELOG_SUB, CHANGELOG_URL, bannerSrc, entrySlug, entryUrl, preamble, sortedEntries, type Entry } from '@/lib/changelog';
import { SITE_URL } from '@/lib/site';

// Built once per deploy: the entry bodies are read from disk at build time.
export const dynamic = 'force-static';

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
const light = (src: string) => src.replace(/(\.[a-z0-9]+)$/i, '-light$1');

/** Entry to feed HTML: Action required + deprecations first, light media, a video becomes its poster linking to the entry. */
function toHtml(entry: Entry, raw: string, url: string) {
  const md = `${preamble(entry)}${raw.replace(FRONTMATTER, '')}`
    .replace(/<Media\s+([^>]*?)\/>/g, (_, attrs: string) => {
      const a = Object.fromEntries([...attrs.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
      if (a.src.endsWith('.mp4')) return `[![${a.alt}](${light(a.src).replace(/\.mp4$/, '.poster.png')})](${url})`;
      return `![${a.alt}](${light(a.src)})`;
    })
    .replace(/<Accordion\s+title="([^"]*)"\s*>/g, '**$1**\n')
    .replace(/<\/?Accordions?\b[^>]*>/g, '');
  const html = marked.parse(md, { async: false });
  return html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${SITE_URL}/`);
}

export async function GET() {
  const entries = sortedEntries();
  const items = await Promise.all(
    entries.map(async (entry) => {
      const url = entryUrl(entry);
      const banner = entry.banner ? bannerSrc(entrySlug(entry), 'light') : null;
      const enclosure = banner
        ? `<enclosure url="${SITE_URL}${banner}" length="${statSync(join(process.cwd(), 'public', banner)).size}" type="image/png"/>`
        : '';
      return `<item>
<title>${esc(entry.title)}</title>
<link>${url}</link>
<guid isPermaLink="true">${url}</guid>
<pubDate>${new Date(`${entry.date}T12:00:00Z`).toUTCString()}</pubDate>
<category>${entry.type}</category>
<description>${esc(entry.description)}</description>
<content:encoded>${cdata(toHtml(entry, await entry.getText('raw'), url))}</content:encoded>
${enclosure}
</item>`;
    }),
  );
  const newest = entries[0] ? new Date(`${entries[0].date}T12:00:00Z`).toUTCString() : new Date(0).toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>Affitor Changelog</title>
<link>${CHANGELOG_URL}</link>
<description>${esc(CHANGELOG_SUB)}</description>
<language>en-us</language>
<lastBuildDate>${newest}</lastBuildDate>
<atom:link href="${CHANGELOG_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
</channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
