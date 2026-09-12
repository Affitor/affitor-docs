#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loader } from 'fumadocs-core/source';
import { load, JSON_SCHEMA } from 'js-yaml';
import { generateLlms } from './gen-llms.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, '.next/server/app');
const SITE = 'https://docs.affitor.com';
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
const read = (path) => readFileSync(path, 'utf8');
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
    modified: statSync(file).mtime.toISOString(),
  };
}

function markdown(data, fallbackTitle) {
  const title = data.title ?? fallbackTitle;
  const head = data.description ? `# ${title}\n\n> ${data.description}` : `# ${title}`;
  return `${head}\n\n${data.raw.replace(FRONTMATTER, '').trim()}\n`;
}

function inventory() {
  const docsDir = join(ROOT, 'content/docs');
  // Use the installed loader's URL rules without importing the production renderer.
  const files = walk(docsDir).filter((file) => /\.mdx?$/.test(file) || /\/meta\.json$/.test(file));
  const docs = loader({
    baseUrl: '/',
    source: {
      files: files.map((file) => ({
        type: file.endsWith('.json') ? 'meta' : 'page',
        path: relative(docsDir, file),
        absolutePath: file,
        data: file.endsWith('.json') ? json(file) : document(file),
      })),
    },
  }).getPages().map((page) => {
    const id = page.url.slice(1) || 'index';
    return {
      id, type: 'doc', url: `${SITE}${page.url}`, updated: page.data.modified,
      body: markdown(page.data, id), title: page.data.title, description: page.data.description,
    };
  });
  const blogDir = join(ROOT, 'content/blog');
  const posts = walk(blogDir).filter((file) => /\.mdx?$/.test(file)).map((file) => {
    const data = document(file);
    const id = `blog/${relative(blogDir, file).replace(/\.mdx$/, '')}`;
    return { id, type: 'blog', url: `https://affitor.com/${id}`, updated: data.modified, body: markdown(data, id) };
  });
  const changes = walk(join(ROOT, 'content/changelog')).filter((file) => /\.mdx?$/.test(file))
    .map(document).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  assert.ok(changes.length, 'Changelog source is empty');
  const sections = changes.map((entry) =>
    `## ${entry.title} (${entry.date})\n\n> ${entry.benefit}\n\n${entry.raw.replace(FRONTMATTER, '').trim()}`,
  );
  return [...docs, ...posts, {
    id: 'changelog', type: 'changelog', url: `${SITE}/changelog`,
    updated: changes.map((entry) => entry.modified).sort().at(-1),
    body: `# Affitor Changelog\n\n${sections.join('\n\n---\n\n')}\n`,
  }];
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
    headline: page.title, description: page.description, dateModified: page.updated,
  })) {
    assert.equal(typeof schema[key], 'string', `${route}: missing TechArticle ${key}`);
    assert.equal(schema[key], expected, `${route}: TechArticle ${key}`);
  }
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
    assert.equal(lastmod.length, 1, 'Sitemap entry must have one lastmod');
    return [decodeEntities(loc[0][1]), lastmod[0][1]];
  });
  const expectedUrls = pages.flatMap((page) => [page.url, `${SITE}/${page.id}.md`]);
  expectedUrls.push(`${SITE}/llms.txt`, `${SITE}/llms-full.txt`);
  assert.deepEqual(entries.map(([url]) => url).sort(), expectedUrls.sort(), 'Sitemap URL inventory differs from source');
  const dates = new Map(entries);
  // Build artifacts share one `updated` clock. Do not re-stat source mtimes here —
  // CI can see 1ms drift between `next build` and this check (changelog max mtime).
  // Brief §3.8: twin `updated` must equal the sitemap date for that page.
  const latest = [...dates.values()].sort().at(-1);
  for (const name of ['llms.txt', 'llms-full.txt']) {
    assert.equal(dates.get(`${SITE}/${name}`), latest, `${name}: sitemap date`);
  }

  let corpus = artifact('/llms-full.txt', 'text/plain');
  for (const page of pages) {
    const twin = artifact(`/llms.md/${page.id}`, 'text/markdown');
    const header = twin.match(FRONTMATTER);
    assert.ok(header, `${page.id}: missing twin frontmatter`);
    const metadata = load(header[1], { schema: JSON_SCHEMA });
    const updated = dates.get(page.url);
    assert.equal(typeof updated, 'string', `${page.id}: missing sitemap date`);
    assert.deepEqual(metadata, { id: page.id, type: page.type, url: page.url, updated }, `${page.id}: twin metadata`);
    assert.equal(twin.slice(header[0].length), page.body, `${page.id}: twin differs from original source body`);
    assert.equal(dates.get(`${SITE}/${page.id}.md`), updated, `${page.id}: sitemap date for .md twin`);
    const position = corpus.indexOf(twin);
    assert.ok(position >= 0, `${page.id}: complete twin missing from llms-full.txt`);
    assert.equal(corpus.indexOf(twin, position + twin.length), -1, `${page.id}: duplicate twin in llms-full.txt`);
    corpus = corpus.slice(0, position) + corpus.slice(position + twin.length);
    if (page.type === 'doc') {
      const path = new URL(page.url).pathname;
      const built = { ...page, updated };
      checkHtml(built, path);
      checkHtml(built, path === '/' ? '/docs' : `/docs${path}`);
    }
    console.log(`PASS ${page.id}: twin, source body, sitemap dates, full corpus${page.type === 'doc' ? ', canonical and legacy HTML' : ''}`);
  }
  assert.match(corpus, /^\n*$/, 'llms-full.txt contains unexpected content or extra pages');

  const llms = read(join(ROOT, 'public/llms.txt'));
  assert.equal(llms, generateLlms(), 'public/llms.txt is stale; run npm run gen:llms');
  assert.ok(Buffer.byteLength(llms) < 10000, 'public/llms.txt must be under 10000 bytes');
  for (const match of llms.matchAll(/\]\(https:\/\/docs\.affitor\.com\/([^\s)]+)\.md\)/g)) {
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
    `Sitemap: ${SITE}/sitemap.xml`, `Llms-Txt: ${SITE}/llms.txt`, `Llms-Full-Txt: ${SITE}/llms-full.txt`,
  ]) assert.ok(robots.split(/\r?\n/).includes(line), `robots.txt missing ${line}`);
  console.log(`PASS agent surface: ${pages.length} pages, ${entries.length} sitemap URLs, ${Buffer.byteLength(llms)} llms.txt bytes; source parity, metadata, HTML, full corpus, freshness, and robots verified.`);
}

try {
  main();
} catch (error) {
  console.error(`FAIL agent surface: ${error.message}`);
  process.exitCode = 1;
}
