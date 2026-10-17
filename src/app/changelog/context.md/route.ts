import { contextPack } from '@/lib/changelog';

// affitor.com/changelog/context.md: the shared context pack for AI-made posts and videos
// (content/changelog/_context.md), as is. A static segment, so it wins over the
// /changelog/:slug.md twin rewrite and no entry can take the slug.
export const dynamic = 'force-static';

export function GET() {
  return new Response(contextPack(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
