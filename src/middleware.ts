import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';

// AI-crawler tracking (AI-RANK-redesign.md, Part D2 lane 1).
// AI crawlers don't execute JS, so client-side PostHog never sees them —
// this middleware captures their hits server-side instead.
const AI_BOTS =
  /GPTBot|ClaudeBot|Claude-Web|PerplexityBot|Google-Extended|Bytespider|CCBot|anthropic-ai|OAI-SearchBot/i;

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const match = req.headers.get('user-agent')?.match(AI_BOTS);

  if (key && match) {
    const bot = match[0];
    // Fire-and-forget: waitUntil keeps the capture alive after the response
    // returns, the 1s timeout bounds it, and .catch() swallows every failure.
    // This must never block or fail the response.
    event.waitUntil(
      fetch('https://us.i.posthog.com/capture/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: key,
          event: 'ai_crawler_hit',
          distinct_id: `bot:${bot.toLowerCase()}`,
          properties: { bot, path: req.nextUrl.pathname },
        }),
        signal: AbortSignal.timeout(1000),
      }).catch(() => {}),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Skip build assets and favicon; keep .md twins and llms.txt — bots fetching
  // the machine surface is exactly the signal we want ("which posts are in the
  // answer pool").
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
