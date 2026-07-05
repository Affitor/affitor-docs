import { source } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { EditOnGitHub } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { useMDXComponents } from '@/../mdx-components';
import { DocsFooter } from '@/components/docs-footer';

const GITHUB_REPO = 'https://github.com/Affitor/affitor-docs';

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const slugPath = params.slug.join('/');
  const filePath = `content/docs/${slugPath}.mdx`;
  const editUrl = `${GITHUB_REPO}/edit/main/${filePath}`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} footer={{ enabled: false }} tableOfContent={{ single: true }}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={useMDXComponents({})} />
      </DocsBody>
      <div className="flex flex-row flex-wrap items-center gap-4">
        <EditOnGitHub href={editUrl} />
        <a
          href={`/${slugPath}.md`}
          className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground"
        >
          View as Markdown
        </a>
      </div>
      <DocsFooter />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams().filter((entry) => entry.slug && entry.slug.length > 0);
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      // machine-readable markdown twin of this page
      types: { 'text/markdown': `/${params.slug.join('/')}.md` },
    },
  };
}
