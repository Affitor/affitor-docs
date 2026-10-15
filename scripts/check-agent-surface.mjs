#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loader } from 'fumadocs-core/source';
import { load, JSON_SCHEMA } from 'js-yaml';
import { generateLlms } from './gen-llms.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, '.next/server/app');
// Docs pages are served at affitor.com/docs (multi-zone), the blog at affitor.com/blog.
const ORIGIN = 'https://affitor.com';
const SITE = `${ORIGIN}/docs`;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const read = (path) => readFileSync(path, 'utf8');
// The .md twin URL: the docs landing (/docs) has /docs/index.md, every other page <url>.md.
const markdownUrl = (page) => (page.id === 'index' ? `${SITE}/index.md` : `${page.url}.md`);
const json = (path) => JSON.parse(read(path));

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }).sort();
}

function document(file) {
  const raw = read(file);
  const match = raw.match(FRONTMATTER);
  assert.ok(match, `Missing source frontmatter: ${relative(ROOT, file)}`);
  return {
    ...load(match[1], { schema: JSON_SCHEMA }),
    raw,
    file,
  };
}

function markdown(data, fallbackTitle) {
  const title = data.title ?? fallbackTitle;
  const head = data.description ? `# ${title}\n\n> ${data.description}` : `# ${title}`;
  return `${head}\n\n${data.raw.replace(FRONTMATTER, '').trim()}\n`;
}

/**
 * `layout: comparison` posts: the FAQ rendered in the body must say exactly what the frontmatter
 * `faq` (FAQPage JSON-LD) says, and every logo the comparison components can draw must exist.
 */
function checkComparison(data, id) {
  const block = data.raw.match(/\n<Faq>\n([\s\S]*?)\n<\/Faq>\n/);
  assert.ok(block, `${id}: comparison post needs a <Faq> block`);
  const body = block[1].split(/^### /m).slice(1).map((item) => {
    const [q, ...a] = item.trim().split('\n');
    return { q: q.trim(), a: a.join('\n').trim() };
  });
  assert.deepEqual(body, data.faq ?? [], `${id}: <Faq> questions and answers must match frontmatter faq`);
  const registry = read(join(ROOT, 'src/components/blog/comparison/tools.ts'));
  for (const [, logo] of registry.matchAll(/logo: '([^']+)'/g)) {
    assert.ok(existsSync(join(ROOT, 'public/blog/logos', logo)), `comparison logo public/blog/logos/${logo} is missing`);
  }
}

function inventory() {
  const docsDir = join(ROOT, 'content/docs');
  // Use the installed loader's URL rules without importing the production renderer.
  const files = walk(docsDir).filter((file) => /\.mdx?$/.test(file) || /\/meta\.json$/.test(file));
  const docs = loader({
    baseUrl: '/docs',
    source: {
      files: files.map((file) => ({
        type: file.endsWith('.json') ? 'meta' : 'page',
        path: relative(docsDir, file),
        absolutePath: file,
        data: file.endsWith('.json') ? json(file) : document(file),
      })),
    },
  }).getPages().map((page) => {
    const id = page.url.replace(/^\/docs\/?/, '') || 'index';
    assert.equal(page.data.date, undefined, `${id}: docs must not invent a date field`);
    assert.equal(page.data.updated, undefined, `${id}: docs must not invent an updated field`);
    return {
      id, type: 'doc', url: `${ORIGIN}${page.url}`,
      body: markdown(page.data, id), title: page.data.title, description: page.data.description,
    };
  });
  const blogDir = join(ROOT, 'content/blog');
  const posts = walk(blogDir).filter((file) => /\.mdx?$/.test(file)).map((file) => {
    const data = document(file);
    const id = `blog/${relative(blogDir, file).replace(/\.mdx$/, '')}`;
    assert.equal(typeof data.date, 'string', `${id}: missing frontmatter date`);
    assert.match(data.date, ISO_DAY, `${id}: date must be YYYY-MM-DD`);
    if (data.updated !== undefined) {
      assert.equal(typeof data.updated, 'string', `${id}: updated must be a string`);
      assert.match(data.updated, ISO_DAY, `${id}: updated must be YYYY-MM-DD`);
    }
    if (data.layout === 'comparison') checkComparison(data, id);
    return {
      id, type: 'blog', url: `${ORIGIN}/${id}`,
      updated: data.updated ?? data.date,
      sourceDate: data.updated ?? data.date,
      body: markdown(data, id),
    };
  });
  return [...docs, ...posts, ...changelogInventory()];
}

/**
 * affitor.com/changelog: the index twin (/changelog.md) and one twin per entry. Also the
 * authoring rules the build cannot see: no admonitions, no em dash, every <Media> and banner
 * file present in both themes, no media placeholder left.
 */
function changelogInventory() {
  const dir = join(ROOT, 'content/changelog');
  const SUB = 'New features, improvements and fixes in Affitor.';
  const TYPES = ['feature', 'digest', 'breaking', 'deprecation', 'security', 'pricing'];
  const variant = (src, theme) => src.replace(/(\.[a-z0-9]+)$/i, `-${theme}$1`);
  const entries = walk(dir).filter((file) => /\.mdx?$/.test(file)).map((file) => {
    const data = document(file);
    const slug = relative(dir, file).replace(/\.mdx?$/, '');
    const where = `content/changelog/${slug}.mdx`;
    assert.equal(typeof data.date, 'string', `${where}: missing date`);
    assert.match(data.date, ISO_DAY, `${where}: date must be YYYY-MM-DD`);
    assert.ok(TYPES.includes(data.type), `${where}: unknown type ${data.type}`);
    assert.ok(Array.isArray(data.audience) && data.audience.length, `${where}: audience is required`);
    assert.equal(typeof data.description, 'string', `${where}: description is required`);
    assert.doesNotMatch(data.raw, /^:::/m, `${where}: admonitions (:::) are not allowed in the changelog`);
    assert.equal(data.raw.includes('\u2014'), false, `${where}: em dash in a changelog entry`);
    assert.doesNotMatch(data.raw, /<Media\b[^>]*\btodo=/, `${where}: media placeholder left`);
    const media = [...data.raw.matchAll(/<Media\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
    if (data.banner) media.push(`/docs/changelog/${slug}/banner.png`);
    for (const src of media) {
      for (const theme of ['light', 'dark']) {
        const file = variant(src, theme);
        assert.ok(existsSync(join(ROOT, 'public', file)), `${where}: public${file} is missing`);
        if (src.endsWith('.mp4')) {
          const poster = file.replace(/\.mp4$/, '.poster.png');
          assert.ok(existsSync(join(ROOT, 'public', poster)), `${where}: public${poster} is missing`);
        }
      }
    }
    return { ...data, slug, surfaces: data.surfaces ?? [], url: `${ORIGIN}/changelog/${slug}` };
  }).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  assert.ok(entries.length, 'Changelog source is empty');

  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());
  const open = entries.flatMap((e) => (e.deprecations ?? []).filter((d) => d.sunset >= today)
    .map((d) => `- ${d.what} → ${d.replacement}, sunset ${d.sunset}: [${e.title}](${e.url})`));
  const lines = entries.map((e) => {
    const tags = [e.date, e.type, e.audience.join(', '), ...(e.surfaces.length ? [e.surfaces.join(', ')] : [])];
    return `- ${tags.join(' · ')} · [${e.title}](${e.url}): ${e.description}`;
  });
  const index = `# Affitor Changelog\n\n> ${SUB}\n\n${open.length ? `## Open deprecations\n\n${open.join('\n')}\n\n` : ''}## Entries\n\n${lines.join('\n')}\n`;
  return [
    { id: 'changelog', type: 'changelog', url: `${ORIGIN}/changelog`, updated: entries[0].date, sourceDate: entries[0].date, body: index },
    ...entries.map((e) => ({
      id: `changelog/${e.slug}`, type: 'changelog', url: e.url,
      updated: e.date, sourceDate: e.date, body: markdown(e, e.slug),
    })),
  ];
}

function decodeEntities(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, entity) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(Number(entity.slice(1)));
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[entity];
  });
}

function checkHtml(page, route) {
  const html = read(join(APP, `${route === '/' ? 'index' : route.slice(1)}.html`));
  const articles = [...html.matchAll(/<article\b[^>]*\bdata-page-id="([^"]*)"[^>]*>/g)];
  assert.equal(articles.length, 1, `${route}: expected one article with data-page-id`);
  assert.equal(decodeEntities(articles[0][1]), page.id, `${route}: article id`);
  const schemas = [...html.matchAll(/<script\b[^>]*\btype="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1])).filter((schema) => schema['@type'] === 'TechArticle');
  assert.equal(schemas.length, 1, `${route}: expected one TechArticle`);
  const schema = schemas[0];
  for (const [key, expected] of Object.entries({
    '@context': 'https://schema.org', '@id': page.url, identifier: page.id,
    headline: page.title, description: page.description,
  })) {
    assert.equal(typeof schema[key], 'string', `${route}: missing TechArticle ${key}`);
    assert.equal(schema[key], expected, `${route}: TechArticle ${key}`);
  }
  assert.equal('dateModified' in schema, false, `${route}: docs TechArticle must omit dateModified`);
}

function main() {
  const pages = inventory();
  const ids = pages.map((page) => page.id);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate source page ids');
  const manifest = json(join(ROOT, '.next/prerender-manifest.json'));
  const twinRoutes = Object.keys(manifest.routes).filter((route) => route.startsWith('/llms.md/'));
  assert.deepEqual(twinRoutes.sort(), ids.map((id) => `/llms.md/${id}`).sort(), 'Prerendered twin inventory differs from source');

  function artifact(route, contentType) {
    const record = manifest.routes[route];
    assert.ok(record, `${route}: missing prerender manifest entry`);
    assert.equal(record.initialStatus ?? 200, 200, `${route}: manifest status`);
    const meta = json(join(APP, `${route.slice(1)}.meta`));
    assert.equal(meta.status, 200, `${route}: artifact status`);
    assert.equal(meta.headers['content-type']?.split(';')[0], contentType, `${route}: content type`);
    return read(join(APP, `${route.slice(1)}.body`));
  }

  const sitemap = artifact('/sitemap.xml', 'application/xml');
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
    const loc = [...match[1].matchAll(/<loc>([\s\S]*?)<\/loc>/g)];
    const lastmod = [...match[1].matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/g)];
    assert.equal(loc.length, 1, 'Sitemap entry must have one loc');
    assert.ok(lastmod.length <= 1, 'Sitemap entry must have at most one lastmod');
    return {
      url: decodeEntities(loc[0][1]),
      lastmod: lastmod.length ? lastmod[0][1] : undefined,
    };
  });
  const expectedUrls = pages.flatMap((page) => [page.url, markdownUrl(page)]);
  expectedUrls.push(`${SITE}/llms.txt`, `${SITE}/llms-full.txt`);
  assert.deepEqual(entries.map((entry) => entry.url).sort(), expectedUrls.sort(), 'Sitemap URL inventory differs from source');
  const dates = new Map(entries.map((entry) => [entry.url, entry.lastmod]));
  const datedPages = pages.filter((page) => page.updated);
  const latest = datedPages.map((page) => page.updated).sort().at(-1);
  for (const name of ['llms.txt', 'llms-full.txt']) {
    assert.equal(dates.get(`${SITE}/${name}`), latest, `${name}: sitemap date`);
  }

  // Reject file-mtime / build-time ISO timestamps anywhere a content date appears.
  const BUILD_TIME = /^\d{4}-\d{2}-\d{2}T/;
  for (const entry of entries) {
    if (entry.lastmod) {
      assert.match(entry.lastmod, ISO_DAY, `${entry.url}: lastmod must be a real YYYY-MM-DD date`);
      assert.doesNotMatch(entry.lastmod, BUILD_TIME, `${entry.url}: lastmod must not be build/mtime ISO`);
    }
  }

  let corpus = artifact('/docs/llms-full.txt', 'text/plain');
  for (const page of pages) {
    const twin = artifact(`/llms.md/${page.id}`, 'text/markdown');
    const header = twin.match(FRONTMATTER);
    assert.ok(header, `${page.id}: missing twin frontmatter`);
    const metadata = load(header[1], { schema: JSON_SCHEMA });
    const htmlLastmod = dates.get(page.url);
    const mdLastmod = dates.get(markdownUrl(page));

    if (page.type === 'doc') {
      assert.equal(page.updated, undefined, `${page.id}: docs inventory must omit updated`);
      assert.equal('updated' in metadata, false, `${page.id}: docs twin must omit updated`);
      assert.equal(htmlLastmod, undefined, `${page.id}: docs sitemap HTML must omit lastmod`);
      assert.equal(mdLastmod, undefined, `${page.id}: docs sitemap .md must omit lastmod`);
      assert.deepEqual(metadata, { id: page.id, type: page.type, url: page.url }, `${page.id}: twin metadata`);
    } else {
      assert.equal(typeof page.sourceDate, 'string', `${page.id}: missing source frontmatter date`);
      assert.equal(metadata.updated, page.sourceDate, `${page.id}: twin updated must equal source frontmatter`);
      assert.equal(htmlLastmod, page.sourceDate, `${page.id}: sitemap lastmod must equal source frontmatter`);
      assert.equal(mdLastmod, page.sourceDate, `${page.id}: .md sitemap lastmod must equal source frontmatter`);
      assert.equal(metadata.updated, htmlLastmod, `${page.id}: twin updated must equal sitemap lastmod`);
      assert.deepEqual(
        metadata,
        { id: page.id, type: page.type, url: page.url, updated: page.sourceDate },
        `${page.id}: twin metadata`,
      );
      assert.match(metadata.updated, ISO_DAY, `${page.id}: updated must be YYYY-MM-DD`);
      assert.doesNotMatch(metadata.updated, BUILD_TIME, `${page.id}: updated must not be build/mtime ISO`);
    }

    assert.equal(twin.slice(header[0].length), page.body, `${page.id}: twin differs from original source body`);
    const position = corpus.indexOf(twin);
    assert.ok(position >= 0, `${page.id}: complete twin missing from llms-full.txt`);
    assert.equal(corpus.indexOf(twin, position + twin.length), -1, `${page.id}: duplicate twin in llms-full.txt`);
    corpus = corpus.slice(0, position) + corpus.slice(position + twin.length);
    if (page.type === 'doc') checkHtml(page, new URL(page.url).pathname);
    console.log(`PASS ${page.id}: twin, source body, sitemap dates, full corpus${page.type === 'doc' ? ', HTML and canonical' : ''}`);
  }
  assert.match(corpus, /^\n*$/, 'llms-full.txt contains unexpected content or extra pages');

  const llms = read(join(ROOT, 'public/docs/llms.txt'));
  assert.equal(llms, generateLlms(), 'public/docs/llms.txt is stale; run npm run gen:llms');
  assert.ok(Buffer.byteLength(llms) < 10000, 'public/docs/llms.txt must be under 10000 bytes');
  assert.equal(llms.includes('docs.affitor.com'), false, 'llms.txt must link affitor.com/docs, not docs.affitor.com');
  for (const match of llms.matchAll(/\]\(https:\/\/affitor\.com\/docs\/([^\s)]+)\.md\)/g)) {
    if (match[1] === 'skill') continue;
    assert.ok(ids.includes(match[1]), `llms.txt links unknown twin ${match[1]}`);
  }
  const robots = read(join(ROOT, 'public/robots.txt'));
  const middleware = read(join(ROOT, 'src/middleware.ts'));
  const botPattern = middleware.match(/const AI_BOTS\s*=\s*\/([^/]+)\/i/);
  assert.ok(botPattern, 'Cannot read middleware AI_BOTS');
  for (const bot of ['*', ...botPattern[1].split('|'), 'ChatGPT-User']) {
    assert.ok(robots.split(/\r?\n\s*\r?\n/).some((block) => {
      const lines = block.split(/\r?\n/);
      return lines.includes(`User-agent: ${bot}`) && lines.includes('Allow: /');
    }), `robots.txt missing Allow block for ${bot}`);
  }
  for (const line of [
    `Sitemap: ${ORIGIN}/sitemap.xml`, `Llms-Txt: ${SITE}/llms.txt`, `Llms-Full-Txt: ${SITE}/llms-full.txt`,
  ]) assert.ok(robots.split(/\r?\n/).includes(line), `robots.txt missing ${line}`);

  // Ensure the renderer no longer imports file mtime for content dates.
  const agentMd = read(join(ROOT, 'src/lib/agent-md.ts'));
  assert.equal(agentMd.includes('statSync'), false, 'agent-md.ts must not use statSync for content dates');
  assert.equal(agentMd.includes('mtime'), false, 'agent-md.ts must not use mtime for content dates');

  const assets = checkContentAssets(pages);

  console.log(`PASS content assets: ${assets} file references reachable (present in public/ and not swallowed by a redirect).`);
  console.log(`PASS agent surface: ${pages.length} pages, ${entries.length} sitemap URLs, ${datedPages.length} dated pages, ${Buffer.byteLength(llms)} llms.txt bytes; source parity, metadata, HTML, full corpus, freshness, and robots verified.`);
}

/**
 * Every absolute file reference in content (screenshots, downloads) must actually be
 * served. Two ways it can fail, and both happened:
 *   1. the file is not in public/ at that path;
 *   2. a redirect eats the path before the static handler sees it.
 * (2) is what broke all six brand screenshots: `/docs/:path*` -> `/:path*` turned
 * /docs/brand/dashboard.png into /brand/dashboard.png, which is a 404. Assets live
 * under public/docs, so the prefix is real for them and must not be stripped.
 */
function checkContentAssets(pages) {
  const FILE_REF = /!?\[[^\]]*\]\((\/[^)\s]+\.[a-z0-9]{2,5})\)/gi;
  // Root-relative page links must point at a real page under /docs or /blog. Pages moved from the root to /docs (served at affitor.com/docs), so a bare
  // /brand/... link would resolve to the main app on affitor.com. A link to a renamed
  // page only redirects; it costs a hop and spreads the old path, so it fails too.
  const PAGE_LINK = /(?:\]\(|href:\s*['"]|href=['"])(\/[^)'"\s]*)/g;
  const pageIds = new Set([...pages.map((page) => new URL(page.url).pathname), '/blog']);
  const refs = new Set();
  for (const file of walk(join(ROOT, 'content'))) {
    if (!/\.mdx?$/.test(file) && !/\/meta\.json$/.test(file)) continue;
    const body = read(file);
    for (const match of body.matchAll(FILE_REF)) refs.add(match[1]);
    for (const match of body.matchAll(PAGE_LINK)) {
      const target = match[1].split(/[?#]/)[0].replace(/(.)\/$/, '$1');
      if (/\.[a-z0-9]{2,5}$/i.test(target)) continue;
      assert.ok(pageIds.has(target), `${relative(ROOT, file)} links ${target}, which is not a page under /docs or /blog`);
    }
  }

  // Prefix redirects that rewrite a whole subtree, e.g. '/docs/:path*' -> prefix '/docs'.
  // A source carrying a regex guard (`:path(...)`) is deliberately narrowed, so it is
  // not treated as a blanket prefix — that guard is exactly the fix being pinned here.
  const config = read(join(ROOT, 'next.config.mjs'));
  const prefixes = [...config.matchAll(/source:\s*'(\/[^']*?)\/:path\*'/g)].map((m) => m[1]);

  for (const ref of refs) {
    const path = ref.split(/[?#]/)[0];
    assert.ok(
      existsSync(join(ROOT, 'public', path)),
      `content references ${path}, but public${path} does not exist`,
    );
    for (const prefix of prefixes) {
      assert.ok(
        path !== prefix && !path.startsWith(`${prefix}/`),
        `redirect '${prefix}/:path*' swallows the asset ${path}; exclude file paths from that rule`,
      );
    }
  }
  return refs.size;
}

try {
  main();
} catch (error) {
  console.error(`FAIL agent surface: ${error.message}`);
  process.exitCode = 1;
}
