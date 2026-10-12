import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { POSTHOG_PUBLIC_KEY } from '@/lib/posthog';

// AI-crawler tracking (AI-RANK-redesign.md, Part D2 lane 1).
// AI crawlers don't execute JS, so client-side PostHog never sees them —
// this middleware captures their hits server-side instead.
const AI_BOTS =
  /GPTBot|ClaudeBot|Claude-Web|PerplexityBot|Google-Extended|Bytespider|CCBot|anthropic-ai|OAI-SearchBot/i;

// docs.affitor.com is retired as a public host: docs pages now live at
// https://affitor.com/docs and the blog at https://affitor.com/blog (both proxied
// here by the dashboard through the Vercel production alias, affitor-docs.vercel.app;
// Vercel external rewrites send that alias as Host, so proxied requests never match
// DOCS_HOST and cannot loop). On DOCS_HOST:
//  - blog pages 301 to affitor.com/blog<path>;
//  - every other page 301s to affitor.com/docs<path> (old /docs/<page> URLs keep
//    their path, since the prefix is already there);
//  - files are never redirected. Machine-readable files that moved under /docs (the
//    .md twins, skill.md, llms.txt, llms-full.txt, openapi.yaml) are served in place
//    with a canonical Link header, because agents are told to fetch
//    docs.affitor.com/skill.md and some fetchers refuse a cross-host redirect.
//    Images, favicons, robots.txt and sitemap.xml pass through untouched.
// Preview deployments have their own host and are untouched.
const DOCS_HOST = 'docs.affitor.com';
const BLOG_PAGE = /^\/blog(?:\/[^.]*)?$/;
const FILE = /\.[^/]+$/;
const MOVED_FILE = /^\/(?!docs\/|blog\/)(?:.+\.md|llms\.txt|llms-full\.txt|openapi\.yaml)$/;

function docsHost(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (BLOG_PAGE.test(pathname)) {
    // Next already 308s /blog/ to /blog before middleware; strip it anyway so a
    // direct call never emits a trailing-slash URL.
    return NextResponse.redirect(`https://affitor.com${pathname.replace(/\/$/, '')}${search}`, 301);
  }
  if (MOVED_FILE.test(pathname)) {
    const res = NextResponse.rewrite(new URL(`/docs${pathname}${search}`, req.url));
    res.headers.set('Link', `<https://affitor.com/docs${pathname}>; rel="canonical"`);
    return res;
  }
  if (FILE.test(pathname)) return NextResponse.next();
  const path = pathname.replace(/\/$/, '');
  const target = /^\/docs(?:\/|$)/.test(path) ? path : `/docs${path}`;
  return NextResponse.redirect(`https://affitor.com${target}${search}`, 301);
}

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || POSTHOG_PUBLIC_KEY;
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

  if (req.headers.get('host') === DOCS_HOST) return docsHost(req);

  return NextResponse.next();
}

export const config = {
  // Skip build assets and favicon (assetPrefix serves /_next/* from DOCS_HOST, so
  // they must never redirect); keep .md twins and llms.txt — bots fetching the
  // machine surface is exactly the signal we want ("which posts are in the answer
  // pool").
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
