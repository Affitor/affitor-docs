#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loader } from 'fumadocs-core/source';
import { flattenTree } from 'fumadocs-core/page-tree';
import { load, JSON_SCHEMA } from 'js-yaml';
import { parse as parseHtml } from 'parse5';
import { generateLlms } from './gen-llms.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = join(ROOT, '.next/server/app');
// Docs pages are served at affitor.com/docs (multi-zone), the blog at affitor.com/blog.
const ORIGIN = 'https://affitor.com';
const SITE = `${ORIGIN}/docs`;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
// Mirror of DOC_KINDS in source.config.ts.
const DOC_KINDS = ['concept', 'quickstart', 'guide', 'reference', 'terms', 'explainer', 'faq'];
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

/**
 * The help home (the one docs page with `articles` frontmatter): every card points at an existing
 * docs page, once, and shows that page's own title and description, with no em dash. Returns the
 * lines its .md twin ends with.
 */
function helpCards(source) {
  const homes = source.getPages().filter((page) => page.data.articles);
  assert.deepEqual(homes.map((page) => page.url), ['/docs/help'], 'exactly one page (/docs/help) has articles frontmatter');
  const seen = new Set();
  return homes[0].data.articles.map(({ page: path, category }) => {
    const where = `content/docs/help/index.mdx: ${path}`;
    const page = source.getPage(path.split('/'));
    assert.ok(page, `${where} is not a docs page`);
    assert.notEqual(page.url, '/docs/help', `${where} is the help home itself`);
    assert.ok(!seen.has(page.url), `${where} is listed twice`);
    seen.add(page.url);
    assert.equal(typeof page.data.description, 'string', `${where} has no description for its card`);
    assert.ok(![page.data.title, page.data.description].some((text) => text.includes('\u2014')), `${where}: em dash in the card title or description`);
    return `- [${page.data.title}](${ORIGIN}${page.url}.md) (${category}): ${page.data.description}`;
  });
}

/**
 * The use cases home (the one docs page with `use_cases` frontmatter): it lists every use case page
 * (a page with `use_case` frontmatter, under /docs/use-cases/) once, and only those, each with a
 * description and no em dash in its card text. Returns the lines its .md twin ends with.
 */
function useCaseCards(source) {
  const homes = source.getPages().filter((page) => page.data.use_cases);
  assert.deepEqual(homes.map((page) => page.url), ['/docs/use-cases'], 'exactly one page (/docs/use-cases) has use_cases frontmatter');
  const listed = homes[0].data.use_cases.map((path) => {
    const where = `content/docs/use-cases/index.mdx: ${path}`;
    const page = source.getPage(path.split('/'));
    assert.ok(page, `${where} is not a docs page`);
    assert.ok(page.data.use_case, `${where} has no use_case frontmatter`);
    assert.equal(typeof page.data.description, 'string', `${where} has no description for its card`);
    const text = [page.data.title, page.data.description, page.data.use_case.name, ...page.data.use_case.strip];
    assert.ok(!text.some((part) => part.includes('\u2014')), `${where}: em dash in the card text`);
    return page;
  });
  const urls = listed.map((page) => page.url);
  assert.equal(new Set(urls).size, urls.length, 'content/docs/use-cases/index.mdx lists a use case twice');
  const pages = source.getPages().filter((page) => page.data.use_case).map((page) => page.url);
  assert.deepEqual([...urls].sort(), pages.sort(), 'content/docs/use-cases/index.mdx must list every use case page (use_case frontmatter), and only those');
  for (const url of urls) assert.match(url, /^\/docs\/use-cases\/[^/]+$/, `${url}: use case pages live in content/docs/use-cases`);
  // And the reverse: a page in the folder without use_case would render as an ordinary doc page
  // inside the Use cases tab, with no card on the home.
  for (const page of source.getPages().filter((page) => page.url.startsWith('/docs/use-cases/'))) {
    assert.ok(page.data.use_case, `${page.url}: a page in content/docs/use-cases needs use_case frontmatter (name, strip) and a card in the index`);
  }
  return listed.map((page) => `- [${page.data.title}](${ORIGIN}${page.url}.md): ${page.data.description}`);
}

function inventory() {
  const docsDir = join(ROOT, 'content/docs');
  // Use the installed loader's URL rules without importing the production renderer.
  const files = walk(docsDir).filter((file) => /\.mdx?$/.test(file) || /\/meta\.json$/.test(file));
  const source = loader({
    baseUrl: '/docs',
    source: {
      files: files.map((file) => ({
        type: file.endsWith('.json') ? 'meta' : 'page',
        path: relative(docsDir, file),
        absolutePath: file,
        data: file.endsWith('.json') ? json(file) : document(file),
      })),
    },
  });
  // The tab row (docs-shell.tsx) and the Brands | Partners switch (audience-switch.tsx) find their
  // trees by Fumadocs' root folder $id, today the folder path; checkNav() pins the rendered result.
  const roots = source.pageTree.children.map((node) => (node.type === 'folder' ? node.$id : node.type));
  assert.deepEqual(roots, ['brand', 'partners', 'api-reference', 'support', 'use-cases'], 'root folder $id values changed; docs-shell.tsx TABS and audience-switch.tsx match on them');
  // Each page is listed by exactly one meta.json entry. Fumadocs keeps the first tree that lists a
  // page and silently drops any later listing, so the tree count below cannot see a page listed in
  // two meta.json files (adding a page to a second tree would pass CI and change nothing).
  const listings = new Map();
  for (const meta of files.filter((file) => file.endsWith('/meta.json'))) {
    const where = relative(ROOT, meta);
    for (const entry of json(meta).pages ?? []) {
      // Group labels (---Group---, ---) and links ([Text](url)) are not pages.
      if (/^---(?:.*---)?$/.test(entry) || /^(?:external:)?(?:\[[^\]]*\])+\([^)]*\)$/.test(entry)) continue;
      const path = join(dirname(relative(docsDir, meta)), entry);
      const page = ['.mdx', '.md'].map((ext) => `${path}${ext}`).find((file) => existsSync(join(docsDir, file)));
      if (page) listings.set(page, [...(listings.get(page) ?? []), where]);
      else assert.ok(existsSync(join(docsDir, path, 'meta.json')), `${where}: "${entry}" is not a page or a folder with its own meta.json`);
    }
  }
  for (const [page, metas] of listings) {
    assert.equal(metas.length, 1, `content/docs/${page} is listed ${metas.length} times (${metas.join(', ')}); list it once, in one meta.json`);
  }
  // Every page sits in exactly one sidebar tree (a meta.json lists it; pointer links have no $ref),
  // so none is reachable only by URL.
  const listed = flattenTree(source.pageTree.children).filter((node) => node.$ref).map((node) => node.url);
  for (const page of source.getPages()) {
    assert.equal(listed.filter((url) => url === page.url).length, 1, `${page.url}: list it once in a content/docs meta.json`);
  }
  const helpLines = helpCards(source);
  const useCaseLines = useCaseCards(source);
  // The help and use cases homes' twins end with their cards (mirror of renderBody() in src/lib/agent-md.ts).
  const cards = (data) => (data.articles ? helpLines : data.use_cases ? useCaseLines : null);
  const docs = source.getPages().map((page) => {
    const id = page.url.replace(/^\/docs\/?/, '') || 'index';
    // The content date is last_updated (set by whoever edits the page), never date/updated.
    assert.equal(page.data.date, undefined, `${id}: docs use last_updated, not date`);
    assert.equal(page.data.updated, undefined, `${id}: docs use last_updated, not updated`);
    assert.ok(DOC_KINDS.includes(page.data.kind), `${id}: kind must be one of ${DOC_KINDS.join(', ')}`);
    assert.equal(typeof page.data.last_updated, 'string', `${id}: missing last_updated`);
    assert.match(page.data.last_updated, ISO_DAY, `${id}: last_updated must be YYYY-MM-DD`);
    if (page.data.kind === 'terms') {
      // A terms page states "Last updated: <Month D, YYYY>" in its header; it must be last_updated.
      const [y, m, d] = page.data.last_updated.split('-').map(Number);
      const long = `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${d}, ${y}`;
      assert.ok(page.data.raw.includes(`Last updated: ${long}`), `${id}: terms header must say "Last updated: ${long}" (last_updated)`);
    }
    return {
      id, type: 'doc', url: `${ORIGIN}${page.url}`, kind: page.data.kind,
      updated: page.data.last_updated, sourceDate: page.data.last_updated,
      body: markdown(cards(page.data) ? { ...page.data, raw: `${page.data.raw.trimEnd()}\n\n${cards(page.data).join('\n')}` } : page.data, id),
      title: page.data.title, description: page.data.description,
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
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = (d) => { const [y, m, n] = d.split('-').map(Number); return `${MONTHS[m - 1]} ${n}, ${y}`; };
  // Mirror of preamble() in src/lib/changelog.ts: what the entry page shows above the body.
  const preamble = (e) => {
    const parts = [];
    if (e.action) parts.push(`**Action required${e.action.by ? ` by ${day(e.action.by)}` : ''}.** ${e.action.who[0].toUpperCase()}${e.action.who.slice(1)}: ${e.action.what}`);
    if (e.deprecations?.length) {
      parts.push(['| What | Replacement | Sunset |', '| --- | --- | --- |', ...e.deprecations.map((d) => `| ${d.what} | ${d.replacement} | ${day(d.sunset)} |`)].join('\n'));
    }
    return parts.length ? `${parts.join('\n\n')}\n\n` : '';
  };
  // Mirror of entryMedia() and aiContext() in src/lib/changelog.ts: the media files that exist,
  // and the "Context for AI" section that ends the twin of an entry with `context`.
  const published = (path) => (existsSync(join(ROOT, 'public', path)) ? `${ORIGIN}${path}` : undefined);
  const some = (files) => {
    const kept = Object.fromEntries(Object.entries(files).filter(([, v]) => v));
    return Object.keys(kept).length ? kept : undefined;
  };
  const entryMedia = (e, body) => {
    const banner = e.banner ? (some({ light: published(`/docs/changelog/${e.slug}/banner-light.png`), dark: published(`/docs/changelog/${e.slug}/banner-dark.png`) }) ?? null) : null;
    const images = [];
    const videos = [];
    for (const m of body.matchAll(/<Media\s+([^>]*?)\/>|!\[([^\]]*)\]\((\/[^)\s]+)\)/g)) {
      if (m[3]) {
        const src = published(m[3]);
        if (src) images.push({ src, alt: m[2] });
        continue;
      }
      const a = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
      const [, base, ext] = a.src.match(/^(.*)(\.[a-z0-9]+)$/i) ?? [];
      if (ext === '.mp4') {
        const poster = some({ light: published(`${base}-light.poster.png`), dark: published(`${base}-dark.poster.png`) });
        const steps = published(`${base}.steps.json`);
        videos.push({ ...some({ light: published(`${base}-light.mp4`), dark: published(`${base}-dark.mp4`) }), ...(poster && { poster }), ...(steps && { steps }), alt: a.alt });
      } else {
        images.push({ ...some({ light: published(`${base}-light${ext}`), dark: published(`${base}-dark${ext}`), raw: published(`${base}-raw.png`) }), alt: a.alt });
      }
    }
    return { banner, images, videos };
  };
  const mediaLine = (kind, { alt, ...files }) => {
    const urls = Object.entries(files).flatMap(([k, v]) => (typeof v === 'string' ? [`${k} ${v}`] : Object.entries(v).map(([t, u]) => `${k} ${t} ${u}`)));
    return `- ${kind}${alt ? ` (${alt})` : ''}: ${urls.join(', ')}`;
  };
  const aiContext = (e, media) => {
    const c = e.context;
    if (!c) return '';
    const list = (items) => items.map((s) => `- ${s}`).join('\n');
    const lines = [...(media.banner ? [mediaLine('Banner', media.banner)] : []), ...media.images.map((i) => mediaLine('Image', i)), ...media.videos.map((v) => mediaLine('Video', v))];
    const parts = [
      `Shared context for every entry (brand, facts, what never to say): ${ORIGIN}/changelog/context.md`,
      ...(c.facts?.length ? [`### Facts\n\n${list(c.facts)}`] : []),
      ...(c.ui?.length ? [`### UI labels\n\n${list(c.ui.map((label) => `\`${label}\``))}`] : []),
      ...(c.avoid?.length ? [`### Avoid\n\n${list(c.avoid)}`] : []),
      ...(c.cta ? [`### CTA\n\n[${c.cta.label}](${c.cta.url})`] : []),
      `### Media\n\n${lines.length ? lines.join('\n') : 'None.'}`,
    ];
    return `\n\n## Context for AI\n\n${parts.join('\n\n')}`;
  };
  // The collection reads *.mdx only: anything else here would silently not be an entry.
  for (const name of readdirSync(dir)) {
    assert.ok(name.endsWith('.mdx') || name === '_context.md', `content/changelog/${name}: entries are .mdx files; only _context.md sits beside them`);
  }
  const entries = walk(dir).filter((file) => file.endsWith('.mdx')).map((file) => {
    const data = document(file);
    const slug = relative(dir, file).replace(/\.mdx$/, '');
    const where = `content/changelog/${slug}.mdx`;
    assert.notEqual(slug, 'context', `${where}: the slug context is /changelog/context.md (the AI context pack)`);
    assert.equal(typeof data.date, 'string', `${where}: missing date`);
    assert.match(data.date, ISO_DAY, `${where}: date must be YYYY-MM-DD`);
    assert.ok(TYPES.includes(data.type), `${where}: unknown type ${data.type}`);
    assert.ok(Array.isArray(data.audience) && data.audience.length, `${where}: audience is required`);
    assert.equal(typeof data.description, 'string', `${where}: description is required`);
    // Early, readable failure; the entry page also throws on any Callout the parser emits.
    assert.equal(data.raw.includes(':::'), false, `${where}: admonitions (:::) are not allowed in the changelog`);
    assert.doesNotMatch(data.raw, /<Callout\b/, `${where}: <Callout> is not allowed in the changelog`);
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
    const body = data.raw.replace(FRONTMATTER, '');
    const e = { ...data, slug, body, surfaces: data.surfaces ?? [], url: `${ORIGIN}/changelog/${slug}` };
    const href = body.match(/^Learn more:?\s*\[[^\]]*\]\(([^)\s]+)\)/im)?.[1];
    e.learnMore = href ? (href.startsWith('/') ? `${ORIGIN}${href}` : href) : (data.context?.cta?.url ?? null);
    e.media = entryMedia(e, body);
    return e;
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
      updated: e.date, sourceDate: e.date, entry: e,
      body: markdown({ ...e, raw: `${preamble(e)}${e.body.trimEnd()}${aiContext(e, e.media)}` }, e.slug),
    })),
  ];
}

/**
 * /changelog/context.md is content/changelog/_context.md as is, and /changelog.json carries every
 * entry newest first with its source fields, the media files that exist, and the brand kit and
 * "Never say" rules of the context pack.
 */
function checkChangelogData(entries, artifact) {
  const pack = read(join(ROOT, 'content/changelog/_context.md'));
  assert.equal(artifact('/changelog/context.md', 'text/markdown'), pack, '/changelog/context.md differs from content/changelog/_context.md');
  const feed = JSON.parse(artifact('/changelog.json', 'application/json'));
  assert.match(feed.generated_at, /^\d{4}-\d{2}-\d{2}T/, '/changelog.json: generated_at');
  assert.equal(feed.global.context_url, `${ORIGIN}/changelog/context.md`, '/changelog.json: global.context_url');
  const never = (pack.split(/^## Never say\s*$/m)[1] ?? '').split(/^## /m)[0].match(/^- .+$/gm)?.map((l) => l.slice(2));
  assert.ok(never?.length, '_context.md: no Never say rules');
  assert.deepEqual(feed.global.rules, never, '/changelog.json: global.rules must be the Never say lines');
  for (const [key, value] of [...Object.entries(feed.brand.logo), ...Object.entries(feed.brand.colors)]) {
    assert.ok(typeof value === 'string' && pack.includes(value), `/changelog.json: brand ${key} ${value} is not in _context.md`);
  }
  assert.deepEqual(Object.keys(feed.brand.logo).sort(), ['mark_png', 'mark_svg', 'wordmark_svg'], '/changelog.json: brand.logo keys');
  assert.deepEqual(Object.keys(feed.brand.colors).sort(), ['brand', 'ink', 'lines', 'muted', 'soft_bg', 'text'], '/changelog.json: brand.colors keys');
  assert.deepEqual(feed.entries.map((e) => e.slug), entries.map((e) => e.slug), '/changelog.json: entries must be every changelog entry, newest first');
  feed.entries.forEach((got, i) => {
    const e = entries[i];
    const { points, ...rest } = got;
    assert.deepEqual(rest, {
      slug: e.slug, url: e.url, date: e.date, type: e.type, audience: e.audience, surfaces: e.surfaces,
      title: e.title, description: e.description, learn_more: e.learnMore, media: e.media, context: e.context ?? null,
    }, `/changelog.json ${e.slug}`);
    assert.ok(Array.isArray(points) && points.every((p) => typeof p === 'string' && p.trim()), `/changelog.json ${e.slug}: points must be non-empty strings`);
    if (e.points) assert.deepEqual(points, e.points, `/changelog.json ${e.slug}: points must be the points frontmatter`);
    if (e.type === 'digest') assert.ok(points.length, `/changelog.json ${e.slug}: a digest's points are its bullets`);
  });
  return feed.entries.length;
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

/**
 * The docs tab row and the Brands | Partners switch as prerendered. Both find their tree by Fumadocs'
 * root folder $id, so a change there would silently light Guides on every page and drop the switch.
 */
function checkNav() {
  const cases = [
    ['/docs/brand/quickstart', 'Guides', 'Brands'],
    ['/docs/partners/dashboard', 'Guides', 'Partners'],
    ['/docs/api-reference/overview', 'API Reference', null],
    ['/docs/faq', 'Help Center', null],
    ['/docs/help', 'Help Center', null],
    ['/docs/use-cases', 'Use cases', null],
    ['/docs/use-cases/sell-on-stripe', 'Use cases', null],
    ['/docs/use-cases/any-payment-provider', 'Use cases', null],
    ['/docs/use-cases/subscriptions', 'Use cases', null],
    ['/docs/use-cases/partner-payouts', 'Use cases', null],
    ['/docs/use-cases/ai-agent-setup', 'Use cases', null],
  ];
  const html = (route) => read(join(APP, `${route.slice(1)}.html`));
  // The help and use cases pages drop the left nav with one rule in globals.css that hides Fumadocs'
  // sidebar column by its data hook. Pin both halves: the rule ships in the built CSS, and on each
  // such page the hook is still a child of #nd-docs-layout (a Fumadocs upgrade that renames or moves
  // it would bring the left nav back silently).
  const HIDE_NAV = '#nd-docs-layout:has(:is(.aff-help,.aff-usecases,.aff-usecase))>[data-sidebar-placeholder]{display:none!important}';
  const css = walk(join(ROOT, '.next/static')).filter((file) => file.endsWith('.css')).map(read).join('\n');
  assert.ok(css.includes(HIDE_NAV), `built CSS lacks ${HIDE_NAV} (globals.css, help and use cases left nav)`);
  const navHidden = (route) => {
    const find = (node) => (node.attrs?.some((a) => a.name === 'id' && a.value === 'nd-docs-layout') ? node : node.childNodes?.map(find).find(Boolean));
    const layout = find(parseHtml(html(route)));
    assert.ok(layout, `${route}: no #nd-docs-layout`);
    assert.ok(layout.childNodes.some((node) => node.attrs?.some((a) => a.name === 'data-sidebar-placeholder')), `${route}: #nd-docs-layout has no [data-sidebar-placeholder] child, so globals.css no longer hides the left nav`);
  };
  const navs = (route, label) => [...html(route).matchAll(new RegExp(`<nav\\b[^>]*\\baria-label="${label}"[^>]*>([\\s\\S]*?)</nav>`, 'g'))].map((m) => m[1]);
  const current = (nav) => [...nav.matchAll(/<a\b[^>]*\baria-current="true"[^>]*>([^<]*)</g)].map((m) => decodeEntities(m[1]));
  for (const [route, tab, audience] of cases) {
    const tabs = navs(route, 'Docs sections');
    assert.equal(tabs.length, 1, `${route}: expected one docs tab row`);
    assert.deepEqual(current(tabs[0]), [tab], `${route}: active tab`);
    assert.deepEqual(navs(route, 'Guides for').map(current), audience ? [[audience]] : [], `${route}: Brands | Partners switch`);
  }
  // Previous / next stay in the page's own tree: the MCP server pointer links are never neighbours.
  const pageNav = [
    ['/docs/partners/account-settings', ['/docs/partners/referral-rewards', '/docs/partners/faq']],
    ['/docs/partners/faq', ['/docs/partners/account-settings']],
    ['/docs/api-reference/sdks', ['/docs/api-reference/performance']],
  ];
  for (const [route, hrefs] of pageNav) {
    const links = navs(route, 'Previous and next pages').flatMap((nav) => [...nav.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]));
    assert.deepEqual(links, hrefs, `${route}: previous / next`);
  }
  // The help home prerenders every card, in index order, and drops the left nav (.aff-help).
  const help = html('/docs/help');
  const cards = [...help.matchAll(/<a\b[^>]*\bclass="aff-help-card"[^>]*>/g)].map((m) => m[0].match(/\bhref="([^"]*)"/)[1]);
  const index = document(join(ROOT, 'content/docs/help/index.mdx')).articles.map((entry) => `/docs/${entry.page}`);
  assert.deepEqual(cards, index, '/docs/help: cards');
  assert.match(help, /<article\b[^>]*\bclass="[^"]*\baff-help\b/, '/docs/help: article must carry .aff-help (no left nav)');
  navHidden('/docs/help');
  // The use cases home prerenders one card per listed use case, in index order, with no left nav;
  // each use case page drops the left nav and the rail, and its breadcrumb leads back home.
  const home = html('/docs/use-cases');
  const useCases = [...home.matchAll(/<a\b[^>]*\bclass="aff-uc-card"[^>]*>/g)].map((m) => m[0].match(/\bhref="([^"]*)"/)[1]);
  const listed = document(join(ROOT, 'content/docs/use-cases/index.mdx')).use_cases.map((path) => `/docs/${path}`);
  assert.deepEqual(useCases, listed, '/docs/use-cases: cards');
  assert.match(home, /<article\b[^>]*\bclass="[^"]*\baff-usecases\b/, '/docs/use-cases: article must carry .aff-usecases (no left nav)');
  navHidden('/docs/use-cases');
  for (const route of listed) {
    const page = html(route);
    assert.match(page, /<article\b[^>]*\bclass="[^"]*\baff-usecase\b/, `${route}: article must carry .aff-usecase (no left nav)`);
    navHidden(route);
    assert.doesNotMatch(page, /\bid="nd-toc"/, `${route}: no rail`);
    const crumbs = navs(route, 'Breadcrumb');
    assert.equal(crumbs.length, 1, `${route}: expected one breadcrumb`);
    assert.match(crumbs[0], /<a\b[^>]*\bhref="\/docs\/use-cases"[^>]*>Use cases<\/a>/, `${route}: breadcrumb links Use cases`);
  }
  return cases.length + pageNav.length;
}

/**
 * Public claims the docs once stated and the code no longer does (scripts/retired-claims.json).
 * Each pattern is a case-insensitive regex matched line by line over the docs pages, blog posts,
 * skill.md and openapi.yaml; a hit fails unless its file is in the entry's `allow`. Changelog
 * entries are history and are not read. A PR that retires a claim adds its old wording here.
 */
function checkRetiredClaims() {
  const claims = json(join(ROOT, 'scripts/retired-claims.json'));
  const files = [
    ...walk(join(ROOT, 'content/docs')).filter((file) => /\.mdx?$/.test(file)),
    ...walk(join(ROOT, 'content/blog')).filter((file) => /\.mdx?$/.test(file)),
    join(ROOT, 'public/docs/skill.md'),
    join(ROOT, 'public/docs/openapi.yaml'),
  ].map((file) => ({ path: relative(ROOT, file), lines: read(file).split('\n') }));
  const hits = [];
  for (const { pattern, why, since, allow = [] } of claims) {
    assert.ok(typeof why === 'string' && why && ISO_DAY.test(since ?? ''), `scripts/retired-claims.json ${pattern}: needs why and since (YYYY-MM-DD)`);
    const re = new RegExp(pattern, 'i');
    for (const { path, lines } of files) {
      if (allow.includes(path)) continue;
      lines.forEach((line, i) => {
        const match = line.match(re);
        if (match) hits.push(`  ${path}:${i + 1}: "${match[0]}": ${why}`);
      });
    }
  }
  assert.ok(!hits.length, `retired claims still in the docs (scripts/retired-claims.json). Reword each line, or add its path to that entry's allow if the sentence is true in context:\n${hits.join('\n')}`);
  return { claims: claims.length, files: files.length };
}

function main() {
  const retired = checkRetiredClaims();
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

    assert.equal(typeof page.sourceDate, 'string', `${page.id}: missing source frontmatter date`);
    assert.equal(metadata.updated, page.sourceDate, `${page.id}: twin updated must equal source frontmatter`);
    assert.equal(htmlLastmod, page.sourceDate, `${page.id}: sitemap lastmod must equal source frontmatter`);
    assert.equal(mdLastmod, page.sourceDate, `${page.id}: .md sitemap lastmod must equal source frontmatter`);
    assert.equal(metadata.updated, htmlLastmod, `${page.id}: twin updated must equal sitemap lastmod`);
    assert.deepEqual(
      metadata,
      { id: page.id, type: page.type, url: page.url, ...(page.kind ? { kind: page.kind } : {}), updated: page.sourceDate },
      `${page.id}: twin metadata`,
    );
    assert.match(metadata.updated, ISO_DAY, `${page.id}: updated must be YYYY-MM-DD`);
    assert.doesNotMatch(metadata.updated, BUILD_TIME, `${page.id}: updated must not be build/mtime ISO`);

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
  const feedEntries = checkChangelogData(pages.filter((page) => page.entry).map((page) => page.entry), artifact);
  const navPages = checkNav();

  console.log(`PASS content assets: ${assets} file references reachable (present in public/ and not swallowed by a redirect).`);
  console.log(`PASS docs nav: active tab, Brands | Partners switch and previous / next right on ${navPages} sample pages; help and use cases home cards match their index; help and use cases pages hide the left nav (built CSS rule + sidebar hook); use case pages have no rail and a breadcrumb home; root folder ids pinned; every page listed by one meta.json entry.`);
  console.log(`PASS retired claims: ${retired.claims} patterns, 0 hits in ${retired.files} files (docs pages, blog posts, skill.md, openapi.yaml).`);
  console.log(`PASS changelog data: /changelog.json has ${feedEntries} entries newest first matching the source; /changelog/context.md is _context.md.`);
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
