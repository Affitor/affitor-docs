import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { blog } from '@/../.source/server';
import { AskAiRow } from '@/components/blog/ask-ai-row';
import { formatDate, postSlug } from '@/components/blog/post-meta';
import { AFFITOR_HEAD, MARKETPLACE_URL, PROGRAMS, affitorColumn, alsoWorthALook, glanceNote } from '@/config/affitor-facts';
import { resolveAuthor, type Author } from '@/config/authors';
import { SIGNUP_LINK } from '@/config/site-nav';
import { CompareToc } from './compare-toc';
import { readTable, type Cell } from './table-data';

/*
 * `layout: compare` posts (mock marketing-site C1, C2, P5, compare r3): the post answers its own title
 * first. Breadcrumb, category, H1, one byline, the answer, "At a glance" with Affitor as a reference
 * column, the A vs B sections, the verdict, "Also worth a look: Affitor", FAQ, Read more; the H2s on
 * the right. Affitor's numbers and words come from src/config/affitor-facts.js (also used by the .md
 * twin), never from the post.
 */

const PERSON = (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

function Avatar({ author, stacked }: { author: Author; stacked?: boolean }) {
  const ring = stacked ? ' ring-2 ring-fd-background' : '';
  return author.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={author.photo} alt="" className={`size-6 shrink-0 rounded-full object-cover${ring}`} />
  ) : (
    <span className={`grid size-6 shrink-0 place-items-center rounded-full bg-fd-muted text-fd-muted-foreground ring-1 ring-inset ring-fd-border${ring}`}>
      {PERSON}
    </span>
  );
}

/** One byline: photo(s), name, "Updated". Several writers: stacked photos and "<first> and N others". */
function Byline({ authors, updated }: { authors: Author[]; updated: string }) {
  const [first, ...rest] = authors;
  return (
    <div className="mt-4 flex items-center gap-2.5 text-[13px] leading-[18px] text-fd-muted-foreground">
      <span className="flex items-center [&>*+*]:-ml-1.5">
        {authors.map((a) => (
          <Avatar key={a.id} author={a} stacked={authors.length > 1} />
        ))}
      </span>
      <span>
        <span className="font-semibold text-fd-foreground">{first?.name}</span>
        {rest.length ? ` and ${rest.length} ${rest.length === 1 ? 'other' : 'others'}` : ''} · Updated {formatDate(updated)}
      </span>
    </div>
  );
}

const TH = 'px-3.5 py-2.5 text-left align-bottom text-xs leading-4 font-semibold uppercase tracking-[0.04em]';
const TD = 'border-b border-fd-border px-3.5 py-3 align-top';
const REF = 'bg-fd-muted';

function Value({ cell }: { cell: Cell }) {
  return (
    <>
      {cell.main}
      {cell.sub ? <span className="mt-0.5 block text-xs leading-4 text-fd-muted-foreground">{cell.sub}</span> : null}
    </>
  );
}

/**
 * "At a glance": the post's markdown table (row label | tool A | tool B, a tool name may link to its
 * pricing page) plus Affitor's column for reference. A row label Affitor has no value for fails the build.
 * Below md the table scrolls inside its box; the page never scrolls sideways.
 */
export function AtAGlance({ children, checked }: { children: ReactNode; checked: string }) {
  const { head, rows } = readTable(children);
  const ours = affitorColumn(PROGRAMS);
  const tools = [...head.slice(1), AFFITOR_HEAD];
  return (
    <div className="compare-frame not-prose my-5">
      <div className="overflow-x-auto rounded-lg border border-fd-border" tabIndex={0} role="region" aria-label="At a glance">
        <table className="w-full min-w-[560px] table-fixed border-collapse text-[13px] leading-[18px] text-fd-foreground">
          <thead>
            <tr className="bg-fd-muted">
              <th className={`${TH} w-[132px] border-b border-fd-border md:w-[28%]`}>
                <span className="sr-only">{head[0].main || 'Item'}</span>
              </th>
              {tools.map((t, i) => (
                <th key={t.main} className={`${TH} border-b border-fd-border ${i === tools.length - 1 ? 'text-fd-foreground' : 'text-fd-muted-foreground'}`}>
                  {t.href ? (
                    <a href={t.href} className="hover:underline">
                      {t.main}
                    </a>
                  ) : (
                    t.main
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {rows.map((row) => {
              const ref = ours[row[0].main];
              if (!ref) throw new Error(`At a glance: no Affitor value for row "${row[0].main}" (src/config/affitor-facts.js)`);
              return (
                <tr key={row[0].main}>
                  <td className={`${TD} font-semibold`}>{row[0].main}</td>
                  {row.slice(1).map((cell, j) => (
                    <td key={j} className={TD}>
                      <Value cell={cell} />
                    </td>
                  ))}
                  <td className={`${TD} ${REF}`}>
                    <Value cell={ref} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[13px] leading-[18px] text-fd-muted-foreground md:hidden">Swipe the table to see Affitor.</p>
      <p className="mt-2 text-[13px] leading-[18px] text-fd-muted-foreground">
        {glanceNote(checked)}
      </p>
    </div>
  );
}

/** The paragraph under "Also worth a look: Affitor" and the site's sign-up button. */
export function AlsoWorthALook() {
  const [before, link, after] = alsoWorthALook(PROGRAMS);
  return (
    <>
      <p>
        {before}
        <a href={MARKETPLACE_URL}>{link}</a>
        {after}
      </p>
      <div className="not-prose mt-4">
        <a href={SIGNUP_LINK.href} className="aff-btn aff-btn-primary">
          {SIGNUP_LINK.label}
        </a>
      </div>
    </>
  );
}

type El = ReactElement<{ id?: string; children?: ReactNode; href?: string }>;

/** FAQ as a closed list. Children: one "### Question" plus answer paragraphs per item (must match frontmatter `faq`). */
export function Faq({ children }: { children: ReactNode }) {
  const qa: { q: El; a: ReactNode[] }[] = [];
  for (const c of Children.toArray(children)) {
    if (isValidElement(c) && c.type === 'h3') qa.push({ q: c as El, a: [] });
    else if (qa.length && (typeof c !== 'string' || c.trim())) qa[qa.length - 1].a.push(c);
  }
  return (
    <div className="not-prose mt-4 border-b border-fd-border">
      {qa.map(({ q, a }, i) => (
        <details key={q.props.id ?? i} className="group border-t border-fd-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 [&::-webkit-details-marker]:hidden">
            <h3 id={q.props.id} className="scroll-mt-20 text-fd-foreground">
              {q.props.children}
            </h3>
            <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-fd-muted-foreground motion-safe:transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="pb-4 text-[15px] leading-6 text-[var(--aff-body)]">{a}</div>
        </details>
      ))}
    </div>
  );
}

function hrefs(node: ReactNode, out: string[] = []): string[] {
  for (const el of Children.toArray(node)) {
    if (!isValidElement(el)) continue;
    const { href, children } = (el as El).props;
    if (href) out.push(href);
    else hrefs(children, out);
  }
  return out;
}

/** Read more: a markdown list of /blog links, drawn as cards with each post's own category and title. */
export function ReadMore({ children }: { children: ReactNode }) {
  const posts = hrefs(children).map((href) => {
    const post = blog.find((p) => `/blog/${postSlug(p.info.path)}` === href);
    if (!post) throw new Error(`Read more: ${href} is not a blog post`);
    return { href, title: post.title, category: post.category };
  });
  return (
    <div className="not-prose mt-4 grid gap-3 sm:grid-cols-2">
      {posts.map((p) => (
        <a key={p.href} href={p.href} className="rounded-lg border border-fd-border p-4 transition-colors hover:bg-fd-muted">
          <span className="block text-xs leading-4 font-semibold text-fd-primary">{p.category}</span>
          <span className="mt-1.5 block text-sm leading-5 font-semibold text-fd-foreground">{p.title}</span>
        </a>
      ))}
    </div>
  );
}

export const compareComponents = { h3: 'h3', AtAGlance, AlsoWorthALook, Faq, ReadMore } as const;

export function CompareLayout(props: {
  slug: string;
  title: string;
  category: string;
  authors: string[];
  updated: string;
  toc: { url: string; title: string }[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-[1040px] gap-12 px-4 pt-10 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_224px]">
      <article className="compare-post min-w-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] leading-[18px] text-fd-muted-foreground">
          <a href="/blog" className="hover:text-fd-foreground">
            Blog
          </a>
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m9 6 6 6-6 6" />
          </svg>
          <a href="/blog/compare" className="hover:text-fd-foreground">
            Compare
          </a>
        </nav>
        <div className="mt-5">
          <span className="inline-flex h-6 items-center rounded-full border border-fd-border bg-fd-muted px-2.5 text-xs font-medium text-fd-muted-foreground">
            {props.category}
          </span>
        </div>
        <h1 className="mt-2.5 text-fd-foreground">{props.title}</h1>
        <Byline authors={props.authors.map(resolveAuthor)} updated={props.updated} />
        <div className="prose dark:prose-invert mt-4 max-w-none text-base leading-7 [&_p]:leading-7">{props.children}</div>
        <AskAiRow slug={props.slug} />
      </article>
      <CompareToc items={props.toc} />
    </div>
  );
}
