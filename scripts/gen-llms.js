#!/usr/bin/env node
/**
 * gen-llms.js — regenerate public/llms.txt from content frontmatter.
 *
 * Walks content/docs/**, content/blog/**, content/changelog/** and emits one
 * benefit-first line per page: `- [Title](url): description`. Run after adding
 * or renaming content so llms.txt never goes stale:
 *
 *   npm run gen:llms
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SITE = 'https://docs.affitor.com';

// ---------------------------------------------------------------------------
// Frontmatter (flat `key: value` lines only — all our content uses this shape)
// ---------------------------------------------------------------------------
function frontmatter(file) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---/);
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
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.mdx?$/.test(e.name) ? [p] : [];
  });
}

// content/docs/brand/cli/quickstart.mdx -> brand/cli/quickstart ; index.mdx -> dir
function docSlug(file) {
  return relative(join(ROOT, 'content/docs'), file)
    .replace(/\.mdx?$/, '')
    .replace(/(^|\/)index$/, '')
    .replace(/\/$/, '');
}

// ---------------------------------------------------------------------------
// Curation: section routing, reading-order pins, sharpened descriptions.
// Anything new is picked up automatically and sorted after pinned pages.
// ---------------------------------------------------------------------------
const SECTIONS = [
  { name: 'Getting Started', match: (s) => s === '' || /^(getting-started|faq|support)(\/|$)/.test(s) },
  { name: 'For Brands', match: (s) => /^brand(\/|$)/.test(s) },
  { name: 'For Partners', match: (s) => /^partners(\/|$)/.test(s) },
  { name: 'API & Agents', match: (s) => /^api-reference(\/|$)/.test(s) },
];

// Lower = earlier. Unlisted slugs get 500 and sort alphabetically after these.
const PIN = {
  '': 0,
  'getting-started': 1,
  'getting-started/how-it-works': 2,
  'getting-started/pricing-performance-model': 3,
  'faq': 4,

  'brand/quickstart': 10,
  'brand/quickstart/create-account': 11,
  'brand/quickstart/setup-program': 12,
  'brand/quickstart/define-commission': 13,
  'brand/quickstart/inviting-partners': 14,
  'brand/quickstart/partner-approval-quality-control': 15,
  'brand/quickstart/view-performance': 16,
  'brand/quickstart/commission-approval-cash-flow': 17,
  'brand/quickstart/payouts': 18,
  'brand/cli/quickstart': 30,
  'brand/cli/commands': 31,
  'brand/tracking/quickstart-integration': 40,
  'brand/tracking/tracking-overview': 41,
  'brand/tracking/click-tracking': 42,
  'brand/tracking/lead-tracking-signup': 43,
  'brand/tracking/payment-tracking-stripe': 44,
  'brand/tracking/payment-flow': 45,
  'brand/tracking/testing-integration': 46,

  'partners': 10,
  'partners/quickstart/create-account': 11,
  'partners/quickstart/find-and-join-programs': 12,
  'partners/quickstart/get-your-referral-link': 13,
  'partners/dashboard': 14,
  'partners/payouts': 15,

  'api-reference/overview': 10,
  'api-reference/sdks': 11,
  'api-reference/mcp': 12,
  'api-reference/agent-integration': 13,
  'api-reference/attribution': 14,
  'api-reference/track-click': 20,
  'api-reference/track-lead': 21,
  'api-reference/track-sale': 22,
  'api-reference/track-refund': 23,
};

// Benefit-first rewrites for pages whose frontmatter description is still vague.
// Prefer sharpening the frontmatter itself; use this only when that isn't possible.
const OVERRIDES = {
  'brand/tracking/tracking-overview': 'How Affitor links clicks, signups, and sales together so every commission is backed by verifiable attribution.',
};

function line(title, url, desc) {
  return `- [${title}](${url}): ${desc}`;
}

function sortDocs(a, b) {
  const wa = PIN[a.slug] ?? 500;
  const wb = PIN[b.slug] ?? 500;
  return wa - wb || a.slug.localeCompare(b.slug);
}

// ---------------------------------------------------------------------------
// Collect
// ---------------------------------------------------------------------------
const docs = walk(join(ROOT, 'content/docs')).map((f) => {
  const fm = frontmatter(f);
  const slug = docSlug(f);
  return {
    slug,
    title: fm.title,
    desc: OVERRIDES[slug] ?? fm.description ?? '',
    url: slug === '' ? `${SITE}/` : `${SITE}/${slug}`,
  };
});

const blog = walk(join(ROOT, 'content/blog'))
  .map((f) => {
    const fm = frontmatter(f);
    const slug = relative(join(ROOT, 'content/blog'), f).replace(/\.mdx?$/, '');
    return { title: fm.title, desc: fm.description ?? '', date: fm.date ?? '', url: `${SITE}/blog/${slug}` };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

// Changelog is a single page (no per-entry routes) — list entries, link the page.
const changelog = walk(join(ROOT, 'content/changelog'))
  .map((f) => {
    const fm = frontmatter(f);
    return { title: fm.title, desc: fm.benefit ?? fm.description ?? '', date: fm.date ?? '' };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------
const out = [];

out.push(`# Affitor Documentation

> Affitor is affiliate program software for SaaS companies — run a partner program with tracked
> click → signup → sale attribution, commission approval, and payout operations in one workflow.
> Two things to know up front: pricing is **$0 until your program earns its first $10,000 through
> affiliates, then 3.5%** of affiliate-driven revenue (no subscription, no setup fee) — and
> **AI coding agents can integrate and verify the tracking end-to-end**.
> Full docs: ${SITE}

> **AI coding agents — integration entry point:** follow ${SITE}/skill.md.
> It is a self-contained runbook for wiring click + lead + sale tracking and
> verifying the integration end-to-end (synthetic chain + readiness polling).`);

for (const section of SECTIONS) {
  const pages = docs.filter((d) => section.match(d.slug)).sort(sortDocs);
  out.push(`\n## ${section.name}\n`);
  out.push(pages.map((p) => line(p.title, p.url, p.desc)).join('\n'));
}

out.push('\n## Blog\n');
out.push(blog.map((p) => line(p.title, p.url, p.desc)).join('\n'));

out.push('\n## Changelog\n');
out.push(`All entries live on one page: ${SITE}/changelog\n`);
out.push(changelog.map((p) => line(`${p.title} (${p.date})`, `${SITE}/changelog`, p.desc)).join('\n'));

writeFileSync(join(ROOT, 'public/llms.txt'), out.join('\n') + '\n');
console.log(`public/llms.txt regenerated: ${docs.length} docs, ${blog.length} blog posts, ${changelog.length} changelog entries.`);
