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
const { middleware } = mod.exports;

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
const redirects = (host, path, location, headers) => () => {
  const r = run(host, path, headers);
  assert.equal(r.status, 301, `${host}${path} status`);
  assert.equal(r.location, location, `${host}${path} location`);
};
const passes = (host, path, headers) => () => {
  const r = run(host, path, headers);
  assert.equal(r.location, null, `${host}${path} must not redirect, got ${r.location}`);
  assert.equal(r.rewrite, null, `${host}${path} must not rewrite, got ${r.rewrite}`);
  assert.equal(r.status, 200, `${host}${path} status`);
};
const servesInPlace = (path, internal) => () => {
  const r = run(DOCS, path);
  assert.equal(r.location, null, `${path} must not redirect, got ${r.location}`);
  assert.equal(r.status, 200, `${path} status`);
  assert.equal(r.rewrite && new URL(r.rewrite).pathname, internal, `${path} rewrite`);
  assert.equal(r.link, `<https://affitor.com${internal}>; rel="canonical"`, `${path} canonical Link`);
};

const DOCS = 'docs.affitor.com';
check('docs host /blog -> 301 affitor.com/blog', redirects(DOCS, '/blog', 'https://affitor.com/blog'));
check(
  'docs host /blog/<slug> -> 301 with query kept',
  redirects(DOCS, '/blog/rewardful-alternatives?utm_source=x&b=2', 'https://affitor.com/blog/rewardful-alternatives?utm_source=x&b=2'),
);
check('docs host /blog/ (trailing slash) -> 301 affitor.com/blog', redirects(DOCS, '/blog/', 'https://affitor.com/blog'));
check(
  'docs host /blog/<slug>/ (trailing slash) -> 301 without the slash',
  redirects(DOCS, '/blog/rewardful-alternatives/', 'https://affitor.com/blog/rewardful-alternatives'),
);
check('docs host /blog/<slug>.md twin is NOT redirected', passes(DOCS, '/blog/rewardful-alternatives.md'));
check('docs host blog image is NOT redirected', passes(DOCS, '/blog/cover.png'));
// Intended: RSC payload requests on the docs host redirect too. The browser's
// cross-origin RSC fetch fails and Next falls back to a full page load of the same
// URL, which then lands on affitor.com/blog. Serving them would keep docs-host blog
// content reachable; affitor.com's own RSC requests arrive on the proxy host instead.
check('docs host /blog?_rsc=x -> 301 (intended)', redirects(DOCS, '/blog?_rsc=x', 'https://affitor.com/blog?_rsc=x'));
check(
  'docs host RSC header request (rsc: 1, next-router-state-tree) -> 301 (intended)',
  redirects(DOCS, '/blog/rewardful-alternatives', 'https://affitor.com/blog/rewardful-alternatives', {
    rsc: '1',
    'next-router-state-tree': '%5B%22%22%5D',
  }),
);
// Docs pages: one 301 hop to affitor.com/docs, the old root path kept under /docs.
check('docs host / -> 301 affitor.com/docs', redirects(DOCS, '/', 'https://affitor.com/docs'));
check(
  'docs host page -> 301 affitor.com/docs/<page> with query kept',
  redirects(DOCS, '/api-reference/errors?x=1', 'https://affitor.com/docs/api-reference/errors?x=1'),
);
check('docs host page/ (trailing slash) -> 301 without the slash', redirects(DOCS, '/brand/quickstart/', 'https://affitor.com/docs/brand/quickstart'));
check('docs host /blogger is a docs page path, not the blog', redirects(DOCS, '/blogger', 'https://affitor.com/docs/blogger'));
check('docs host /changelog -> 301 affitor.com/docs/changelog', redirects(DOCS, '/changelog', 'https://affitor.com/docs/changelog'));
check('docs host legacy /advertisers/x keeps its path (renamed on the next hop)', redirects(DOCS, '/advertisers/quickstart', 'https://affitor.com/docs/advertisers/quickstart'));
check('docs host old /docs/<page> keeps its path, no double prefix', redirects(DOCS, '/docs/brand/quickstart', 'https://affitor.com/docs/brand/quickstart'));
check('docs host /docs -> 301 affitor.com/docs', redirects(DOCS, '/docs', 'https://affitor.com/docs'));
check('docs host /docsy is not mistaken for /docs', redirects(DOCS, '/docsy', 'https://affitor.com/docs/docsy'));
check('docs host old search API -> 301 to the moved endpoint', redirects(DOCS, '/api/search?query=x', 'https://affitor.com/docs/api/search?query=x'));
check('docs host RSC request for a docs page -> 301 (intended)', redirects(DOCS, '/brand/quickstart?_rsc=x', 'https://affitor.com/docs/brand/quickstart?_rsc=x', { rsc: '1' }));
// Machine-readable files that moved under /docs: served in place (agents were told to
// fetch docs.affitor.com/skill.md; some fetchers refuse cross-host redirects).
check('docs host /skill.md served in place from /docs/skill.md', servesInPlace('/skill.md', '/docs/skill.md'));
check('docs host /llms.txt served in place', servesInPlace('/llms.txt', '/docs/llms.txt'));
check('docs host /llms-full.txt served in place', servesInPlace('/llms-full.txt', '/docs/llms-full.txt'));
check('docs host /openapi.yaml served in place', servesInPlace('/openapi.yaml', '/docs/openapi.yaml'));
check('docs host /index.md twin served in place', servesInPlace('/index.md', '/docs/index.md'));
check('docs host page twin served in place', servesInPlace('/api-reference/errors.md', '/docs/api-reference/errors.md'));
check('docs host /changelog.md served in place', servesInPlace('/changelog.md', '/docs/changelog.md'));
// Other files pass through untouched.
for (const path of ['/robots.txt', '/sitemap.xml', '/favicon.ico', '/docs/brand/dashboard.png', '/docs/skill.md', '/docs/api-reference/errors.md', '/opengraph-image.png']) {
  check(`docs host ${path} passes through`, passes(DOCS, path));
}
for (const host of ['affitor-docs.vercel.app', 'affitor.com', 'affitor-docs-git-x-affitor.vercel.app']) {
  for (const path of [
    '/blog', '/blog/rewardful-alternatives?utm_source=x', '/blog/rewardful-alternatives.md',
    '/docs', '/docs/brand/quickstart', '/docs/brand/quickstart.md', '/docs/api/search', '/skill.md', '/brand/quickstart',
  ]) {
    check(`${host}${path} is never redirected or rewritten (proxy / preview host)`, passes(host, path, { rsc: '1' }));
  }
}
check('AI crawler on docs host is captured AND redirected', () => {
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
