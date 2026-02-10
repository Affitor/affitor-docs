import { source } from '@/lib/source';
import { NextResponse } from 'next/server';

function getCategoryFromUrl(url: string): string {
  if (url.startsWith('/docs/getting-started')) return 'Getting Started';
  if (url.startsWith('/docs/advertisers/quickstart')) return 'Quickstart';
  if (url.startsWith('/docs/advertisers/tracking')) return 'Tracking & Integration';
  if (url.startsWith('/docs/faq')) return 'Resources';
  if (url.startsWith('/docs/support')) return 'Resources';
  return 'Documentation';
}

export function GET() {
  const pages = source.getPages();

  const categoryOrder = [
    'Getting Started',
    'Quickstart',
    'Tracking & Integration',
    'Resources',
    'Documentation',
  ];

  const groupMap = new Map<string, { title: string; description: string; url: string }[]>();

  for (const page of pages) {
    const category = getCategoryFromUrl(page.url);
    if (!groupMap.has(category)) groupMap.set(category, []);
    groupMap.get(category)!.push({
      title: page.data.title ?? '',
      description: page.data.description || '',
      url: page.url,
    });
  }

  const groups = categoryOrder
    .filter((cat) => groupMap.has(cat))
    .map((cat) => ({
      category: cat,
      pages: groupMap.get(cat)!,
    }));

  return NextResponse.json(groups);
}
