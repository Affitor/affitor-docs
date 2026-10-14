import { Children, isValidElement, type ReactNode } from 'react';
import { TABLES } from './tables';
import { Band, GRID, Spacer } from './ui';

const PROSE = [
  '[&>h2]:mb-6 [&>h2]:font-medium [&>h2]:text-3xl [&>h2]:tracking-[-0.02em] [&>h2]:text-fd-foreground',
  '[&>p]:mb-5 [&>p]:max-w-4xl [&>p]:text-fd-muted-foreground [&>p]:leading-relaxed [&>p:last-child]:mb-0',
  '[&_strong]:font-medium [&_strong]:text-fd-foreground [&>p_a]:text-fd-primary [&>p_a]:hover:underline',
].join(' ');

const HEAD = [
  '[&>h2]:mb-4 [&>h2]:max-w-3xl [&>h2]:text-pretty [&>h2]:font-medium [&>h2]:text-2xl [&>h2]:leading-tight [&>h2]:tracking-[-0.02em] [&>h2]:text-fd-foreground lg:[&>h2]:text-3xl',
  '[&>p]:max-w-3xl [&>p]:text-pretty [&>p]:text-base [&>p]:text-fd-muted-foreground [&>p+p]:mt-4',
  '[&_strong]:font-medium [&_strong]:text-fd-foreground [&_a]:text-fd-primary [&_a]:hover:underline',
].join(' ');

const FOOT = '[&>p]:max-w-4xl [&>p]:text-pretty [&>p]:text-fd-muted-foreground [&>p]:text-sm [&_a]:text-fd-primary [&_a]:hover:underline';

/**
 * One section of a comparison page. With a comparison table among its children it renders the
 * v5 table section (heading tile, full-width table tile, footnote tile, then a spacer row);
 * otherwise a prose tile (thesis, verdict).
 */
export function Section({ id, children }: { id?: string; children: ReactNode }) {
  const items = Children.toArray(children).filter((c) => typeof c !== 'string' || c.trim());
  const at = items.findIndex((c) => isValidElement(c) && TABLES.includes(c.type));

  if (at < 0) {
    return (
      <section id={id} className="scroll-mt-16">
        <Band tile="h-full rounded bg-fd-background/90 backdrop-blur-sm">
          <div className="h-full rounded-md p-6 lg:px-8">
            <div className={`py-4 lg:py-8 ${PROSE}`}>{items}</div>
          </div>
        </Band>
      </section>
    );
  }

  const foot = items.slice(at + 1);
  return (
    <section id={id} className="scroll-mt-16">
      <Band padded={false}>
        <div className={GRID}>
          <div className="grid gap-px">
            <div className={`@4xl:px-8 px-6 @4xl:pt-16 pt-8 @4xl:pb-8 pb-6 ${HEAD}`} data-grid-content="true">
              {items.slice(0, at)}
            </div>
            <div className="overflow-x-auto lg:overflow-visible" data-grid-content="true">
              {items[at]}
            </div>
            {foot.length ? (
              <div className={`@4xl:px-8 px-6 py-6 ${FOOT}`} data-grid-content="true">
                {foot}
              </div>
            ) : null}
          </div>
        </div>
      </Band>
      <Spacer />
    </section>
  );
}
