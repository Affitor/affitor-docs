import Link from 'next/link';
import { Fragment } from 'react';

export type UseCaseCard = { href: string; title: string; description: string; strip: string[] };

/**
 * The use cases home (/docs/use-cases, spec §6 + §7.2, mock U1): centered hero, then one card per
 * use case page: the steps of its flow as a strip, its title and its description. Same hero as the
 * help home.
 */
export function UseCases({ title, description, cards }: { title: string; description?: string; cards: UseCaseCard[] }) {
  return (
    <>
      <header className="aff-help-hero">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="aff-uc-grid">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="aff-uc-card">
            <span className="aff-uc-strip">
              {card.strip.map((step, i) => (
                <Fragment key={step}>
                  {i > 0 ? <span className="aff-uc-arrow" aria-hidden>→</span> : null}
                  <span className="aff-uc-chip">{step}</span>
                </Fragment>
              ))}
            </span>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <span className="aff-uc-more">See the flow →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
