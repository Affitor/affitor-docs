import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

const BASE = (process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.affitor.com').replace(/\/$/, '');

/**
 * Generated from the Fumadocs source tree, so every published doc page appears
 * automatically with no manual sitemap upkeep. Served at /sitemap.xml.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return source.getPages().map((page) => ({
    url: `${BASE}${page.url}`,
    changeFrequency: 'weekly',
    priority: page.url === '/' ? 1 : 0.7,
  }));
}
