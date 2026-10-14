import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Band, GRID } from './ui';

const CHEVRON = (
  <svg
    className="pointer-events-none size-4 shrink-0 translate-y-1 text-fd-muted-foreground motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-open:rotate-180"
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
  </svg>
);

/**
 * FAQ in two columns. Children: an H2 and intro paragraphs (left column), then one "### Question"
 * plus answer paragraphs per item (right column, native <details>, answers in the HTML).
 * The questions and answers must match the post's frontmatter `faq` (checked by check-agent-surface).
 */
export function Faq({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter((c) => typeof c !== 'string' || c.trim());
  const isQ = (c: ReactNode) => isValidElement(c) && c.type === 'h3';
  const first = items.findIndex(isQ);
  const left = first < 0 ? items : items.slice(0, first);
  const qa: { q: ReactElement<{ id?: string; children?: ReactNode }>; a: ReactNode[] }[] = [];
  for (const c of first < 0 ? [] : items.slice(first)) {
    if (isQ(c)) qa.push({ q: c as ReactElement<{ id?: string; children?: ReactNode }>, a: [] });
    else qa[qa.length - 1].a.push(c);
  }

  return (
    <section id="faq" className="scroll-mt-16">
      <Band>
        <div className="h-16" />
      </Band>
      <Band padded={false}>
        <div className={GRID}>
          <div className="grid gap-px md:grid-cols-5">
            <div
              className="py-6 max-md:px-6 md:col-span-2 md:p-10 lg:p-12 [&>h2]:font-medium [&>h2]:text-3xl [&>h2]:tracking-[-0.02em] [&>h2]:text-fd-foreground [&>p]:mt-4 [&>p]:text-balance [&>p]:text-fd-muted-foreground [&>p+p]:mt-6 [&_a]:font-medium [&_a]:text-fd-primary [&_a]:hover:underline"
              data-grid-content="true"
            >
              {left}
            </div>
            <div className="space-y-4 pt-6 md:col-span-3 md:px-4 md:pt-10 md:pb-4 lg:pt-12" data-grid-content="true">
              <div className="-space-y-1">
                {qa.map(({ q, a }, i) => (
                  <details
                    key={q.props.id ?? i}
                    className="group rounded-lg px-6 py-1 open:bg-fd-card open:shadow open:ring-1 open:ring-fd-foreground/5"
                    open={i === 0}
                  >
                    <summary
                      className={`flex flex-1 cursor-pointer list-none items-start justify-between gap-4 py-4 text-left [&::-webkit-details-marker]:hidden ${
                        i === qa.length - 1 ? '' : 'border-b border-fd-border group-open:border-transparent'
                      }`}
                    >
                      <h3 id={q.props.id} className="scroll-mt-20 font-medium text-base text-fd-foreground">
                        {q.props.children}
                      </h3>
                      {CHEVRON}
                    </summary>
                    <div className="pt-0 pb-4 [&>p]:text-fd-muted-foreground [&>p]:text-sm [&>p+p]:mt-3">{a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}
