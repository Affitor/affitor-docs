import { source } from '@/lib/source';
import { getDocArticle, helpCards, useCaseCards } from '@/lib/agent-md';
import { HELP_CATEGORIES } from '@/lib/help';
import { HelpCenter } from '@/components/help-center';
import { UseCases } from '@/components/use-cases';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { findPath, flattenTree, getPageTreeRoots } from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useMDXComponents } from '@/../mdx-components';
import { formatDay } from '@/lib/changelog';
import { CopyForLLM, MarkdownIcon, SendFeedback } from '@/components/page-actions';

// Docs pages live under /docs: https://affitor.com/docs/<slug> proxies here
// (dashboard multi-zone rewrite), and /docs is the landing page.
function markdownPath(slug: string[] = []) {
  return `/docs/${slug.join('/') || 'index'}.md`;
}

/** The sidebar group a page sits under (a `---Group---` separator in meta.json), shown as the eyebrow. */
function groupLabel(url: string) {
  const path = findPath(source.pageTree.children, (node) => node.type === 'page' && node.url === url) ?? [];
  const separator = path.filter((node) => node.type === 'separator').pop();
  return typeof separator?.name === 'string' ? separator.name : undefined;
}

/**
 * Previous / next in sidebar order, within the page's own tab. Only the tree's own pages count: a
 * pointer link (no $ref, e.g. MCP server under API Reference and Partners) leads into another tree.
 * The tree's `fallback` holds pages no meta.json lists, from every tab mixed together, so it is left
 * out: a page that is only there gets no neighbours instead of links into another tab.
 */
function neighbours(url: string) {
  for (const root of getPageTreeRoots({ ...source.pageTree, fallback: undefined })) {
    const pages = flattenTree(root.children).filter((node) => node.$ref);
    const i = pages.findIndex((node) => node.url === url);
    if (i !== -1) return { previous: pages[i - 1], next: pages[i + 1] };
  }
  return {};
}

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const article = getDocArticle(page);

  if (page.data.articles) {
    // The help home: hero, search, chips and cards, full width (globals.css drops the left nav when
    // the page carries .aff-help). Same shell, tab row on top; no rail, no page footer.
    const cards = helpCards(page.data.articles);
    return (
      <DocsPage
        data-page-id={article.id}
        className="aff-help"
        full
        breadcrumb={{ enabled: false }}
        footer={{ enabled: false }}
        tableOfContent={{ enabled: false }}
        tableOfContentPopover={{ enabled: false }}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
        <HelpCenter
          title={page.data.title}
          description={page.data.description}
          cards={cards}
          categories={HELP_CATEGORIES.filter((category) => cards.some((card) => card.category === category))}
        />
      </DocsPage>
    );
  }

  if (page.data.use_cases) {
    // The use cases home: hero and one card per use case, full width with no left nav, like the
    // help home (globals.css drops the left nav for .aff-usecases).
    return (
      <DocsPage
        data-page-id={article.id}
        className="aff-usecases"
        full
        breadcrumb={{ enabled: false }}
        footer={{ enabled: false }}
        tableOfContent={{ enabled: false }}
        tableOfContentPopover={{ enabled: false }}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
        <UseCases title={page.data.title} description={page.data.description} cards={useCaseCards(page.data.use_cases)} />
      </DocsPage>
    );
  }

  const MDX = page.data.body;
  const md = markdownPath(params.slug);
  const group = groupLabel(page.url);
  // A use case page (spec §7.4, mock U2): the doc page with no left nav and no rail, a breadcrumb
  // back to the use cases home instead of the eyebrow, and no previous / next.
  const useCase = page.data.use_case;
  const { previous, next } = useCase ? { previous: undefined, next: undefined } : neighbours(page.url);

  return (
    <DocsPage
      data-page-id={article.id}
      className={useCase ? 'aff-usecase' : undefined}
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      footer={{ enabled: false }}
      // Below the rail breakpoint the actions sit under the title (mock P1), not in an "On this page" bar.
      tableOfContentPopover={{ enabled: false }}
      tableOfContent={
        useCase
          ? { enabled: false }
          : {
              single: true,
              // The right rail: On this page, then the page actions (spec §7.1).
              footer: (
                <div className="aff-rail-actions">
                  <CopyForLLM href={md} className="aff-rail-action" />
                  <SendFeedback page={page.url} className="aff-rail-action" />
                </div>
              ),
            }
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
      <header className="aff-page-head">
        {useCase ? (
          <nav aria-label="Breadcrumb" className="aff-crumbs">
            <Link href="/docs/use-cases">Use cases</Link>
            <span aria-hidden>›</span>
            <span aria-current="page">{useCase.name}</span>
          </nav>
        ) : group ? (
          <p className="aff-eyebrow">{group}</p>
        ) : null}
        <DocsTitle className="aff-title">{page.data.title}</DocsTitle>
        <DocsDescription className="aff-description">{page.data.description}</DocsDescription>
        <div className="aff-page-actions">
          <CopyForLLM href={md} className="aff-action" />
          <a href={md} className="aff-action">
            <MarkdownIcon />
            View as Markdown
          </a>
        </div>
      </header>
      <DocsBody>
        <MDX components={useMDXComponents({})} />
      </DocsBody>
      <footer className="aff-page-foot">
        <div className="aff-page-foot-row">
          <SendFeedback page={page.url} className="aff-btn aff-btn-secondary aff-btn-sm" />
          {/* Terms pages state their own "Last updated" in the header line (checked to match). */}
          {page.data.kind !== 'terms' ? (
            <p className="aff-updated">Last updated {formatDay(page.data.last_updated)}</p>
          ) : null}
        </div>
        {previous || next ? (
          <nav className="aff-page-nav" aria-label="Previous and next pages">
            {previous ? (
              <Link href={previous.url} className="aff-page-nav-card">
                <span>Previous</span>
                <span>{previous.name}</span>
              </Link>
            ) : null}
            {next ? (
              <Link href={next.url} className="aff-page-nav-card aff-page-nav-next">
                <span>Next</span>
                <span>{next.name}</span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </footer>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: getDocArticle(page).url,
      // machine-readable markdown twin of this page
      types: { 'text/markdown': markdownPath(params.slug) },
    },
  };
}
