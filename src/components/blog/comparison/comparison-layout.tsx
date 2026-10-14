import type { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { AskAiRow } from '@/components/blog/ask-ai-row';
import { formatDate } from '@/components/blog/post-meta';
import { Cta } from './cta';
import { Faq } from './faq';
import { Quadrant } from './quadrant';
import { Section } from './section';
import { CostTable, FeatureMatrix, GroupTable, ScenarioTable } from './tables';
import { Band, Spacer } from './ui';

/**
 * MDX components for `layout: comparison` posts. Headings and tables stay plain elements so the
 * comparison components can read them (see table-data.ts); links keep the blog's own `a`.
 */
export const comparisonComponents: MDXComponents = {
  h2: 'h2',
  h3: 'h3',
  table: 'table',
  Section,
  Quadrant,
  GroupTable,
  FeatureMatrix,
  CostTable,
  ScenarioTable,
  Faq,
  Cta,
};

function Title({ title, highlight }: { title: string; highlight?: string }) {
  const at = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <span className="text-fd-primary underline decoration-fd-primary/50 decoration-dashed underline-offset-[6px]">{highlight}</span>
      {title.slice(at + highlight.length)}
    </>
  );
}

/**
 * Wide comparison shell (approved v5 design): tile grid on a darker page, breadcrumb, hero from
 * frontmatter, then the post body (Section, Quadrant, tables, Faq, Cta). Same route, metadata,
 * JSON-LD and .md twin as every other post.
 */
export function ComparisonLayout(props: {
  slug: string;
  title: string;
  highlight?: string;
  description: string;
  authors: string[];
  updated: string;
  children: ReactNode;
}) {
  const author = props.authors[0]?.split(',')[0].trim() ?? '';
  const initials = author
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-stone-900/10 dark:bg-white/[0.06]">
      <Band>
        <nav className="px-6 py-2 lg:px-8" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 break-words text-fd-muted-foreground text-sm sm:gap-2.5">
            <li className="inline-flex items-center gap-1.5">
              <a className="transition-colors hover:text-fd-foreground" href="/blog">
                Blog
              </a>
              <span aria-hidden>/</span>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span className="font-normal text-fd-foreground">{props.title}</span>
            </li>
          </ol>
        </nav>
      </Band>

      <section className="relative">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(9_9_11/0.16)_0.9px,transparent_1.1px)] bg-size-[5px_5px] opacity-75 mask-x-from-80% mask-x-to-95% mask-y-from-80% max-lg:opacity-50 2xl:mx-auto 2xl:max-w-7xl dark:bg-[radial-gradient(rgb(255_255_255/0.12)_0.9px,transparent_1.1px)]"
          aria-hidden
        />
        <Band>
          <div className="h-full rounded-md p-6 lg:px-8">
            <div className="relative z-10 pt-4 pb-4 lg:pt-12 lg:pb-12">
              <h1 className="max-w-4xl text-balance font-medium text-4xl tracking-[-0.02em] text-fd-foreground sm:leading-tight lg:text-5xl lg:leading-tight">
                <Title title={props.title} highlight={props.highlight} />
              </h1>
              <p className="max-w-3xl text-balance pt-3 text-base text-fd-muted-foreground">{props.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-fd-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-fd-primary/10 font-medium text-fd-primary text-xs" aria-hidden>
                    {initials}
                  </span>
                  <span>by {author}</span>
                </span>
                <span className="opacity-60" aria-hidden>
                  ·
                </span>
                <span>Updated {formatDate(props.updated)}</span>
              </div>
            </div>
          </div>
        </Band>
      </section>

      {props.children}

      <Band>
        <div className="px-6 py-5 lg:px-8 [&>div]:mt-0 [&>div]:border-0 [&>div]:pt-0">
          <AskAiRow slug={props.slug} />
        </div>
      </Band>
      <Spacer />
    </div>
  );
}
