import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { EditOnGitHub } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Mermaid } from '@/components/mermaid';
import { Checklist } from '@/components/mdx/checklist';
import { NextStep } from '@/components/mdx/next-step';
import { PageMeta } from '@/components/mdx/page-meta';
import { TaskCardGrid, TaskCard } from '@/components/mdx/task-card-grid';
import { FlowGrid, FlowCard } from '@/components/mdx/flow-grid';

const GITHUB_REPO = 'https://github.com/Affitor/affitor-docs';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const slugPath = params.slug?.join('/') ?? 'index';
  const filePath = `content/docs/${slugPath}.mdx`;
  const editUrl = `${GITHUB_REPO}/edit/main/${filePath}`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, Mermaid, Checklist, NextStep, PageMeta, TaskCardGrid, TaskCard, FlowGrid, FlowCard }} />
      </DocsBody>
      <EditOnGitHub href={editUrl} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
