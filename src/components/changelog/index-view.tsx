import Link from 'next/link';
import type { Metadata } from 'next';
import { Card } from '@/components/changelog/parts';
import { ChangelogList } from '@/components/changelog/list';
import { CHANGELOG_SUB, CHANGELOG_TITLE, CHANGELOG_URL, PAGE_SIZE, indexOrder, isPinned, surfaceLabel, todayPT } from '@/lib/changelog';

const SURFACES = Object.fromEntries(
  ['dashboard', 'marketplace', 'tracking', 'api', 'sdk', 'cli', 'mcp'].map((s) => [s, surfaceLabel(s)]),
);

export const pageCount = () => Math.max(1, Math.ceil(indexOrder().length / PAGE_SIZE));

export function indexMetadata(page: number): Metadata {
  const url = page === 1 ? CHANGELOG_URL : `${CHANGELOG_URL}/page/${page}`;
  return {
    title: { absolute: page === 1 ? 'Changelog · Affitor' : `Changelog, page ${page} · Affitor` },
    description: CHANGELOG_SUB,
    // Filtered views (?for=, ?surface=) are the same static page, so they canonicalize here too.
    alternates: {
      canonical: url,
      types: { 'text/markdown': '/changelog.md', 'application/rss+xml': '/changelog/rss.xml' },
    },
    openGraph: { title: 'Affitor Changelog', description: CHANGELOG_SUB, type: 'website', url },
    twitter: { card: 'summary_large_image', title: 'Affitor Changelog', description: CHANGELOG_SUB },
  };
}

/** /changelog and /changelog/page/<n>. Pinned entries (a deadline still ahead) lead page 1. */
export function IndexView({ page }: { page: number }) {
  const today = todayPT();
  const order = indexOrder(today);
  const pages = Math.max(1, Math.ceil(order.length / PAGE_SIZE));
  const seen = new Set<string>();
  const rows = order.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((entry) => {
    const pinned = isPinned(entry, today);
    const anchor = !pinned && !seen.has(entry.date);
    if (anchor) seen.add(entry.date);
    return <Card key={entry.info.path} entry={entry} pinned={pinned} anchor={anchor} />;
  });
  const pageHref = (n: number) => (n === 1 ? '/changelog' : `/changelog/page/${n}`);

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
      <ChangelogList surfaces={SURFACES}>{rows}</ChangelogList>
      {pages > 1 ? (
        <nav className="cl-pages" aria-label="Pages">
          {page > 1 ? <Link href={pageHref(page - 1)}>Newer updates</Link> : null}
          {page < pages ? <Link href={pageHref(page + 1)}>Older updates</Link> : null}
        </nav>
      ) : null}
    </main>
  );
}
