#!/usr/bin/env node
/** Regenerate the compact agent entry point from documentation section indexes. */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SITE = 'https://docs.affitor.com';
// Blog is proxied at affitor.com/blog (multi-zone) — that's its canonical home.
const BLOG_SITE = 'https://affitor.com/blog';

// These section indexes use flat, single-line frontmatter values.
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
    return /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}

function docSlug(file) {
  return relative(join(ROOT, 'content/docs'), file)
    .replace(/\.mdx?$/, '')
    .replace(/(^|\/)index$/, '')
    .replace(/\/$/, '');
}

export function generateLlms() {
  const files = walk(join(ROOT, 'content/docs')).sort();
  const hasApiIndex = files.some((file) => /\/api-reference\/index\.mdx?$/.test(file));
  const sections = files.filter((file) =>
    /\/index\.mdx?$/.test(file) || (!hasApiIndex && docSlug(file) === 'api-reference/overview'),
  ).map((file) => {
    const metadata = frontmatter(file);
    const slug = docSlug(file) || 'index';
    return `- [${metadata.title}](${SITE}/${slug}.md)${metadata.description ? `: ${metadata.description}` : ''}`;
  });

  return `# Affitor Documentation

> Documentation for Affitor affiliate programs, tracking, commissions, and payouts.

## Start here

- [Agent integration runbook](${SITE}/skill.md): Integrate tracking and verify it end-to-end.
- [Complete documentation](${SITE}/llms-full.txt): Every documentation page, blog post, and changelog entry, with page identifiers and source metadata.
- [Sitemap](${SITE}/sitemap.xml): HTML pages and their Markdown twins.

## Documentation sections

${sections.join('\n')}

## Blog and changelog

- [Blog](${BLOG_SITE}): The canonical blog home. All posts are included in the complete documentation above.
- [Changelog](${SITE}/changelog.md): All changelog entries in Markdown.
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = generateLlms();
  if (process.argv.includes('--stdout')) {
    process.stdout.write(output);
  } else {
    writeFileSync(join(ROOT, 'public/llms.txt'), output);
    console.log(`public/llms.txt regenerated: ${Buffer.byteLength(output)} bytes.`);
  }
}
