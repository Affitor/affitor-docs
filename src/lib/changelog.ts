import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { changelog } from '@/../.source/server';
import { SITE_URL } from '@/lib/site';

/** affitor.com/changelog: a zone of this app, like /blog. Entries live in content/changelog. */
export const CHANGELOG_URL = `${SITE_URL}/changelog`;
export const CHANGELOG_TITLE = 'Changelog';
export const CHANGELOG_SUB = 'New features, improvements and fixes in Affitor.';
/** Entries shown at once on the index; "Older updates" reveals the next batch. */
export const PAGE_SIZE = 30;

export type Entry = (typeof changelog)[number];

const UPPER = new Set(['api', 'sdk', 'cli', 'mcp']);
export const surfaceLabel = (s: string) => (UPPER.has(s) ? s.toUpperCase() : s[0].toUpperCase() + s.slice(1));
export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const entrySlug = (entry: Entry) => entry.info.path.replace(/\.mdx?$/, '');
export const entryUrl = (entry: Entry) => `${CHANGELOG_URL}/${entrySlug(entry)}`;

/** Media for an entry sits in public/docs/changelog/<slug>/ and is served at /docs/changelog/<slug>/. */
export const mediaDir = (slug: string) => `/docs/changelog/${slug}`;
export const bannerSrc = (slug: string, theme: 'light' | 'dark') => `${mediaDir(slug)}/banner-${theme}.png`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "2026-10-14" -> "Oct 14, 2026" (calendar day, no timezone shift). */
export function formatDay(day: string) {
  const [y, m, d] = day.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** Today in Pacific time: the day a deadline ends for pinning. */
export function todayPT() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());
}

/** Newest first; same day keeps file order stable. */
export function sortedEntries(): Entry[] {
  return [...changelog].sort((a, b) => b.date.localeCompare(a.date) || entrySlug(a).localeCompare(entrySlug(b)));
}

export const isPinned = (entry: Entry, today: string) => Boolean(entry.action?.by && entry.action.by >= today);

/** Index order: entries with a deadline still ahead come first, until the end of that day (PT). */
export function indexOrder(today = todayPT()): Entry[] {
  const all = sortedEntries();
  return [...all.filter((e) => isPinned(e, today)), ...all.filter((e) => !isPinned(e, today))];
}

/** Minimal MDAST shape: enough to read a digest's bullets from the bundled tree. */
export type MdNode = { type: string; value?: string; url?: string; children?: MdNode[] };

/** The inline content of every top-level bullet in a digest body, in order. */
export async function bullets(entry: Entry): Promise<MdNode[][]> {
  const root = (await entry.getMDAST()) as unknown as MdNode;
  return (root.children ?? [])
    .filter((node) => node.type === 'list')
    .flatMap((list) => list.children ?? [])
    .map((item) => item.children?.find((c) => c.type === 'paragraph')?.children ?? []);
}

/**
 * What the entry page shows above the body (Action required, deprecation table), as
 * Markdown, so the .md twin and the RSS item carry it too. check-agent-surface.mjs
 * rebuilds the same text.
 */
export function preamble(entry: Entry) {
  const parts: string[] = [];
  if (entry.action) {
    const by = entry.action.by ? ` by ${formatDay(entry.action.by)}` : '';
    parts.push(`**Action required${by}.** ${capitalize(entry.action.who)}: ${entry.action.what}`);
  }
  if (entry.deprecations?.length) {
    const rows = entry.deprecations.map((d) => `| ${d.what} | ${d.replacement} | ${formatDay(d.sunset)} |`);
    parts.push(['| What | Replacement | Sunset |', '| --- | --- | --- |', ...rows].join('\n'));
  }
  return parts.length ? `${parts.join('\n\n')}\n\n` : '';
}

/** Deprecations whose sunset has not passed yet, for the top of /changelog.md. */
export function openDeprecations(today = todayPT()) {
  return sortedEntries().flatMap((entry) =>
    (entry.deprecations ?? []).filter((d) => d.sunset >= today).map((d) => ({ ...d, entry })),
  );
}

/** The shared AI context pack, served verbatim at /changelog/context.md. Not an entry (the collection reads *.mdx). */
export const CONTEXT_URL = `${CHANGELOG_URL}/context.md`;
export const contextPack = () => readFileSync(join(process.cwd(), 'content/changelog/_context.md'), 'utf8');

/** Inline MDAST to plain text: code keeps its backticks, a link keeps its label. */
export const plainText = (nodes: MdNode[]): string =>
  nodes.map((n) => (n.type === 'inlineCode' ? `\`${n.value}\`` : n.children ? plainText(n.children) : (n.value ?? ''))).join('');

/** /changelog.json `points`: the `points` frontmatter, else the top-level bullets. */
export async function points(entry: Entry) {
  return entry.points ?? (await bullets(entry)).map(plainText);
}

const absolute = (href: string) => (href.startsWith('/') ? `${SITE_URL}${href}` : href);

/** The body's "Learn more: [label](url)" link, else the context CTA. */
export function learnMore(entry: Entry, raw: string) {
  const href = raw.match(/^Learn more:?\s*\[[^\]]*\]\(([^)\s]+)\)/im)?.[1];
  return href ? absolute(href) : (entry.context?.cta?.url ?? null);
}

/** One media item: its file URLs by name (video posters nested by theme) and its alt text. */
export type MediaItem = { [key: string]: string | Record<string, string> };

/** Absolute URL of a file in public/, or nothing when it is not there. */
const published = (path: string) => (existsSync(join(process.cwd(), 'public', path)) ? `${SITE_URL}${path}` : undefined);
const some = (files: Record<string, string | undefined>) => {
  const kept = Object.fromEntries(Object.entries(files).filter(([, v]) => v)) as Record<string, string>;
  return Object.keys(kept).length ? kept : undefined;
};

/**
 * The entry's media files that exist, in body order: banner, <Media> shots (light, dark, the
 * unframed -raw.png crop), <Media> loops (light, dark, posters, the capture-media .steps.json)
 * and plain Markdown images. check-agent-surface.mjs rebuilds the same list.
 */
export function entryMedia(entry: Entry, raw: string) {
  const slug = entrySlug(entry);
  const banner = entry.banner ? (some({ light: published(bannerSrc(slug, 'light')), dark: published(bannerSrc(slug, 'dark')) }) ?? null) : null;
  const images: MediaItem[] = [];
  const videos: MediaItem[] = [];
  for (const m of raw.matchAll(/<Media\s+([^>]*?)\/>|!\[([^\]]*)\]\((\/[^)\s]+)\)/g)) {
    if (m[3]) {
      const src = published(m[3]);
      if (src) images.push({ src, alt: m[2] });
      continue;
    }
    const a = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
    const [, base, ext] = a.src.match(/^(.*)(\.[a-z0-9]+)$/i) ?? [];
    if (ext === '.mp4') {
      const poster = some({ light: published(`${base}-light.poster.png`), dark: published(`${base}-dark.poster.png`) });
      const steps = published(`${base}.steps.json`);
      videos.push({ ...some({ light: published(`${base}-light.mp4`), dark: published(`${base}-dark.mp4`) }), ...(poster && { poster }), ...(steps && { steps }), alt: a.alt });
    } else {
      images.push({ ...some({ light: published(`${base}-light${ext}`), dark: published(`${base}-dark${ext}`), raw: published(`${base}-raw.png`) }), alt: a.alt });
    }
  }
  return { banner, images, videos };
}

/**
 * The entry body's first <Media>: the entry page shows it right under the description, before the
 * tags, and skips it in the body (order title, description, image, tags; Sơn 27/10 "ok changelog order").
 */
export function leadMedia(raw: string): { src: string; alt: string; caption?: string } | null {
  const m = raw.match(/<Media\s+([^>]*?)\/>/);
  if (!m) return null;
  const a = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
  return a.src && a.alt ? { src: a.src, alt: a.alt, ...(a.caption ? { caption: a.caption } : {}) } : null;
}

/** "- Video (alt): light <url>, dark <url>, poster light <url>, ..." */
function mediaLine(kind: string, { alt, ...files }: MediaItem) {
  const urls = Object.entries(files).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${k} ${v}`] : Object.entries(v).map(([theme, url]) => `${k} ${theme} ${url}`),
  );
  return `- ${kind}${alt ? ` (${alt})` : ''}: ${urls.join(', ')}`;
}

/**
 * "## Context for AI" at the end of an entry's .md twin, from its `context` frontmatter and its
 * media; '' when the entry has no `context`. check-agent-surface.mjs rebuilds the same text.
 */
export function aiContext(entry: Entry, raw: string) {
  const c = entry.context;
  if (!c) return '';
  const list = (items: string[]) => items.map((s) => `- ${s}`).join('\n');
  const { banner, images, videos } = entryMedia(entry, raw);
  const media = [
    ...(banner ? [mediaLine('Banner', banner)] : []),
    ...images.map((i) => mediaLine('Image', i)),
    ...videos.map((v) => mediaLine('Video', v)),
  ];
  const parts = [
    `Shared context for every entry (brand, facts, what never to say): ${CONTEXT_URL}`,
    ...(c.facts?.length ? [`### Facts\n\n${list(c.facts)}`] : []),
    ...(c.ui?.length ? [`### UI labels\n\n${list(c.ui.map((label) => `\`${label}\``))}`] : []),
    ...(c.avoid?.length ? [`### Avoid\n\n${list(c.avoid)}`] : []),
    ...(c.cta ? [`### CTA\n\n[${c.cta.label}](${c.cta.url})`] : []),
    `### Media\n\n${media.length ? media.join('\n') : 'None.'}`,
  ];
  return `\n\n## Context for AI\n\n${parts.join('\n\n')}`;
}
