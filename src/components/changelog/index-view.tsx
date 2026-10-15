import type { Metadata } from 'next';
import { Card } from '@/components/changelog/parts';
import { ChangelogList } from '@/components/changelog/list';
import { CHANGELOG_SUB, CHANGELOG_TITLE, CHANGELOG_URL, PAGE_SIZE, indexOrder, isPinned, surfaceLabel, todayPT } from '@/lib/changelog';

const SURFACES = Object.fromEntries(
  ['dashboard', 'marketplace', 'tracking', 'api', 'sdk', 'cli', 'mcp'].map((s) => [s, surfaceLabel(s)]),
);

export const indexMetadata: Metadata = {
  title: { absolute: 'Changelog · Affitor' },
  description: CHANGELOG_SUB,
  // Filtered views (?for=, ?surface=) are the same static page, so they canonicalize here too.
  alternates: {
    canonical: CHANGELOG_URL,
    types: { 'text/markdown': '/changelog.md', 'application/rss+xml': '/changelog/rss.xml' },
  },
  openGraph: { title: 'Affitor Changelog', description: CHANGELOG_SUB, type: 'website', url: CHANGELOG_URL },
  twitter: { card: 'summary_large_image', title: 'Affitor Changelog', description: CHANGELOG_SUB },
};

/**
 * /changelog. Every entry is in the HTML (pinned ones first); ChangelogList filters and
 * shows them in batches of PAGE_SIZE. The first card of each day carries id=<date>, so
 * old affitor.com/changelog#YYYY-MM-DD links still land.
 */
export function IndexView() {
  const today = todayPT();
  const seen = new Set<string>();
  const rows = indexOrder(today).map((entry) => {
    const anchor = !seen.has(entry.date);
    seen.add(entry.date);
    return <Card key={entry.info.path} entry={entry} pinned={isPinned(entry, today)} anchor={anchor} />;
  });

  return (
    <main className="cl-wrap">
      <div className="cl-hero">
        <h1>{CHANGELOG_TITLE}</h1>
        <p className="cl-sub">{CHANGELOG_SUB}</p>
        <div className="cl-links">
          <a href="/changelog/rss.xml">RSS</a>
          <a href="/changelog.md">Markdown for agents</a>
        </div>
      </div>
      <ChangelogList surfaces={SURFACES} pageSize={PAGE_SIZE}>
        {rows}
      </ChangelogList>
    </main>
  );
}
