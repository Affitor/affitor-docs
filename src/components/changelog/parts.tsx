import Link from 'next/link';
import { renderInlineMarkdown } from '@/components/mdx/inline-markdown';
import { bannerSrc, bullets, capitalize, entrySlug, formatDay, surfaceLabel, type Entry } from '@/lib/changelog';

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
        <a key={s} className="cl-tag" href={onIndex ? `?surface=${s}` : `/changelog?surface=${s}`} data-filter={onIndex ? '' : undefined}>
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
  const list = digest ? bullets(await entry.getText('processed')) : [];

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
              // eslint-disable-next-line @next/next/no-img-element -- themed pair swapped by class
              <img key={theme} className={`cl-banner cl-${theme}`} src={bannerSrc(slug, theme)} alt="" loading="lazy" decoding="async" />
            ))}
          </Link>
        ) : null}
        <h2>
          <Link href={href}>{entry.title}</Link>
        </h2>
        <p className="cl-lede">{entry.description}</p>
        {entry.action ? (
          <div className="cl-action-line">
            {actionText(entry)}: {entry.action.what}
          </div>
        ) : null}
        <Chips entry={entry} compact={digest} onIndex />
        {list.length ? (
          <>
            <ul className="cl-peek">
              {list.slice(0, 3).map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
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
