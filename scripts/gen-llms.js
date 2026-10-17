#!/usr/bin/env node
/** Regenerate the compact agent entry point: every docs page, grouped as the sidebar groups them. */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loader } from 'fumadocs-core/source';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
// Docs and blog are proxied at affitor.com/docs and affitor.com/blog (multi-zone).
const SITE = 'https://affitor.com/docs';
const BLOG_SITE = 'https://affitor.com/blog';

// Docs titles and descriptions are flat, single-line frontmatter values.
function frontmatter(file) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[kv[1]] = v;
  }
  return out;
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return /\.mdx?$/.test(entry.name) || entry.name === 'meta.json' ? [path] : [];
  });
}

/** One `## Tree: Group` section per sidebar group, in sidebar order (the meta.json files under content/docs). */
function sections() {
  const dir = join(ROOT, 'content/docs');
  const files = walk(dir).sort().map((file) => ({
    type: file.endsWith('.json') ? 'meta' : 'page',
    path: relative(dir, file),
    absolutePath: file,
    data: file.endsWith('.json') ? JSON.parse(readFileSync(file, 'utf8')) : frontmatter(file),
  }));
  const out = [];
  for (const tree of loader({ baseUrl: '/docs', source: { files } }).pageTree.children) {
    if (tree.type !== 'folder') continue;
    let lines = [`## ${tree.name}`, ''];
    for (const node of tree.children) {
      if (node.type === 'separator') {
        if (lines.length > 2) out.push(lines.join('\n'));
        lines = [`## ${tree.name}${node.name ? `: ${node.name}` : ''}`, ''];
      } else if (node.type === 'page' && node.$ref) {
        // Pointer links ($ref unset) lead to a page listed in another tree; each page appears once.
        lines.push(`- [${node.name}](${SITE}/${node.url.replace(/^\/docs\/?/, '') || 'index'}.md)`);
      }
    }
    if (lines.length > 2) out.push(lines.join('\n'));
  }
  return out.join('\n\n');
}

export function generateLlms() {
  return `# Affitor Documentation

> Documentation for Affitor affiliate programs, tracking, commissions, and payouts.

## Start here

- [Agent integration runbook](${SITE}/skill.md): Integrate tracking and verify it end-to-end.
- [Complete documentation](${SITE}/llms-full.txt): Every documentation page, blog post, and changelog entry, with page identifiers and source metadata.
- [Sitemap](https://affitor.com/sitemap.xml): Every public page on affitor.com, including the docs and the blog.

${sections()}

## Blog and changelog

- [Blog](${BLOG_SITE}): The canonical blog home. All posts are included in the complete documentation above.
- [Changelog](https://affitor.com/changelog.md): Every changelog entry, newest first, with open deprecations on top. Each entry also has its own twin at its URL + .md.
- [Changelog JSON](https://affitor.com/changelog.json): Every entry as data (points, learn-more link, media files, AI context), newest first, with the brand kit.
- [Changelog context for AI](https://affitor.com/changelog/context.md): Brand, facts that hold everywhere and what never to say, for AI-made posts and videos.
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = generateLlms();
  if (process.argv.includes('--stdout')) {
    process.stdout.write(output);
  } else {
    writeFileSync(join(ROOT, 'public/docs/llms.txt'), output);
    console.log(`public/docs/llms.txt regenerated: ${Buffer.byteLength(output)} bytes.`);
  }
}
