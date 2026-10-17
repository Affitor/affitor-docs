import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { POSTHOG_PUBLIC_KEY } from '@/lib/posthog';

// AI-crawler tracking (AI-RANK-redesign.md, Part D2 lane 1).
// AI crawlers don't execute JS, so client-side PostHog never sees them —
// this middleware captures their hits server-side instead.
const AI_BOTS =
  /GPTBot|ClaudeBot|Claude-Web|PerplexityBot|Google-Extended|Bytespider|CCBot|anthropic-ai|OAI-SearchBot/i;

// Docs pages live under /docs here and are published at https://affitor.com/docs (the
// dashboard proxies /docs/* and /blog/* through the Vercel production alias,
// affitor-docs.vercel.app; Vercel external rewrites send that alias as Host, so
// proxied requests never match DOCS_HOST and cannot loop).
//
// docs.affitor.com still answers every old URL:
//  - blog pages 301 to affitor.com/blog<path> (always on);
//  - pages: with DOCS_HOST_REDIRECT=301 (or 302 while baking) they redirect to
//    affitor.com/docs<path> in one hop; unset, they are served in place from /docs<path>,
//    so the docs deploy can go out before the dashboard proxies /docs (no broken window);
//  - files that moved under /docs (.md twins, skill.md, llms*.txt, openapi.yaml, logo,
//    favicons, images/, changelog/ screenshots) are always served in place with a
//    canonical Link header: agents are told to fetch docs.affitor.com/skill.md and
//    some fetchers refuse a cross-host redirect. Other files pass through.
// Renamed pages and the old /docs/blog prefix resolve on every host (currentPath).
// Preview deployments have their own host and only get the renames.
const DOCS_HOST = 'docs.affitor.com';
const BLOG_PAGE = /^\/blog(?:\/[^.]*)?$/;
const FILE = /\.[^/]+$/;
const MOVED_FILE =
  /^\/(?:.+\.md|llms\.txt|llms-full\.txt|openapi\.yaml|affitor-logo\.svg|favicon\.svg|favicon-(?:32|64)\.png|icon-512\.png|apple-touch-icon\.png|images\/.+|changelog\/.+\.[^/]+)$/;

// Old page paths -> current path, first match wins; a prefix also covers its subpages.
const RENAMES: [string, string][] = [
  ['/docs/advertisers/tracking/pageview-tracker-click', '/docs/brand/tracking/click-tracking'],
  ['/docs/advertisers', '/docs/brand'],
  ['/docs/getting-started/what-is-affitor', '/docs'],
  ['/docs/getting-started/glossary', '/docs/support/glossary'],
  ['/docs/errors', '/docs/api-reference/errors'],
  ['/docs/blog', '/blog'],
  // Merged into the pricing comparison (13/10/2026); the .md twins follow.
  ['/blog/affiliate-software-pricing-comparison', '/blog/best-affiliate-software-saas'],
  ['/blog/free-affiliate-software-for-saas', '/blog/best-affiliate-software-saas'],
];

// The changelog left the docs for its own zone, affitor.com/changelog (14/10/2026). Absolute and
// permanent on every host: the old /docs/changelog page and twin, and on docs.affitor.com every
// changelog page, twin, the feeds (rss.xml, changelog.json) and context.md. Old screenshots
// (/changelog/<dir>/<file>.png) keep MOVED_FILE.
const OLD_CHANGELOG = /^\/docs\/changelog(\.md)?\/?$/;
const DOCS_HOST_CHANGELOG = /^\/changelog(?:\.md|\.json|\/rss\.xml|\/[^.]*?(?:\.md)?)?\/?$/;

export function changelogMove(path: string, host: string | null): string | null {
  const old = path.match(OLD_CHANGELOG);
  if (old) return `https://affitor.com/changelog${old[1] ?? ''}`;
  if (host === DOCS_HOST && DOCS_HOST_CHANGELOG.test(path)) return `https://affitor.com${path.replace(/(.)\/$/, '$1')}`;
  return null;
}

// Pages that left the docs for another affitor.com page: absolute and permanent on every host,
// the .md twin included (the dashboard has no twins, so it lands on the page). The Refer Program
// terms have one copy at /legal/refer-program since 16/10/2026 (dashboard src/content/legal).
const MOVED_OUT: Record<string, string> = {
  '/docs/partners/refer-program': 'https://affitor.com/legal/refer-program',
};

export function movedOut(path: string, host: string | null): string | null {
  const page = path.replace(/(?:\.md|\/)$/, '');
  return MOVED_OUT[host === DOCS_HOST && !/^\/docs(?:\/|$)/.test(page) ? `/docs${page}` : page] ?? null;
}

/** The current path for a renamed page or its .md twin, or null when nothing changed. */
export function currentPath(path: string): string | null {
  const md = path.endsWith('.md');
  if (FILE.test(path) && !md) return null;
  const base = md ? path.slice(0, -3) : path;
  for (const [from, to] of RENAMES) {
    if (base !== from && !base.startsWith(`${from}/`)) continue;
    const page = to + base.slice(from.length);
    return md ? `${page === '/docs' ? '/docs/index' : page}.md` : page;
  }
  return null;
}

function redirectStatus(): 301 | 302 | null {
  const value = process.env.DOCS_HOST_REDIRECT;
  return value === '301' || value === '302' ? Number(value) as 301 | 302 : null;
}

// Same-host redirect. Next turns a same-origin Location into a relative one, so on a
// request proxied through affitor.com it resolves on affitor.com, not on the alias.
function movedTo(req: NextRequest, location: string) {
  return NextResponse.redirect(new URL(location, req.url), 308);
}

function serve(req: NextRequest, path: string) {
  const res = NextResponse.rewrite(new URL(`${path}${req.nextUrl.search}`, req.url));
  res.headers.set('Link', `<https://affitor.com${path}>; rel="canonical"`);
  return res;
}

function docsHost(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (BLOG_PAGE.test(pathname)) {
    // Next already 308s /blog/ to /blog before middleware; strip it anyway so a
    // direct call never emits a trailing-slash URL. A renamed post goes to its new slug in one hop.
    const post = pathname.replace(/\/$/, '');
    return NextResponse.redirect(`https://affitor.com${currentPath(post) ?? post}${search}`, 301);
  }
  const page = !FILE.test(pathname);
  const moved = MOVED_FILE.test(pathname) && !/^\/(?:docs|blog)\//.test(pathname);
  if (!page && !moved) {
    const renamed = currentPath(pathname);
    return renamed ? serve(req, renamed) : NextResponse.next();
  }
  // The path this URL means in the /docs layout, then any rename applied.
  const trimmed = pathname.replace(/(.)\/$/, '$1');
  const inLayout = /^\/(?:docs|blog)(?:\/|$)/.test(trimmed) ? trimmed : `/docs${trimmed === '/' ? '' : trimmed}`;
  const target = currentPath(inLayout) ?? inLayout;

  if (!page) return serve(req, target);
  // The blog already moved for good (always 301); docs pages follow DOCS_HOST_REDIRECT.
  const status = target.startsWith('/blog') ? 301 : redirectStatus();
  if (status) return NextResponse.redirect(`https://affitor.com${target}${search}`, status);
  if (target !== inLayout) {
    // Redirects off: keep the docs host on its root layout for renamed pages.
    return movedTo(req, `${target.replace(/^\/docs/, '') || '/'}${search}`);
  }
  return target === pathname ? NextResponse.next() : NextResponse.rewrite(new URL(`${target}${search}`, req.url));
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

  const host = req.headers.get('host');
  const elsewhere = changelogMove(req.nextUrl.pathname, host) ?? movedOut(req.nextUrl.pathname, host);
  if (elsewhere) return NextResponse.redirect(`${elsewhere}${req.nextUrl.search}`, 301);

  if (host === DOCS_HOST) return docsHost(req);

  const renamed = currentPath(req.nextUrl.pathname);
  if (renamed) return movedTo(req, `${renamed}${req.nextUrl.search}`);
  return NextResponse.next();
}

export const config = {
  // Skip build assets and favicon (assetPrefix serves /_next/* from DOCS_HOST, so
  // they must never redirect); keep .md twins and llms.txt — bots fetching the
  // machine surface is exactly the signal we want ("which posts are in the answer
  // pool").
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
