import Link from 'next/link';
import { getImageProps } from 'next/image';
import type { ReactNode } from 'react';
import { renderInlineMarkdown } from '@/components/mdx/inline-markdown';
import { BANNER_SIZE, bannerSrc, bullets, capitalize, entrySlug, formatDay, surfaceLabel, type Entry, type MdNode } from '@/lib/changelog';

/** Inline MDAST (text, code, bold, italic, links) to React, for the digest preview. */
function inline(nodes: MdNode[]): ReactNode[] {
  return nodes.map((node, i) => {
    const kids = node.children ? inline(node.children) : node.value;
    if (node.type === 'inlineCode') return <code key={i}>{node.value}</code>;
    if (node.type === 'strong') return <strong key={i}>{kids}</strong>;
    if (node.type === 'emphasis') return <em key={i}>{kids}</em>;
    if (node.type === 'link') return <a key={i} href={node.url}>{kids}</a>;
    return <span key={i}>{kids}</span>;
  });
}

/** Type, version, audience and surface chips. Surface chips filter the index. */
export function Chips({ entry, compact = false, onIndex = false }: { entry: Entry; compact?: boolean; onIndex?: boolean }) {
  if (compact) {
    return (
      <div className="cl-tags">
        <span className="cl-tag cl-tag-type">Digest</span>
      </div>
    );
  }
  return (
    <div className="cl-tags">
      <span className="cl-tag cl-tag-type">{capitalize(entry.type)}</span>
      {entry.version ? <span className="cl-tag">{entry.version}</span> : null}
      {entry.audience.map((a) => (
        <span key={a} className="cl-tag">
          {capitalize(a)}
        </span>
      ))}
      {entry.surfaces.map((s) => (
        <a key={s} className="cl-tag" href={`/changelog?surface=${s}`} data-surface-filter={onIndex ? s : undefined}>
          {surfaceLabel(s)}
        </a>
      ))}
    </div>
  );
}

export function actionText(entry: Entry) {
  const by = entry.action?.by ? ` by ${formatDay(entry.action.by)}` : '';
  return `Action required${by}`;
}

/** One index row: date rail + card. `anchor` marks the first card of a day (old #YYYY-MM-DD links). */
export async function Card({ entry, pinned, anchor }: { entry: Entry; pinned: boolean; anchor: boolean }) {
  const slug = entrySlug(entry);
  const href = `/changelog/${slug}`;
  const digest = entry.type === 'digest';
  const list = digest ? await bullets(entry) : [];

  return (
    <section
      className="cl-row"
      id={anchor ? entry.date : undefined}
      data-for={entry.audience.join(' ')}
      data-surface={entry.surfaces.join(' ') || undefined}
    >
      <div className="cl-rail">
        <time dateTime={entry.date}>{entry.draft ? 'This week' : formatDay(entry.date)}</time>
      </div>
      <article className="cl-card">
        {pinned ? <div className="cl-pin">Pinned until the deadline</div> : null}
        {entry.banner ? (
          <Link href={href} aria-hidden tabIndex={-1}>
            {(['light', 'dark'] as const).map((theme) => (
              // Resized WebP for the 806 px card; the 2400 px capture is only for share cards.
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- themed pair swapped by class
              <img
                key={theme}
                className={`cl-banner cl-${theme}`}
                {...getImageProps({ src: bannerSrc(slug, theme), alt: '', sizes: '(max-width: 838px) calc(100vw - 32px), 806px', ...BANNER_SIZE }).props}
              />
            ))}
          </Link>
        ) : null}
        <h2>
          <Link href={href}>{entry.title}</Link>
        </h2>
        <p className="cl-lede">{entry.description}</p>
        {entry.action ? (
          <div className="cl-action-line">
            {actionText(entry)}: {renderInlineMarkdown(entry.action.what)}
          </div>
        ) : null}
        <Chips entry={entry} compact={digest} onIndex />
        {list.length ? (
          <>
            <ul className="cl-peek">
              {list.slice(0, 3).map((item, i) => (
                <li key={i}>{inline(item)}</li>
              ))}
            </ul>
            {list.length > 3 ? (
              <Link className="cl-more" href={href}>
                {list.length - 3} more
              </Link>
            ) : null}
          </>
        ) : null}
      </article>
    </section>
  );
}
