import { getAgentPages, render } from '@/lib/agent-md';

export const dynamic = 'force-static';

export async function GET() {
  const pages = await Promise.all(getAgentPages().map(async (page) => {
    const markdown = await render(page.id.split('/'));
    if (markdown === null) throw new Error(`Missing markdown for ${page.id}`);
    return markdown;
  }));

  return new Response(pages.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
