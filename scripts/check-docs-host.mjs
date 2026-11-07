// Regression test for retiring docs.affitor.com in src/middleware.ts: blog pages 301
// to affitor.com/blog, docs pages 301 to affitor.com/docs, machine-readable files are
// served in place, and proxy/preview hosts are never touched. Plain node, no extra
// deps: transpiles the middleware with the repo's typescript and calls it with real
// NextRequest objects.
// Run: node scripts/check-docs-host.mjs  (CI: .github/workflows/agent-surface.yml)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));
const { NextRequest } = require('next/server');

const file = join(ROOT, 'src/middleware.ts');
const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const mod = { exports: {} };
const localRequire = (id) => (id === '@/lib/posthog' ? { POSTHOG_PUBLIC_KEY: 'phc_test' } : require(id));
new Function('module', 'exports', 'require', outputText)(mod, mod.exports, localRequire);
const { middleware, wantsMarkdown } = mod.exports;

// The AI-bot capture must keep running; count it instead of calling PostHog.
let captures = 0;
globalThis.fetch = async () => {
  captures += 1;
  return new Response('{}');
};

function run(host, path, headers = {}) {
  const req = new NextRequest(`https://${host}${path}`, { headers: { host, ...headers } });
  const pending = [];
  const res = middleware(req, { waitUntil: (p) => pending.push(p) });
  return {
    status: res.status,
    location: res.headers.get('location'),
    rewrite: res.headers.get('x-middleware-rewrite'),
    link: res.headers.get('link'),
    vary: res.headers.get('vary'),
    pending,
  };
}

let failed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}\n  ${error.message}`);
  }
}
const redirects = (host, path, location, headers, status = 301) => () => {
  const r = run(host, path, headers);
  assert.equal(r.status, status, `${host}${path} status`);
  assert.equal(r.location, location, `${host}${path} location`);
};
const passes = (host, path, headers) => () => {
  const r = run(host, path, headers);
  assert.equal(r.location, null, `${host}${path} must not redirect, got ${r.location}`);
  assert.equal(r.rewrite, null, `${host}${path} must not rewrite, got ${r.rewrite}`);
  assert.equal(r.status, 200, `${host}${path} status`);
};
// Served in place: 200, internal rewrite to `internal`, optional canonical Link.
const serves = (path, internal, link = true) => () => {
  const r = run(DOCS, path);
  assert.equal(r.location, null, `${path} must not redirect, got ${r.location}`);
  assert.equal(r.status, 200, `${path} status`);
  assert.equal(r.rewrite && new URL(r.rewrite).pathname, internal, `${path} rewrite`);
  assert.equal(r.link, link ? `<https://affitor.com${internal}>; rel="canonical"` : null, `${path} canonical Link`);
};
// Markdown negotiation (P12, CORE-690). An agent's Accept gets the .md twin; a browser's gets the
// HTML (`html` = the internal rewrite, or null when the page is served as is). Both say Vary: Accept.
const MD = { accept: 'text/markdown' };
const BROWSER = { accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8' };
const internal = (r) => r.rewrite && `${new URL(r.rewrite).pathname}${new URL(r.rewrite).search}`;
const negotiates = (host, path, twin, html = null) => () => {
  for (const [headers, want] of [[MD, twin], [BROWSER, html], [{}, html]]) {
    const r = run(host, path, headers);
    const label = `${host}${path} (accept: ${headers.accept ?? 'none'})`;
    assert.equal(r.location, null, `${label} must not redirect, got ${r.location}`);
    assert.equal(r.status, 200, `${label} status`);
    assert.equal(internal(r), want, `${label} rewrite`);
    assert.equal(r.vary, 'Accept', `${label} Vary`);
  }
};
// No twin: Accept: text/markdown changes nothing and adds no Vary.
const untouched = (host, path) => () => {
  const r = run(host, path, MD);
  assert.equal(r.location, null, `${host}${path} must not redirect, got ${r.location}`);
  assert.equal(r.rewrite, null, `${host}${path} must not rewrite, got ${r.rewrite}`);
  assert.equal(r.vary, null, `${host}${path} Vary`);
};
function mode(value, fn) {
  if (value === undefined) delete process.env.DOCS_HOST_REDIRECT;
  else process.env.DOCS_HOST_REDIRECT = value;
  console.log(`\n--- DOCS_HOST_REDIRECT=${value ?? '(unset)'}`);
  fn();
}

const DOCS = 'docs.affitor.com';
const PROXIES = ['affitor-docs.vercel.app', 'affitor.com', 'affitor-docs-git-x-affitor.vercel.app'];

// Same in every mode: blog pages, moved files, other files, proxy hosts.
function invariants() {
  check('docs host /blog -> 301 affitor.com/blog', redirects(DOCS, '/blog', 'https://affitor.com/blog'));
  check(
    'docs host /blog/<slug> -> 301 with query kept',
    redirects(DOCS, '/blog/rewardful-alternatives?utm_source=x&b=2', 'https://affitor.com/blog/rewardful-alternatives?utm_source=x&b=2'),
  );
  check('docs host /blog/ (trailing slash) -> 301 affitor.com/blog', redirects(DOCS, '/blog/', 'https://affitor.com/blog'));
  check('docs host /blog/<slug>/ -> 301 without the slash', redirects(DOCS, '/blog/rewardful-alternatives/', 'https://affitor.com/blog/rewardful-alternatives'));
  check('docs host /blog?_rsc=x -> 301 (intended)', redirects(DOCS, '/blog?_rsc=x', 'https://affitor.com/blog?_rsc=x'));
  check('docs host legacy /docs/blog/<slug> -> 301 affitor.com/blog/<slug>', redirects(DOCS, '/docs/blog/rewardful-alternatives', 'https://affitor.com/blog/rewardful-alternatives'));
  check('docs host legacy /docs/blog -> 301 affitor.com/blog', redirects(DOCS, '/docs/blog', 'https://affitor.com/blog'));
  check('docs host renamed /blog/<slug> -> 301 to the new slug in one hop', redirects(DOCS, '/blog/affiliate-software-pricing-comparison', 'https://affitor.com/blog/best-affiliate-software-saas'));
  // The changelog is its own zone at affitor.com/changelog (every mode, every changelog URL).
  for (const [path, location] of [
    ['/changelog', 'https://affitor.com/changelog'],
    ['/changelog?for=brands', 'https://affitor.com/changelog?for=brands'],
    ['/changelog/invite-partners', 'https://affitor.com/changelog/invite-partners'],
    ['/changelog.md', 'https://affitor.com/changelog.md'],
    ['/changelog/invite-partners.md', 'https://affitor.com/changelog/invite-partners.md'],
    ['/changelog/rss.xml', 'https://affitor.com/changelog/rss.xml'],
    ['/changelog.json', 'https://affitor.com/changelog.json'],
    ['/changelog/context.md', 'https://affitor.com/changelog/context.md'],
    ['/docs/changelog', 'https://affitor.com/changelog'],
    ['/docs/changelog.md', 'https://affitor.com/changelog.md'],
    ['/partners/refer-program', 'https://affitor.com/legal/refer-program'],
    ['/partners/refer-program.md', 'https://affitor.com/legal/refer-program'],
    ['/docs/partners/refer-program', 'https://affitor.com/legal/refer-program'],
  ]) check(`docs host ${path} -> 301 ${location}`, redirects(DOCS, path, location));
  // Files that moved under /docs: served in place with a canonical Link.
  for (const [path, internal] of [
    ['/skill.md', '/docs/skill.md'],
    ['/llms.txt', '/docs/llms.txt'],
    ['/llms-full.txt', '/docs/llms-full.txt'],
    ['/openapi.yaml', '/docs/openapi.yaml'],
    ['/index.md', '/docs/index.md'],
    ['/api-reference/errors.md', '/docs/api-reference/errors.md'],
    ['/affitor-logo.svg', '/docs/affitor-logo.svg'],
    ['/favicon.svg', '/docs/favicon.svg'],
    ['/apple-touch-icon.png', '/docs/apple-touch-icon.png'],
    // The default share images moved to app/docs/ with metadataBase affitor.com (CORE-690).
    ['/opengraph-image.png', '/docs/opengraph-image.png'],
    ['/twitter-image.png', '/docs/twitter-image.png'],
    ['/images/how-it-works-diagram.png', '/docs/images/how-it-works-diagram.png'],
    ['/changelog/invite-partners/invite-compose.png', '/docs/changelog/invite-partners/invite-compose.png'],
    // renamed pages' twins resolve to the current twin (no 404 after the config phase)
    ['/advertisers/quickstart.md', '/docs/brand/quickstart.md'],
    ['/advertisers.md', '/docs/brand/quickstart.md'],
    ['/brand.md', '/docs/brand/quickstart.md'],
    ['/api-reference.md', '/docs/api-reference/overview.md'],
    ['/advertisers/tracking/pageview-tracker-click.md', '/docs/brand/tracking/click-tracking.md'],
    ['/getting-started/what-is-affitor.md', '/docs/index.md'],
    ['/errors.md', '/docs/api-reference/errors.md'],
    ['/docs/advertisers/quickstart.md', '/docs/brand/quickstart.md'],
    ['/docs/blog/rewardful-alternatives.md', '/blog/rewardful-alternatives.md'],
    ['/blog/free-affiliate-software-for-saas.md', '/blog/best-affiliate-software-saas.md'],
  ]) check(`docs host ${path} served in place from ${internal}`, serves(path, internal));
  for (const path of ['/robots.txt', '/sitemap.xml', '/favicon.ico', '/docs/opengraph-image.png', '/docs/brand/dashboard.png', '/docs/skill.md', '/docs/api-reference/errors.md', '/blog/rewardful-alternatives.md', '/blog/covers/x.png']) {
    check(`docs host ${path} passes through`, passes(DOCS, path));
  }
  for (const host of PROXIES) {
    for (const path of [
      '/blog', '/blog/rewardful-alternatives?utm_source=x', '/blog/rewardful-alternatives.md',
      '/docs', '/docs/brand/quickstart', '/docs/brand/quickstart.md', '/docs/api/search', '/skill.md', '/brand/quickstart',
    ]) {
      check(`${host}${path} is never redirected or rewritten (proxy / preview host)`, passes(host, path, { rsc: '1' }));
    }
    // Renames resolve on every host as a same-host redirect (Next sends it relative,
    // so a proxied request stays on affitor.com; check-docs-host-http.mjs pins that).
    for (const [path, location] of [
      ['/docs/advertisers/quickstart', '/docs/brand/quickstart'],
      ['/docs/advertisers/tracking/pageview-tracker-click', '/docs/brand/tracking/click-tracking'],
      ['/docs/advertisers/quickstart.md', '/docs/brand/quickstart.md'],
      // /docs/brand has no page: it and the old /docs/advertisers home open the brand quickstart.
      ['/docs/advertisers', '/docs/brand/quickstart'],
      ['/docs/advertisers.md', '/docs/brand/quickstart.md'],
      ['/docs/brand', '/docs/brand/quickstart'],
      ['/docs/brand.md', '/docs/brand/quickstart.md'],
      // /docs/api-reference has no page either: it opens the API overview.
      ['/docs/api-reference', '/docs/api-reference/overview'],
      ['/docs/api-reference.md', '/docs/api-reference/overview.md'],
      ['/docs/api-reference?x=1', '/docs/api-reference/overview?x=1'],
      // Sub-folders with no page open their first sidebar page.
      ['/docs/brand/tracking', '/docs/brand/tracking/quickstart-integration'],
      ['/docs/brand/billing', '/docs/brand/billing/overdue-policy'],
      ['/docs/brand/cli', '/docs/brand/cli/quickstart'],
      ['/docs/brand/cli.md', '/docs/brand/cli/quickstart.md'],
      ['/docs/partners/quickstart', '/docs/partners/quickstart/create-account'],
      ['/docs/api-reference/integrations', '/docs/api-reference/integrations/stripe'],
      ['/docs/advertisers/tracking', '/docs/brand/tracking/quickstart-integration'],
      ['/docs/errors?x=1', '/docs/api-reference/errors?x=1'],
      ['/docs/getting-started/what-is-affitor', '/docs'],
      ['/docs/getting-started/glossary', '/docs/support/glossary'],
      ['/docs/blog/rewardful-alternatives', '/blog/rewardful-alternatives'],
      ['/docs/blog', '/blog'],
      ['/blog/affiliate-software-pricing-comparison', '/blog/best-affiliate-software-saas'],
      ['/blog/free-affiliate-software-for-saas.md', '/blog/best-affiliate-software-saas.md'],
    ]) check(`${host}${path} -> 308 ${location} on the same host`, redirects(host, path, `https://${host}${location}`, {}, 308));
    check(`${host}/docs/advertisers-x is not a rename`, passes(host, '/docs/advertisers-x'));
    check(`${host}/docs/api-reference/errors is not a folder home`, passes(host, '/docs/api-reference/errors'));
    // The old docs changelog moved to the zone: absolute, permanent, on every host.
    check(`${host}/docs/changelog -> 301 affitor.com/changelog`, redirects(host, '/docs/changelog', 'https://affitor.com/changelog'));
    check(`${host}/docs/changelog.md -> 301 affitor.com/changelog.md`, redirects(host, '/docs/changelog.md', 'https://affitor.com/changelog.md'));
    // The Refer Program terms left the docs for affitor.com/legal (one copy), twin included.
    for (const path of ['/docs/partners/refer-program', '/docs/partners/refer-program.md', '/docs/partners/refer-program?x=1']) {
      const query = path.includes('?') ? '?x=1' : '';
      check(`${host}${path.replace('?x=1', '')} -> 301 affitor.com/legal/refer-program${query}`, redirects(host, path, `https://affitor.com/legal/refer-program${query}`));
    }
    check(`${host}/docs/partners/referral-rewards is not moved`, passes(host, '/docs/partners/referral-rewards'));
    for (const path of ['/changelog', '/changelog/invite-partners', '/changelog.md', '/changelog/invite-partners.md', '/changelog/rss.xml', '/changelog.json', '/changelog/context.md', '/docs/changelog/invite-partners/invite-compose.png']) {
      check(`${host}${path} is served by the changelog zone (no redirect)`, passes(host, path));
    }
    // Accept: text/markdown -> the twin, anything else -> the HTML; Vary: Accept on both.
    for (const [path, twin] of [
      ['/docs/brand/quickstart', '/docs/brand/quickstart.md'],
      ['/docs/brand/quickstart?x=1', '/docs/brand/quickstart.md?x=1'],
      ['/docs', '/docs/index.md'],
      ['/docs/api-reference/errors', '/docs/api-reference/errors.md'],
      ['/blog/rewardful-alternatives', '/blog/rewardful-alternatives.md'],
      ['/changelog', '/changelog.md'],
      ['/changelog?for=brands', '/changelog.md?for=brands'],
      ['/changelog/invite-partners', '/changelog/invite-partners.md'],
    ]) check(`${host}${path}: markdown twin ${twin} for Accept: text/markdown, HTML otherwise, Vary: Accept`, negotiates(host, path, twin));
    for (const path of [
      '/blog', '/docs/api/search', '/docs/openapi.json', '/docs/llms-full.txt', '/docs/brand/quickstart.md', '/docs/skill.md',
      '/docs/brand/dashboard.png', '/blog/rewardful-alternatives.md', '/blog/covers/x.png', '/changelog.md', '/changelog/invite-partners.md',
      '/changelog/rss.xml', '/changelog.json', '/changelog/context.md', '/docsy', '/brand/quickstart',
    ]) check(`${host}${path} has no twin: Accept: text/markdown changes nothing`, untouched(host, path));
    // Redirects run before negotiation: the client negotiates again at the new URL.
    check(`${host} renamed page with Accept: text/markdown still 308s to the page`, redirects(host, '/docs/advertisers/quickstart', `https://${host}/docs/brand/quickstart`, MD, 308));
    check(`${host} renamed post with Accept: text/markdown still 308s to the post`, redirects(host, '/blog/affiliate-software-pricing-comparison', `https://${host}/blog/best-affiliate-software-saas`, MD, 308));
    check(`${host}/docs/changelog with Accept: text/markdown still 301s`, redirects(host, '/docs/changelog', 'https://affitor.com/changelog', MD));
  }
  // On the docs host the blog and the changelog always leave for affitor.com, Accept or not.
  check('docs host blog post with Accept: text/markdown -> same 301', redirects(DOCS, '/blog/rewardful-alternatives', 'https://affitor.com/blog/rewardful-alternatives', MD));
  check('docs host changelog entry with Accept: text/markdown -> same 301', redirects(DOCS, '/changelog/invite-partners', 'https://affitor.com/changelog/invite-partners', MD));
  check('docs host changelog index with Accept: text/markdown -> same 301', redirects(DOCS, '/changelog', 'https://affitor.com/changelog', MD));
  check('docs host /skill.md with Accept: text/markdown is still served in place', () => {
    const r = run(DOCS, '/skill.md', MD);
    assert.equal(internal(r), '/docs/skill.md');
    assert.equal(r.vary, null);
  });
}

mode(undefined, () => {
  invariants();
  // Redirects off: the docs host keeps serving every old root URL (and /docs URLs).
  check('off: docs host / served from /docs', serves('/', '/docs', false));
  check('off: docs host page served from /docs<path>', serves('/brand/quickstart?x=1', '/docs/brand/quickstart', false));
  check('off: alias Host + x-forwarded-host docs.affitor.com is not rewritten', passes(PROXIES[0], '/brand/quickstart', { 'x-forwarded-host': DOCS }));
  check('off: docs Host + x-forwarded-host affitor.com is still served from /docs', () => {
    const r = run(DOCS, '/brand/quickstart', { 'x-forwarded-host': 'affitor.com' });
    assert.equal(r.location, null);
    assert.equal(r.rewrite && new URL(r.rewrite).pathname, '/docs/brand/quickstart');
  });
  check('off: docs host /docs/<page> passes through', passes(DOCS, '/docs/brand/quickstart'));
  check('off: docs host /docs/api/search passes through', passes(DOCS, '/docs/api/search'));
  check('off: docs host /blogger is a docs page path', serves('/blogger', '/docs/blogger', false));
  check('off: renamed root page -> 308 to its root-layout path', redirects(DOCS, '/advertisers/quickstart', 'https://docs.affitor.com/brand/quickstart', {}, 308));
  check('off: /advertisers -> 308 /brand/quickstart', redirects(DOCS, '/advertisers', 'https://docs.affitor.com/brand/quickstart', {}, 308));
  check('off: /brand -> 308 /brand/quickstart', redirects(DOCS, '/brand', 'https://docs.affitor.com/brand/quickstart', {}, 308));
  check('off: /api-reference -> 308 /api-reference/overview', redirects(DOCS, '/api-reference', 'https://docs.affitor.com/api-reference/overview', {}, 308));
  check('off: /errors -> 308 /api-reference/errors', redirects(DOCS, '/errors', 'https://docs.affitor.com/api-reference/errors', {}, 308));
  check('off: /docs/errors -> 308 /api-reference/errors', redirects(DOCS, '/docs/errors', 'https://docs.affitor.com/api-reference/errors', {}, 308));
  check('off: /getting-started/what-is-affitor -> 308 /', redirects(DOCS, '/getting-started/what-is-affitor', 'https://docs.affitor.com/', {}, 308));
  // Served in place: negotiation on the /docs path it maps to.
  check('off: docs host page negotiates (twin / HTML, Vary: Accept)', negotiates(DOCS, '/brand/quickstart', '/docs/brand/quickstart.md', '/docs/brand/quickstart'));
  check('off: docs host / negotiates to the index twin', negotiates(DOCS, '/', '/docs/index.md', '/docs'));
  check('off: docs host /docs/<page> negotiates', negotiates(DOCS, '/docs/brand/quickstart', '/docs/brand/quickstart.md'));
  check('off: docs host query kept on the twin', negotiates(DOCS, '/api-reference/errors?x=1', '/docs/api-reference/errors.md?x=1', '/docs/api-reference/errors?x=1'));
  check('off: docs host /api/search has no twin', () => {
    const r = run(DOCS, '/api/search?query=x', MD);
    assert.equal(internal(r), '/docs/api/search?query=x');
    assert.equal(r.vary, null);
  });
  check('off: renamed root page with Accept: text/markdown still 308s', redirects(DOCS, '/advertisers/quickstart', 'https://docs.affitor.com/brand/quickstart', MD, 308));
  check('off: AI crawler asking for markdown is captured and gets the twin', () => {
    captures = 0;
    const r = run(DOCS, '/brand/quickstart', { 'user-agent': 'Mozilla/5.0 (compatible; ClaudeBot/1.0)', ...MD });
    assert.equal(internal(r), '/docs/brand/quickstart.md');
    assert.equal(captures, 1, 'PostHog capture fired');
  });
  check('off: AI crawler on a docs page is captured, page served', () => {
    captures = 0;
    const r = run(DOCS, '/brand/quickstart', { 'user-agent': 'Mozilla/5.0 (compatible; GPTBot/1.2)' });
    assert.equal(r.status, 200);
    assert.equal(captures, 1, 'PostHog capture fired');
  });
});

for (const status of ['301', '302']) {
  mode(status, () => {
    invariants();
    const to = (path, location) => redirects(DOCS, path, location, {}, Number(status));
    check(`${status}: docs host / -> affitor.com/docs`, to('/', 'https://affitor.com/docs'));
    check(`${status}: docs host page, query kept`, to('/api-reference/errors?x=1', 'https://affitor.com/docs/api-reference/errors?x=1'));
    check(`${status}: trailing slash dropped`, to('/brand/quickstart/', 'https://affitor.com/docs/brand/quickstart'));
    check(`${status}: /blogger is a docs page path`, to('/blogger', 'https://affitor.com/docs/blogger'));
    check(`${status}: old /docs/<page> keeps its path`, to('/docs/brand/quickstart', 'https://affitor.com/docs/brand/quickstart'));
    check(`${status}: /docs -> affitor.com/docs`, to('/docs', 'https://affitor.com/docs'));
    check(`${status}: /docsy is not mistaken for /docs`, to('/docsy', 'https://affitor.com/docs/docsy'));
    check(`${status}: renamed /advertisers/x lands on /docs/brand/x in one hop`, to('/advertisers/quickstart', 'https://affitor.com/docs/brand/quickstart'));
    check(`${status}: renamed /docs/advertisers/x in one hop`, to('/docs/advertisers/quickstart', 'https://affitor.com/docs/brand/quickstart'));
    check(`${status}: /advertisers lands on the brand quickstart in one hop`, to('/advertisers', 'https://affitor.com/docs/brand/quickstart'));
    check(`${status}: /brand lands on the brand quickstart`, to('/brand', 'https://affitor.com/docs/brand/quickstart'));
    check(`${status}: /api-reference lands on the API overview`, to('/api-reference', 'https://affitor.com/docs/api-reference/overview'));
    check(`${status}: /errors in one hop`, to('/errors', 'https://affitor.com/docs/api-reference/errors'));
    check(`${status}: /getting-started/what-is-affitor in one hop`, to('/getting-started/what-is-affitor', 'https://affitor.com/docs'));
    check(`${status}: old search API`, to('/api/search?query=x', 'https://affitor.com/docs/api/search?query=x'));
    // Only Host decides: Vercel external rewrites send the alias as Host while
    // x-forwarded-host can still carry the public host, and the reverse must not matter.
    check(`${status}: alias Host + x-forwarded-host docs.affitor.com is not redirected`, passes(PROXIES[0], '/brand/quickstart', { 'x-forwarded-host': DOCS }));
    check(`${status}: affitor.com Host + x-forwarded-host docs.affitor.com is not redirected`, passes('affitor.com', '/docs/brand/quickstart', { 'x-forwarded-host': DOCS }));
    check(`${status}: docs Host + x-forwarded-host affitor.com still redirects`, redirects(DOCS, '/brand/quickstart', 'https://affitor.com/docs/brand/quickstart', { 'x-forwarded-host': 'affitor.com' }, Number(status)));
    check(`${status}: docs Host + x-forwarded-host alias still redirects`, redirects(DOCS, '/brand/quickstart', 'https://affitor.com/docs/brand/quickstart', { 'x-forwarded-host': PROXIES[0] }, Number(status)));
    check(`${status}: docs host page with Accept: text/markdown -> same redirect`, redirects(DOCS, '/brand/quickstart', 'https://affitor.com/docs/brand/quickstart', MD, Number(status)));
    check(`${status}: docs host / with Accept: text/markdown -> same redirect`, redirects(DOCS, '/', 'https://affitor.com/docs', MD, Number(status)));
    check(`${status}: RSC request redirects too (intended)`, redirects(DOCS, '/brand/quickstart?_rsc=x', 'https://affitor.com/docs/brand/quickstart?_rsc=x', { rsc: '1' }, Number(status)));
  });
}

mode('yes', () => {
  check('an unknown DOCS_HOST_REDIRECT value keeps redirects off', serves('/brand/quickstart', '/docs/brand/quickstart', false));
});
delete process.env.DOCS_HOST_REDIRECT;

for (const [accept, want] of [
  ['text/markdown', true],
  ['text/markdown, text/html;q=0.9', true],
  ['text/markdown, */*', true],
  ['TEXT/MARKDOWN;q=1.0', true],
  [BROWSER.accept, false],
  ['text/markdown;q=0.5, text/html', false],
  ['text/markdown;q=0', false],
  ['text/markdown;q=abc', false],
  ['*/*', false],
  ['', false],
  [null, false],
]) check(`wantsMarkdown(${JSON.stringify(accept)}) = ${want}`, () => assert.equal(wantsMarkdown(accept), want));

check('AI crawler asking affitor.com for a post in markdown is captured and gets the twin', () => {
  captures = 0;
  const r = run('affitor.com', '/blog/rewardful-alternatives', { 'user-agent': 'Mozilla/5.0 (compatible; GPTBot/1.2)', ...MD });
  assert.equal(internal(r), '/blog/rewardful-alternatives.md');
  assert.equal(r.vary, 'Accept');
  assert.equal(captures, 1, 'PostHog capture fired');
});

check('AI crawler on docs host blog page is captured AND redirected', () => {
  captures = 0;
  const r = run(DOCS, '/blog/rewardful-alternatives', { 'user-agent': 'Mozilla/5.0 (compatible; GPTBot/1.2)' });
  assert.equal(r.status, 301);
  assert.equal(r.pending.length, 1, 'capture handed to waitUntil');
  assert.equal(captures, 1, 'PostHog capture fired');
});

if (failed) {
  console.error(`\nDocs host check FAILED (${failed})`);
  process.exit(1);
}
console.log('\nDocs host check passed');
