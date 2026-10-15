'use client';

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';

const AUDIENCES = [
  ['', 'All'],
  ['brands', 'Brands'],
  ['partners', 'Partners'],
  ['developers', 'Developers'],
] as const;

type Filter = { for: string; surface: string };

function read(): Filter {
  const q = new URLSearchParams(window.location.search);
  return { for: q.get('for') ?? '', surface: q.get('surface') ?? '' };
}

/**
 * The index list with its filter row. ?for=<audience> and ?surface=<surface> filter
 * in place (changelog.css hides rows that do not match), so the page stays static and
 * every entry is in the HTML. Any link marked data-filter inside updates the query.
 */
export function ChangelogList({ surfaces, children }: { surfaces: Record<string, string>; children: ReactNode }) {
  const [filter, setFilter] = useState<Filter>({ for: '', surface: '' });

  useEffect(() => {
    const sync = () => setFilter(read());
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  function onClick(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-filter]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    const url = new URL(link.href);
    window.history.pushState(null, '', `${url.pathname}${url.search}`);
    setFilter(read());
  }

  const href = (next: Partial<Filter>) => {
    const q = new URLSearchParams();
    const merged = { ...filter, ...next };
    if (merged.for) q.set('for', merged.for);
    if (merged.surface) q.set('surface', merged.surface);
    const s = q.toString();
    return s ? `?${s}` : '?';
  };

  return (
    <div className="cl-list" data-for={filter.for || undefined} data-surface={filter.surface || undefined} onClick={onClick}>
      <div className="cl-filters" role="toolbar" aria-label="Filter updates">
        {AUDIENCES.map(([value, label]) => (
          <a key={label} className="cl-chip" data-filter href={href({ for: value })} aria-pressed={filter.for === value}>
            {label}
          </a>
        ))}
        {filter.surface && surfaces[filter.surface] ? (
          <a className="cl-chip" data-filter href={href({ surface: '' })} aria-pressed="true" aria-label={`Clear ${surfaces[filter.surface]} filter`}>
            {surfaces[filter.surface]} ×
          </a>
        ) : null}
      </div>
      {children}
    </div>
  );
}
