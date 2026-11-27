import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';

const CHEVRON = (
  <svg
    className="pointer-events-none mt-1 size-4 shrink-0 text-fd-muted-foreground motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-180"
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
  </svg>
);

type Q = ReactElement<{ id?: string; children?: ReactNode }>;

/**
 * FAQ for a regular article (the 640px column), the article-layout twin of the comparison `Faq`.
 * Same MDX: an H2 and intro paragraphs, then one "### Question" plus answer paragraphs per item.
 * Two columns from md up (intro left, questions right), widened past the column from lg like the
 * comparison tables; native <details> so the answers stay in the HTML, first one open.
 */
export function ArticleFaq({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter((c) => typeof c !== 'string' || c.trim());
  const isQ = (c: ReactNode) => isValidElement(c) && (c.type === 'h3' || c.type === defaultMdxComponents.h3);
  const first = items.findIndex(isQ);
  const left = first < 0 ? items : items.slice(0, first);
  const qa: { q: Q; a: ReactNode[] }[] = [];
  for (const c of first < 0 ? [] : items.slice(first)) {
    if (isQ(c)) qa.push({ q: c as Q, a: [] });
    else qa[qa.length - 1].a.push(c);
  }

  return (
    <section
      id="faq"
      className="not-prose my-14 grid scroll-mt-20 gap-8 md:grid-cols-[1fr_1.7fr] lg:-mx-32 xl:-mx-48"
    >
      <div className="[&>h2]:mt-0 [&>h2]:text-[32px] [&>h2]:font-semibold [&>h2]:leading-[1.2] [&>h2]:tracking-[-0.01em] [&>h2]:text-fd-foreground [&>p]:mt-4 [&>p]:text-[16px] [&>p]:leading-[1.75] [&>p]:text-fd-muted-foreground [&_a]:font-medium [&_a]:text-fd-primary hover:[&_a]:underline">
        {left}
      </div>
      <div>
        {qa.map(({ q, a }, i) => (
          <details
            key={q.props.id ?? i}
            className="group border-b border-fd-border px-1 py-4 open:my-2 open:rounded-xl open:border open:px-5 open:shadow-sm"
            open={i === 0}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <h3 id={q.props.id} className="!m-0 scroll-mt-20 text-[17px] font-medium leading-[1.5] text-fd-foreground">
                {q.props.children}
              </h3>
              {CHEVRON}
            </summary>
            <div className="mt-3 [&>p]:m-0 [&>p]:text-[15px] [&>p]:leading-[1.7] [&>p]:text-fd-muted-foreground [&>p+p]:mt-3 [&_a]:font-medium [&_a]:text-fd-primary hover:[&_a]:underline">
              {a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
