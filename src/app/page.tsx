import { source } from '@/lib/source';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { EditOnGitHub } from 'fumadocs-ui/layouts/docs/page';
import { useMDXComponents } from '@/../mdx-components';
import { DocsShell } from '@/components/docs-shell';
import { DocsFooter } from '@/components/docs-footer';

const GITHUB_REPO = 'https://github.com/Affitor/affitor-docs';

export default function HomePage() {
  const page = source.getPage([]);
  if (!page) return null;

  const MDX = page.data.body;
  const editUrl = `${GITHUB_REPO}/edit/main/content/docs/index.mdx`;

  return (
    <DocsShell>
      <DocsPage toc={page.data.toc} full={page.data.full} footer={{ enabled: false }} tableOfContent={{ single: true }}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX components={useMDXComponents({})} />
        </DocsBody>
        <div className="flex flex-row flex-wrap items-center gap-4">
          <EditOnGitHub href={editUrl} />
          <a
            href="/index.md"
            className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground"
          >
            View as Markdown
          </a>
        </div>
        <DocsFooter />
      </DocsPage>
    </DocsShell>
  );
}
