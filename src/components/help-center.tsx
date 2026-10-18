'use client';

import Link from 'next/link';
import { useState } from 'react';

export type HelpCard = { href: string; title: string; description: string; category: string; tags: string[] };

const ALL = 'All';

/**
 * The help home (/docs/help, spec §5 + §7.2, mock H1 / P3): centered hero with an article search,
 * category chips (All first) and the cards. Search and chips filter the cards in the browser; every
 * card is in the prerendered HTML. ⌘K stays the global docs search.
 */
export function HelpCenter({
  title,
  description,
  cards,
  categories,
}: {
  title: string;
  description?: string;
  cards: HelpCard[];
  categories: string[];
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const found = cards.filter((card) =>
    terms.every((term) => [card.title, card.description, ...card.tags].join(' ').toLowerCase().includes(term)),
  );
  const shown = found.filter((card) => category === ALL || card.category === category);
  // A chip alone never empties the grid (it lists only categories with cards), so an empty grid
  // means the search; when the chip hides matches, say so and offer them.
  const chipHides = category !== ALL && found.length > 0;
  const empty = chipHides ? `No articles in ${category} match your search.` : 'No articles match your search.';

  return (
    <>
      <header className="aff-help-hero">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
        <label className="aff-help-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles"
            aria-label="Search articles"
            autoComplete="off"
          />
        </label>
      </header>
      <div className="aff-help-chips" role="group" aria-label="Categories">
        {[ALL, ...categories].map((name) => (
          <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>
            {name}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="aff-help-grid">
          {shown.map((card) => (
            <Link key={card.href} href={card.href} className="aff-help-card">
              <span className="aff-help-cat">{card.category}</span>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <span className="aff-help-tags">
                {card.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="aff-help-empty">
          {empty}
          {chipHides ? (
            <button type="button" onClick={() => setCategory(ALL)}>
              Search all categories
            </button>
          ) : null}
        </p>
      )}
      {/* Screen readers hear the result count when the search or a chip changes it. */}
      <p className="sr-only" aria-live="polite">
        {shown.length ? `${shown.length} ${shown.length === 1 ? 'article' : 'articles'}` : empty}
      </p>
      <div className="aff-help-contact">
        <span>Still stuck?</span>
        <Link href="/docs/support" className="aff-btn aff-btn-secondary aff-btn-sm">
          Support options
        </Link>
        <Link href="/docs/support/contact" className="aff-btn aff-btn-secondary aff-btn-sm">
          Contact us
        </Link>
      </div>
    </>
  );
}
