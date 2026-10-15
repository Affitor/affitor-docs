// End-to-end check of the docs.affitor.com rules through the real Next router (config
// redirects, middleware, rewrites, public files, routes), which the unit check in
// check-docs-host.mjs cannot see. Needs a finished `npm run build`. Starts `next start`
// once per DOCS_HOST_REDIRECT mode on a local port and probes with forced Host headers.
// Run: node scripts/check-docs-host-http.mjs  (CI: .github/workflows/agent-surface.yml)
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { request } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.CHECK_PORT || 3391);
const DOCS = 'docs.affitor.com';
const PROXY = 'affitor-docs.vercel.app';
const BLOG_PAGES = ['/blog', ...readdirSync(join(ROOT, 'content/blog')).filter((f) => f.endsWith('.mdx')).map((f) => `/blog/${f.slice(0, -4)}`)];

// [host, path, status, location (null = none), content-type prefix (optional)]
const ALWAYS = [
  [DOCS, '/blog/rewardful-alternatives', 301, 'https://affitor.com/blog/rewardful-alternatives'],
  [DOCS, '/docs/blog/rewardful-alternatives', 301, 'https://affitor.com/blog/rewardful-alternatives'],
  [DOCS, '/skill.md', 200, null, 'text/markdown'],
  [DOCS, '/llms.txt', 200, null, 'text/plain'],
  [DOCS, '/llms-full.txt', 200, null, 'text/plain'],
  [DOCS, '/openapi.yaml', 200, null, 'text/yaml'],
  [DOCS, '/index.md', 200, null, 'text/markdown'],
  [DOCS, '/brand/quickstart.md', 200, null, 'text/markdown'],
  [DOCS, '/advertisers/quickstart.md', 200, null, 'text/markdown'],
  [DOCS, '/docs/advertisers/quickstart.md', 200, null, 'text/markdown'],
  [DOCS, '/errors.md', 200, null, 'text/markdown'],
  [DOCS, '/changelog.md', 200, null, 'text/markdown'],
  [DOCS, '/blog/rewardful-alternatives.md', 200, null, 'text/markdown'],
  [DOCS, '/affitor-logo.svg', 200, null, 'image/svg+xml'],
  [DOCS, '/favicon.svg', 200, null, 'image/svg+xml'],
  [DOCS, '/images/how-it-works-diagram.png', 200, null, 'image/png'],
  [DOCS, '/changelog/invite-partners/invite-compose.png', 200, null, 'image/png'],
  [DOCS, '/docs/brand/dashboard.png', 200, null, 'image/png'],
  [DOCS, '/robots.txt', 200, null, 'text/plain'],
  [DOCS, '/sitemap.xml', 200, null, 'application/xml'],
  [PROXY, '/', 308, '/docs'],
  [PROXY, '/docs', 200, null, 'text/html'],
  [PROXY, '/docs/brand/quickstart', 200, null, 'text/html'],
  [PROXY, '/docs/brand/quickstart.md', 200, null, 'text/markdown'],
  [PROXY, '/docs/skill.md', 200, null, 'text/markdown'],
  [PROXY, '/docs/api/search?query=payout', 200, null, 'application/json'],
  [PROXY, '/docs/advertisers/quickstart', 308, '/docs/brand/quickstart'],
  [PROXY, '/docs/advertisers/quickstart.md', 308, '/docs/brand/quickstart.md'],
  [PROXY, '/docs/errors', 308, '/docs/api-reference/errors'],
  [PROXY, '/docs/getting-started/glossary', 308, '/docs/support/glossary'],
  [PROXY, '/docs/getting-started/what-is-affitor', 308, '/docs'],
  [PROXY, '/docs/blog/rewardful-alternatives', 308, '/blog/rewardful-alternatives'],
  [PROXY, '/blog/rewardful-alternatives', 200, null, 'text/html'],
  // Merged posts (13/10/2026): pages and .md twins 308 to the pricing comparison.
  [PROXY, '/blog/affiliate-software-pricing-comparison', 308, '/blog/best-affiliate-software-saas'],
  [PROXY, '/blog/free-affiliate-software-for-saas', 308, '/blog/best-affiliate-software-saas'],
  [PROXY, '/blog/affiliate-software-pricing-comparison.md', 308, '/blog/best-affiliate-software-saas.md'],
  [PROXY, '/blog/free-affiliate-software-for-saas.md', 308, '/blog/best-affiliate-software-saas.md'],
  [DOCS, '/blog/free-affiliate-software-for-saas', 301, 'https://affitor.com/blog/best-affiliate-software-saas'],
];
const MODES = {
  '': [
    ...ALWAYS,
    [DOCS, '/', 200, null, 'text/html'],
    [DOCS, '/brand/quickstart', 200, null, 'text/html'],
    [DOCS, '/docs/brand/quickstart', 200, null, 'text/html'],
    [DOCS, '/changelog', 200, null, 'text/html'],
    [DOCS, '/docs/api/search?query=payout', 200, null, 'application/json'],
    [DOCS, '/advertisers/quickstart', 308, '/brand/quickstart'],
    [DOCS, '/errors', 308, '/api-reference/errors'],
  ],
  301: [
    ...ALWAYS,
    [DOCS, '/', 301, 'https://affitor.com/docs'],
    [DOCS, '/brand/quickstart', 301, 'https://affitor.com/docs/brand/quickstart'],
    [DOCS, '/docs/brand/quickstart', 301, 'https://affitor.com/docs/brand/quickstart'],
    [DOCS, '/advertisers/quickstart', 301, 'https://affitor.com/docs/brand/quickstart'],
    [DOCS, '/docs/advertisers/quickstart', 301, 'https://affitor.com/docs/brand/quickstart'],
    [DOCS, '/errors', 301, 'https://affitor.com/docs/api-reference/errors'],
    [DOCS, '/changelog', 301, 'https://affitor.com/docs/changelog'],
  ],
  302: [...ALWAYS, [DOCS, '/brand/quickstart', 302, 'https://affitor.com/docs/brand/quickstart']],
};

// node:http, not fetch: fetch drops a custom Host header.
function get(host, path) {
  return new Promise((resolve, reject) => {
    const req = request({ port: PORT, path, headers: { host } }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(Object.assign(res, { body })));
    });
    req.on('error', reject);
    req.end();
  });
}

async function waitUp() {
  for (let i = 0; i < 60; i += 1) {
    try {
      await get(PROXY, '/docs');
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error('next start did not come up');
}

let failed = 0;
for (const [mode, cases] of Object.entries(MODES)) {
  const env = { ...process.env, PORT: String(PORT) };
  if (mode) env.DOCS_HOST_REDIRECT = mode;
  else delete env.DOCS_HOST_REDIRECT;
  const server = spawn(process.execPath, [join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(PORT)], { cwd: ROOT, env, stdio: 'ignore' });
  try {
    await waitUp();
    console.log(`\n--- DOCS_HOST_REDIRECT=${mode || '(unset)'}`);
    for (const [host, path, status, location, type] of cases) {
      const res = await get(host, path);
      // Same-host redirects must stay relative: proxied through affitor.com, an absolute
      // Location would send the browser to the alias host.
      const got = res.headers.location ?? null;
      const type_ = res.headers['content-type'] || '';
      const ok = res.statusCode === status && got === location && (!type || type_.startsWith(type));
      console.log(`${ok ? 'PASS' : 'FAIL'} ${host}${path} -> ${res.statusCode} ${got ?? ''} ${type ? type_ : ''}`);
      if (!ok) failed += 1;
    }
    // affitor.com proxies /blog/* and /docs/* to this app, so every root-relative URL in
    // blog HTML stays under /blog or /docs (or /favicon.ico, which the dashboard has),
    // and every docs.affitor.com URL (assets) must answer here.
    for (const page of BLOG_PAGES) {
      const html = (await get(PROXY, page)).body;
      const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
      const local = urls.filter((u) => u.startsWith('/') && !u.startsWith('//'));
      const bad = local.filter((u) => u !== '/favicon.ico' && !/^\/(?:blog|docs)(?:[/?#]|$)/.test(u));
      const apexDocs = [];
      const ok = urls.length > 0 && bad.length === 0 && apexDocs.length === 0;
      console.log(`${ok ? 'PASS' : 'FAIL'} blog HTML ${page}: ${local.length} root-relative URLs under /blog or /docs${bad.length ? `; outside: ${bad.join(', ')}` : ''}`);
      if (!ok) failed += 1;
      const docsHostUrls = [...new Set(urls.filter((u) => u.startsWith(`https://${DOCS}/`)))];
      let broken = 0;
      for (const url of docsHostUrls) {
        // /_next/image fetches its `url` from the production docs host, which does not have
        // this build's media yet; probe the source file it would fetch instead.
        const parsed = new URL(url);
        const target = parsed.pathname === '/_next/image' ? new URL(parsed.searchParams.get('url')) : parsed;
        if (target.host !== DOCS) continue;
        const res = await get(DOCS, target.pathname + target.search);
        const fine = res.statusCode === 200 ||
          (mode && res.statusCode === Number(mode) && (res.headers.location || '').startsWith('https://affitor.com/docs'));
        if (!fine) {
          broken += 1;
          console.log(`FAIL   ${url} -> ${res.statusCode} ${res.headers.location ?? ''}`);
        }
      }
      console.log(`${broken ? 'FAIL' : 'PASS'} blog HTML ${page}: ${docsHostUrls.length} docs.affitor.com links/assets answer`);
      failed += broken;
    }
  } finally {
    server.kill();
    await new Promise((r) => server.once('exit', r));
  }
}
if (failed) {
  console.error(`\nDocs host HTTP check FAILED (${failed})`);
  process.exit(1);
}
console.log('\nDocs host HTTP check passed');
