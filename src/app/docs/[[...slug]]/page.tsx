import { source } from '@/lib/source';
import { getDocArticle } from '@/lib/agent-md';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { findNeighbour, findPath } from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useMDXComponents } from '@/../mdx-components';
import { formatDay } from '@/lib/changelog';
import { CopyForLLM, MarkdownIcon, ShareFeedback } from '@/components/page-actions';

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

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const article = getDocArticle(page);
  const MDX = page.data.body;
  const md = markdownPath(params.slug);
  const group = groupLabel(page.url);
  // Previous / next in sidebar order, within the page's own tab. The tree's `fallback` holds
  // pages no meta.json lists, from every tab mixed together, so it is left out: a page that
  // is only there gets no neighbours instead of links into another tab.
  const { previous, next } = findNeighbour({ ...source.pageTree, fallback: undefined }, page.url);

  return (
    <DocsPage
      data-page-id={article.id}
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      footer={{ enabled: false }}
      // Below the rail breakpoint the actions sit under the title (mock P1), not in an "On this page" bar.
      tableOfContentPopover={{ enabled: false }}
      tableOfContent={{
        single: true,
        // The right rail: On this page, then the page actions (spec §7.1).
        footer: (
          <div className="aff-rail-actions">
            <CopyForLLM href={md} className="aff-rail-action" />
            <ShareFeedback title={page.data.title} className="aff-rail-action" />
          </div>
        ),
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
      <header className="aff-page-head">
        {group ? <p className="aff-eyebrow">{group}</p> : null}
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
          <ShareFeedback title={page.data.title} className="aff-btn aff-btn-secondary aff-btn-sm" />
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
