// Tracking contract, docs side. The values are the docs copy in public/docs/openapi.yaml (info.x-affitor-contract,
// one JSON line, compared nightly with the product snapshot). scripts/tracking-contract-docs.json lists, per file, how
// many window statements it makes and which value each states; any other window statement fails as unlisted.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { JSON_SCHEMA, load } from 'js-yaml';

const NUMBER = '(?<![\\d.$,])\\b(?!(?:200|201|204|301|302|307|308|400|401|403|404|409|410|422|429|500|503)\\b)(\\d{2,3})\\b(?![\\d.%]|,\\d)';
const STATEMENT = new RegExp(`(?:window|cookie)[^\\n]{0,80}?${NUMBER}|${NUMBER.replace('(\\d{2,3})', '(\\d{2,3})')}(?:-day| days?)\\b[^\\n]{0,60}?(?:window|cookie)`, 'i');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (/\.(mdx?|ya?ml)$/.test(name)) yield path;
  }
}

function valueAt(values, path) {
  const value = path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), values);
  assert.ok(value !== undefined, `tracking contract: rule "${path}" has no value in x-affitor-contract`);
  return value;
}

export function checkTrackingContract(ROOT) {
  const spec = load(readFileSync(join(ROOT, 'public/docs/openapi.yaml'), 'utf8'), { schema: JSON_SCHEMA });
  const values = spec?.info?.['x-affitor-contract'];
  assert.ok(values && typeof values === 'object', 'public/docs/openapi.yaml: info.x-affitor-contract is missing');
  const inventory = JSON.parse(readFileSync(join(ROOT, 'scripts/tracking-contract-docs.json'), 'utf8'));
  const competitor = new RegExp(inventory.competitor_line);
  const files = [...walk(join(ROOT, 'content/docs')), ...walk(join(ROOT, 'content/blog')), join(ROOT, 'public/docs/skill.md'), join(ROOT, 'public/docs/openapi.yaml')];
  const problems = [];
  let statements = 0;

  for (const path of files) {
    const file = relative(ROOT, path);
    const lines = readFileSync(path, 'utf8').split('\n');
    const elsewhere = inventory.elsewhere.filter((e) => e.file === file);
    const entries = inventory.files.filter((e) => e.file === file);
    const counts = entries.map(() => 0);
    lines.forEach((line, i) => {
      const m = line.match(STATEMENT);
      if (!m) return;
      if (competitor.test(line) && !/Affitor/.test(line)) return; // a competitor's window, in their words
      if (elsewhere.some((e) => new RegExp(e.match).test(line))) return;
      statements += 1;
      const found = Number(m[1] ?? m[2]);
      const k = entries.findIndex((e) => !e.lines || new RegExp(e.lines).test(line));
      if (k < 0) return problems.push(`${file}:${i + 1}: unlisted window statement (${found}): ${line.trim().slice(0, 100)}`);
      counts[k] += 1;
      const expected = valueAt(values, entries[k].rule);
      if (found !== expected) problems.push(`${file}:${i + 1}: says ${found}, rule ${entries[k].rule} is ${expected}`);
    });
    entries.forEach((e, k) => {
      if (counts[k] !== e.count) problems.push(`${file}: ${counts[k]} statements of ${e.rule}${e.lines ? ` (${e.lines})` : ''}, inventory says ${e.count}`);
    });
    for (const e of elsewhere) {
      const n = lines.filter((line) => new RegExp(e.match).test(line)).length;
      if (n !== (e.count ?? 1)) problems.push(`${file}: ${n} lines match the explained statement /${e.match}/, inventory says ${e.count ?? 1}`);
    }
  }
  for (const e of [...inventory.files, ...inventory.elsewhere]) {
    if (!files.some((path) => relative(ROOT, path) === e.file)) problems.push(`${e.file}: listed in scripts/tracking-contract-docs.json but missing`);
  }

  // Words that must be on a page, and wording that must not appear while hosted MCP write access is off.
  for (const r of inventory.required) {
    const text = readFileSync(join(ROOT, r.file), 'utf8');
    if (!new RegExp(r.match).test(text)) problems.push(`${r.file}: must name ${r.match}`);
  }
  if (values.mcp_write_live === false) {
    const pages = files.filter((path) => !path.includes('/content/blog/'));
    for (const path of pages) {
      readFileSync(path, 'utf8').split('\n').forEach((line, i) => {
        for (const phrase of inventory.while_mcp_write_off) {
          if (new RegExp(phrase, 'i').test(line)) problems.push(`${relative(ROOT, path)}:${i + 1}: describes MCP write access while it is off ("${phrase}")`);
        }
      });
    }
  }

  // Every non-test sale example carries its idempotency key: transaction_id on the API, invoiceId in the SDK.
  let examples = 0;
  for (const path of files.filter((p) => /\.mdx?$/.test(p))) {
    const text = readFileSync(path, 'utf8');
    for (const block of text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
      const code = block[1];
      if (/test_mode|livemode["']?\s*:\s*false/.test(code)) continue;
      if (/\/api\/v1\/track\/sale\b/.test(code) && /["']?amount_cents["']?\s*:/.test(code)) {
        examples += 1;
        if (!/transaction_id/.test(code)) problems.push(`${relative(ROOT, path)}: a /api/v1/track/sale example has no transaction_id`);
      }
      for (const call of code.matchAll(/\btrackSale\(\{([\s\S]*?)\}\)/g)) {
        examples += 1;
        if (!/\binvoiceId\b/.test(call[1])) problems.push(`${relative(ROOT, path)}: a trackSale example has no invoiceId`);
      }
    }
  }

  assert.ok(!problems.length, `tracking contract (docs) disagrees with x-affitor-contract:\n${problems.map((p) => `  ${p}`).join('\n')}`);
  return { statements, examples, rules: Object.keys(values).length };
}
