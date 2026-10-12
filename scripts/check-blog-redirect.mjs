// Regression test for the docs.affitor.com/blog -> affitor.com/blog redirect in
// src/middleware.ts. Plain node, no extra deps: transpiles the middleware with the
// repo's typescript and calls it with real NextRequest objects.
// Run: node scripts/check-blog-redirect.mjs  (CI: .github/workflows/agent-surface.yml)
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
  return { status: res.status, location: res.headers.get('location'), pending };
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
  assert.equal(r.status, 200, `${host}${path} status`);
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
check('docs host /blogger is NOT redirected', passes(DOCS, '/blogger'));
check('docs host docs page is NOT redirected', passes(DOCS, '/api-reference/errors'));
for (const host of ['affitor-docs.vercel.app', 'affitor.com', 'affitor-docs-git-x-affitor.vercel.app']) {
  for (const path of ['/blog', '/blog/rewardful-alternatives?utm_source=x', '/blog/rewardful-alternatives.md']) {
    check(`${host}${path} is never redirected (proxy / preview host)`, passes(host, path, { rsc: '1' }));
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
  console.error(`\nBlog redirect check FAILED (${failed})`);
  process.exit(1);
}
console.log('\nBlog redirect check passed');
