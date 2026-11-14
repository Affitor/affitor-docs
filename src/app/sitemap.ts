import type { MetadataRoute } from 'next';
import { getAgentPages, type AgentPage } from '@/lib/agent-md';
import { DOCS_URL } from '@/lib/site';

const newest = (pages: AgentPage[]) =>
  pages
    .map((page) => page.updated)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAgentPages();
  const lastModified = newest(pages);

  // Every page and its .md twin; the blog index is one of them (dated by the newest post, src/lib/agent-md.ts).
  return [
    ...pages.flatMap((page) => {
      const html = { url: page.url, ...(page.updated ? { lastModified: page.updated } : {}) };
      const md = { url: page.markdownUrl, ...(page.updated ? { lastModified: page.updated } : {}) };
      return [html, md];
    }),
    { url: `${DOCS_URL}/llms.txt`, ...(lastModified ? { lastModified } : {}) },
    { url: `${DOCS_URL}/llms-full.txt`, ...(lastModified ? { lastModified } : {}) },
  ];
}
