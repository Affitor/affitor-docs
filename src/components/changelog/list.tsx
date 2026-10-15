'use client';

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';

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

const has = (list: string | undefined, value: string) => (list ?? '').split(' ').includes(value);

/** Show the first `limit` rows matching the filter; returns how many rows match. */
function apply(root: HTMLElement, filter: Filter, limit: number) {
  let matched = 0;
  root.querySelectorAll<HTMLElement>('.cl-row').forEach((row) => {
    const ok = (!filter.for || has(row.dataset.for, filter.for)) && (!filter.surface || has(row.dataset.surface, filter.surface));
    if (ok) matched += 1;
    row.hidden = !(ok && matched <= limit);
  });
  return matched;
}

/**
 * The index list with its filters. Every entry is in the static HTML; ?for=<audience> and
 * ?surface=<surface> filter in place, then the first `pageSize` matches show and
 * "Older updates" reveals the next batch. Surface chips on cards (data-surface-filter)
 * add to the current audience filter instead of replacing it.
 */
export function ChangelogList({ surfaces, pageSize, children }: { surfaces: Record<string, string>; pageSize: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>({ for: '', surface: '' });
  const [limit, setLimit] = useState(pageSize);
  const [matched, setMatched] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => {
      setFilter(read());
      setLimit(pageSize);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [pageSize]);

  useEffect(() => {
    if (ref.current) setMatched(apply(ref.current, filter, limit));
  }, [filter, limit]);

  function go(next: Filter) {
    const q = new URLSearchParams();
    if (next.for) q.set('for', next.for);
    if (next.surface) q.set('surface', next.surface);
    const s = q.toString();
    window.history.pushState(null, '', s ? `?${s}` : window.location.pathname);
    setFilter(next);
    setLimit(pageSize);
  }

  function onClick(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-surface-filter]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    go({ ...filter, surface: link.dataset.surfaceFilter ?? '' });
  }

  return (
    <div ref={ref} className="cl-list" onClick={onClick}>
      <div className="cl-filters" role="group" aria-label="Show updates for">
        {AUDIENCES.map(([value, label]) => (
          <button key={label} type="button" className="cl-chip" aria-pressed={filter.for === value} onClick={() => go({ ...filter, for: value })}>
            {label}
          </button>
        ))}
        {filter.surface && surfaces[filter.surface] ? (
          <button type="button" className="cl-chip cl-chip-on" aria-label={`Clear the ${surfaces[filter.surface]} filter`} onClick={() => go({ ...filter, surface: '' })}>
            {surfaces[filter.surface]} ×
          </button>
        ) : null}
      </div>
      {children}
      {matched === 0 ? <p className="cl-empty">No updates match this filter yet.</p> : null}
      {matched !== null && matched > limit ? (
        <button type="button" className="cl-older" onClick={() => setLimit((n) => n + pageSize)}>
          Older updates
        </button>
      ) : null}
    </div>
  );
}
