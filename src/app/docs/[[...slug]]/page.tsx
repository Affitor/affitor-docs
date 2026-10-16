import { source } from '@/lib/source';
import { getDocArticle } from '@/lib/agent-md';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { EditOnGitHub } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { useMDXComponents } from '@/../mdx-components';
import { formatDay } from '@/lib/changelog';

const GITHUB_REPO = 'https://github.com/Affitor/affitor-docs';

// Docs pages live under /docs: https://affitor.com/docs/<slug> proxies here
// (dashboard multi-zone rewrite), and /docs is the landing page.
function markdownPath(slug: string[] = []) {
  return `/docs/${slug.join('/') || 'index'}.md`;
}

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const article = getDocArticle(page);
  const MDX = page.data.body;
  const filePath = `content/docs/${params.slug?.join('/') ?? 'index'}.mdx`;
  const editUrl = `${GITHUB_REPO}/edit/main/${filePath}`;

  return (
    <DocsPage data-page-id={article.id} toc={page.data.toc} full={page.data.full} footer={{ enabled: false }} tableOfContent={{ single: true }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {/* Terms pages state their own "Last updated" in the header line (checked to match). */}
      {page.data.kind !== 'terms' ? (
        <p className="-mt-4 mb-2 text-sm text-fd-muted-foreground">Last updated {formatDay(page.data.last_updated)}</p>
      ) : null}
      <DocsBody>
        <MDX components={useMDXComponents({})} />
      </DocsBody>
      <div className="flex flex-row flex-wrap items-center gap-4">
        <EditOnGitHub href={editUrl} />
        <a
          href={markdownPath(params.slug)}
          className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground"
        >
          View as Markdown
        </a>
      </div>
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
