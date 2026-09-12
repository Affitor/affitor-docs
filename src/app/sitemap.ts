import type { MetadataRoute } from 'next';
import { getAgentPages } from '@/lib/agent-md';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAgentPages();
  const lastModified = pages.map((page) => page.updated).sort().at(-1)!;
  return [
    ...pages.flatMap((page) => [
      { url: page.url, lastModified: page.updated },
      { url: page.markdownUrl, lastModified: page.updated },
    ]),
    { url: 'https://docs.affitor.com/llms.txt', lastModified },
    { url: 'https://docs.affitor.com/llms-full.txt', lastModified },
  ];
}
