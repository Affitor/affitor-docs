import { changelog } from '@/../.source/server';
import { SITE_URL } from '@/lib/site';

/** affitor.com/changelog: a zone of this app, like /blog. Entries live in content/changelog. */
export const CHANGELOG_URL = `${SITE_URL}/changelog`;
export const CHANGELOG_TITLE = 'Changelog';
export const CHANGELOG_SUB = 'New features, improvements and fixes in Affitor.';
export const PAGE_SIZE = 30;

export type Entry = (typeof changelog)[number];

export const AUDIENCES = [
  ['brands', 'Brands'],
  ['partners', 'Partners'],
  ['developers', 'Developers'],
] as const;

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

/** Top-level bullets of a digest body, in order (remark writes `*` and escapes punctuation). */
export function bullets(markdown: string): string[] {
  return [...markdown.matchAll(/^[-*] (.+)$/gm)].map((m) => m[1].trim().replace(/\\([!-/:-@[-`{-~])/g, '$1'));
}

/** Deprecations whose sunset has not passed yet, for the top of /changelog.md. */
export function openDeprecations(today = todayPT()) {
  return sortedEntries().flatMap((entry) =>
    (entry.deprecations ?? []).filter((d) => d.sunset >= today).map((d) => ({ ...d, entry })),
  );
}
