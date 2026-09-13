import type { MetadataRoute } from 'next';
import { getAgentPages } from '@/lib/agent-md';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAgentPages();
  const lastModified = pages
    .map((page) => page.updated)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return [
    ...pages.flatMap((page) => {
      const html = { url: page.url, ...(page.updated ? { lastModified: page.updated } : {}) };
      const md = { url: page.markdownUrl, ...(page.updated ? { lastModified: page.updated } : {}) };
      return [html, md];
    }),
    { url: 'https://docs.affitor.com/llms.txt', ...(lastModified ? { lastModified } : {}) },
    { url: 'https://docs.affitor.com/llms-full.txt', ...(lastModified ? { lastModified } : {}) },
  ];
}
