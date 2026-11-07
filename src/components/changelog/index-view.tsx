import type { Metadata } from 'next';
import { Card } from '@/components/changelog/parts';
import { ChangelogList } from '@/components/changelog/list';
import { CHANGELOG_SUB, CHANGELOG_TITLE, CHANGELOG_URL, PAGE_SIZE, entryUrl, indexOrder, isPinned, sortedEntries, surfaceLabel, todayPT } from '@/lib/changelog';
import { SITE_URL } from '@/lib/site';

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

/** CollectionPage of every entry, newest first (same order as /changelog.md); each entry page has its own TechArticle. */
function jsonLd() {
  const entries = sortedEntries();
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': CHANGELOG_URL,
    url: CHANGELOG_URL,
    name: 'Affitor Changelog',
    description: CHANGELOG_SUB,
    publisher: { '@type': 'Organization', name: 'Affitor', url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, i) => ({ '@type': 'ListItem', position: i + 1, url: entryUrl(entry), name: entry.title })),
    },
  }).replace(/</g, '\\u003c');
}

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
      {/* eslint-disable-next-line react/no-danger -- server-rendered schema; `<` escaped */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
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
