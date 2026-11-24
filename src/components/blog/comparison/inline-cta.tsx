import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { textOf } from './table-data';

type El = ReactElement<{ children?: ReactNode; href?: string }>;

/** First link inside a paragraph: `[label](href)`. */
function firstLink(p: ReactNode): { href: string; label: string } | null {
  if (!isValidElement(p)) return null;
  const a = Children.toArray((p as El).props.children).find(
    (c): c is El => isValidElement(c) && typeof (c as El).props.href === 'string',
  );
  return a ? { href: a.props.href as string, label: textOf(a.props.children) } : null;
}

/**
 * One-line call to action inside a post, between paragraphs. Children: a title paragraph, a
 * one-line paragraph, and a last paragraph holding the button link. All of it stays in the .md twin.
 *
 * <InlineCta>
 *
 * **Switching from Tolt?**
 *
 * No monthly plan. $0 until $10K in sales.
 *
 * [Switch now](https://affitor.com/signup?utm_source=affitor_blog&utm_medium=cta&utm_campaign=tolt-alternatives)
 *
 * </InlineCta>
 */
export function InlineCta({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter((c) => typeof c !== 'string' || c.trim());
  const action = firstLink(items.at(-1));
  const [title, line] = action ? items.slice(0, -1) : items;
  return (
    <aside className="not-prose my-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-fd-border bg-fd-primary/5 px-5 py-4">
      <div className="min-w-[14rem] flex-1">
        <div className="font-semibold text-[15px] text-fd-foreground leading-6 [&_p]:m-0! [&_p]:leading-6!">{title}</div>
        {line ? <div className="mt-0.5 text-fd-muted-foreground text-sm leading-5 [&_p]:m-0! [&_p]:leading-5!">{line}</div> : null}
      </div>
      {action ? (
        <a
          className="inline-flex h-10 items-center whitespace-nowrap rounded-md bg-[#155DFC] px-4 font-semibold! text-sm text-white! no-underline! transition-colors duration-150 hover:bg-[#1047C9] hover:no-underline!"
          href={action.href}
        >
          {action.label} →
        </a>
      ) : null}
    </aside>
  );
}
