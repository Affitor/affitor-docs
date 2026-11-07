import type { MetadataRoute } from 'next';
import { getAgentPages, type AgentPage } from '@/lib/agent-md';
import { BLOG_URL, DOCS_URL } from '@/lib/site';

const newest = (pages: AgentPage[]) =>
  pages
    .map((page) => page.updated)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAgentPages();
  const lastModified = newest(pages);
  // The blog index (no twin) changes whenever a post does, so it carries the newest post date.
  const blogModified = newest(pages.filter((page) => page.type === 'blog'));

  return [
    ...pages.flatMap((page) => {
      const html = { url: page.url, ...(page.updated ? { lastModified: page.updated } : {}) };
      const md = { url: page.markdownUrl, ...(page.updated ? { lastModified: page.updated } : {}) };
      return [html, md];
    }),
    { url: BLOG_URL, ...(blogModified ? { lastModified: blogModified } : {}) },
    { url: `${DOCS_URL}/llms.txt`, ...(lastModified ? { lastModified } : {}) },
    { url: `${DOCS_URL}/llms-full.txt`, ...(lastModified ? { lastModified } : {}) },
  ];
}
