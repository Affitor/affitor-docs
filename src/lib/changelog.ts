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
