import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useMDXComponents } from '@/../mdx-components';
import { CopyLink } from '@/components/changelog/copy-link';
import { Media } from '@/components/changelog/media';
import { Chips, actionText } from '@/components/changelog/parts';
import { renderInlineMarkdown } from '@/components/mdx/inline-markdown';
import { CHANGELOG_URL, bannerSrc, capitalize, entrySlug, entryUrl, formatDay, leadMedia, sortedEntries } from '@/lib/changelog';
import { SITE_URL } from '@/lib/site';

// Fully static: an entry only changes with a deploy.
export const dynamicParams = false;

export function generateStaticParams() {
  return sortedEntries().map((entry) => ({ slug: entrySlug(entry) }));
}

/**
 * Admonitions (`:::warning`) and <Callout> are banned in the changelog: a warning renders as
 * a yellow box, and breaking changes use the neutral Action required block instead. The MDX
 * admonition plugin emits <Callout>, so failing here catches every syntax it accepts.
 */
function NoCallout(): never {
  throw new Error('Callouts and :::admonitions are not allowed in changelog entries; use the action frontmatter');
}

async function getEntry(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const all = sortedEntries();
  const i = all.findIndex((entry) => entrySlug(entry) === slug);
  if (i < 0) notFound();
  return { entry: all[i], slug, older: all[i + 1], newer: all[i - 1] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { entry, slug } = await getEntry(params);
  const url = entryUrl(entry);
  const image = entry.banner ? [{ url: `${SITE_URL}${bannerSrc(slug, 'light')}`, width: 1200, height: 630 }] : undefined;
  return {
    title: { absolute: `${entry.title} · Affitor Changelog` },
    description: entry.description,
    alternates: { canonical: url, types: { 'text/markdown': `/changelog/${slug}.md` } },
    openGraph: { title: entry.title, description: entry.description, type: 'article', url, publishedTime: entry.date, images: image },
    twitter: { card: 'summary_large_image', title: entry.title, description: entry.description, images: image?.map((i) => i.url) },
  };
}

function jsonLd(entry: ReturnType<typeof sortedEntries>[number], slug: string) {
  const url = entryUrl(entry);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': url,
        headline: entry.title,
        description: entry.description,
        datePublished: entry.date,
        dateModified: entry.date,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        publisher: { '@type': 'Organization', name: 'Affitor', url: SITE_URL },
        ...(entry.banner ? { image: `${SITE_URL}${bannerSrc(slug, 'light')}` } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Changelog', item: CHANGELOG_URL },
          { '@type': 'ListItem', position: 3, name: entry.title, item: url },
        ],
      },
    ],
  }).replace(/</g, '\\u003c');
}

export default async function ChangelogEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { entry, slug, older, newer } = await getEntry(params);
  const Body = entry.body;
  const lead = leadMedia(await entry.getText('raw'));
  // The lead visual moves above the tags, so the body skips its first occurrence.
  let skipped = false;
  const components = useMDXComponents({
    Callout: NoCallout,
    ...(lead
      ? {
          Media: (props: Parameters<typeof Media>[0]) => {
            if (!skipped && props.src === lead.src) {
              skipped = true;
              return null;
            }
            return <Media {...props} />;
          },
        }
      : {}),
  });

  return (
    <main className="cl-entry">
      {/* eslint-disable-next-line react/no-danger -- server-rendered schema; `<` escaped */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(entry, slug) }} />
      <Link className="cl-back" href="/changelog">
        ‹ All updates
      </Link>
      <time className="cl-date" dateTime={entry.date}>
        {formatDay(entry.date)}
      </time>
      <h1>{entry.title}</h1>
      <p className="cl-lede">{entry.description}</p>
      {entry.action ? (
        <div className="cl-action" role="note">
          <b>{actionText(entry)}.</b> {capitalize(entry.action.who)}: {renderInlineMarkdown(entry.action.what)}
        </div>
      ) : null}
      {lead ? <Media {...lead} /> : null}
      <Chips entry={entry} />
      {entry.deprecations?.length ? (
        <div className="cl-prose">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>Replacement</th>
                <th>Sunset</th>
              </tr>
            </thead>
            <tbody>
              {entry.deprecations.map((d) => (
                <tr key={d.what}>
                  <td>{renderInlineMarkdown(d.what)}</td>
                  <td>{renderInlineMarkdown(d.replacement)}</td>
                  <td>{formatDay(d.sunset)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="cl-prose">
        <Body components={components} />
      </div>
      <div className="cl-foot">
        <CopyLink url={entryUrl(entry)} />
      </div>
      <nav className="cl-pn" aria-label="More updates">
        {older ? (
          <Link href={`/changelog/${entrySlug(older)}`}>
            <small>Previous</small>
            {older.title}
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={`/changelog/${entrySlug(newer)}`} style={{ textAlign: 'right' }}>
            <small>Next</small>
            {newer.title}
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
