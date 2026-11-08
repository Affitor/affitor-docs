// Tracking contract, docs side. The values are the docs copy in public/docs/openapi.yaml (info.x-affitor-contract,
// one JSON line, compared nightly with the product snapshot). scripts/tracking-contract-docs.json lists, per file, how
// many window statements it makes and which value each states; any other window statement fails as unlisted. Pins
// assert the rules a window scan cannot see (a maximum in its own table cell, lead default, refund semantics, key
// permissions, key recovery wording), and every contract rule is either checked here or explained as outside the docs.
//
// Text is read the way a reader sees it: MDX and HTML comments are dropped (outside code), and a paragraph, list item
// or YAML block that wraps over several lines is one unit with whitespace collapsed, so a statement or a phrase split
// across lines is still found. Code lines and table rows stay one unit each. Every match counts, not only the first.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { JSON_SCHEMA, load } from 'js-yaml';

const NUMBER = '(?<![\\d.$,])\\b(?!(?:200|201|204|301|302|307|308|400|401|403|404|409|410|422|429|500|503)\\b)(\\d{2,3})\\b(?![\\d.%]|,\\d)';
const STATEMENT = `(?:window|cookie).{0,80}?${NUMBER}|${NUMBER}(?:-day| days?)\\b.{0,60}?(?:window|cookie)`;
const FENCE = /^\s*(`{3,}|~{3,})/;
const MD_BLOCK = /^\s*(?:[-*+]\s|\d+[.)]\s|>|<|:::|import\s|export\s)/;
const YAML_KEY = /^\s*(?:-\s|[\w$"'.-]+\s*:(?:\s|$))/;
// A line of code outside a fence (JSON or a prop inside a JSX component): one unit, never joined with its neighbours.
const CODE_LIKE = /^\s*(?:[{}[\]]|"[^"]*"\s*:|'[^']*'\s*:|[\w$.-]+\s*(?:=\s*[{"'[]|:\s*["'`{[\d]))/;

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

// Leaf rule paths of the contract: nested objects (cli_published) count per field, lists count as one rule.
function leaves(values, prefix = '') {
  return Object.entries(values).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value) ? leaves(value, `${prefix}${key}.`) : [`${prefix}${key}`]);
}

// The units of one file: { text, lineOf, kind } with text on one line and lineOf[i] the source line of text[i].
export function units(source, file) {
  const yaml = /\.ya?ml$/.test(file);
  const lines = source.split('\n');
  const code = lines.map(() => false);
  const front = lines.map(() => false);
  if (!yaml) {
    let open = null;
    lines.forEach((line, i) => {
      const fence = line.match(FENCE);
      if (open) {
        code[i] = true;
        if (fence && fence[1][0] === open[0] && fence[1].length >= open.length && line.trim() === fence[1]) open = null;
      } else if (fence) {
        code[i] = true;
        open = fence[1];
      }
    });
    if (lines[0]?.trim() === '---') {
      const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
      for (let i = 0; i <= end; i += 1) front[i] = true;
    }
    // Drop MDX and HTML comments outside code, keeping line breaks so line numbers stay right.
    const prose = lines.map((line, i) => (code[i] ? '' : line)).join('\n')
      .replace(/\{\/\*[\s\S]*?\*\/\}|<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
      .split('\n');
    lines.forEach((line, i) => { if (!code[i]) lines[i] = prose[i]; });
  }

  const out = [];
  let current = null;
  const close = () => { if (current) out.push(current); current = null; };
  const open = (kind) => { close(); current = { kind, parts: [] }; };
  lines.forEach((line, i) => {
    if (!line.trim()) return close();
    if (code[i] || front[i]) { open(code[i] ? 'code' : 'line'); current.parts.push([line, i]); return close(); }
    if (yaml) {
      if (/^\s*["{}[\]]/.test(line)) { open('line'); current.parts.push([line, i]); return close(); }
      if (!current || YAML_KEY.test(line)) open('prose');
    } else if (CODE_LIKE.test(line)) {
      open('line'); current.parts.push([line, i]); return close();
    } else if (/^\s*\|/.test(line)) {
      open('row'); current.parts.push([line, i]); return close();
    } else if (/^\s*#{1,6}\s/.test(line)) {
      open('line'); current.parts.push([line, i]); return close();
    } else if (/^\s*>/.test(line)) {
      if (current?.kind !== 'quote') open('quote');
    } else if (MD_BLOCK.test(line) || !current) {
      open('prose');
    }
    current.parts.push([line, i]);
  });
  close();

  return out.map(({ kind, parts }) => {
    let text = '';
    const lineOf = [];
    for (const [line, i] of parts) {
      const piece = line.replace(/\s+/g, ' ').trim();
      if (!piece) continue;
      if (text) { text += ' '; lineOf.push(i); }
      text += piece;
      for (let k = 0; k < piece.length; k += 1) lineOf.push(i);
    }
    return { kind, text, lineOf };
  }).filter((u) => u.text);
}

const blank = (text, from, to) => text.slice(0, from) + ' '.repeat(to - from) + text.slice(to);

// Every window statement in the docs, after exemptions: { file, line, found, near }. An exemption blanks only the
// span it matches (a competitor's sentence or cell), so the rest of that row or paragraph is still read. Exemption
// hits are counted in `hits` (keyed by the exemption's index) so their counts can be checked.
export function scanDocs(ROOT, inventory, files) {
  const statements = [];
  const hits = inventory.elsewhere.map(() => 0);
  for (const path of files) {
    const file = relative(ROOT, path);
    const exempt = inventory.elsewhere.map((e, k) => [e, k]).filter(([e]) => e.file === file);
    for (const unit of units(readFileSync(path, 'utf8'), file)) {
      let text = unit.text;
      for (const [e, k] of exempt) {
        for (const m of unit.text.matchAll(new RegExp(e.match, 'g'))) {
          hits[k] += 1;
          text = blank(text, m.index, m.index + m[0].length);
        }
      }
      for (const m of text.matchAll(new RegExp(STATEMENT, 'gid'))) {
        const [at, end] = m.indices[1] ?? m.indices[2];
        statements.push({ file, line: unit.lineOf[at] + 1, found: Number(m[1] ?? m[2]), near: text.slice(m.index, end + 30) });
      }
    }
  }
  return { statements, hits };
}

export function checkTrackingContract(ROOT) {
  const spec = load(readFileSync(join(ROOT, 'public/docs/openapi.yaml'), 'utf8'), { schema: JSON_SCHEMA });
  const values = spec?.info?.['x-affitor-contract'];
  assert.ok(values && typeof values === 'object', 'public/docs/openapi.yaml: info.x-affitor-contract is missing');
  const inventory = JSON.parse(readFileSync(join(ROOT, 'scripts/tracking-contract-docs.json'), 'utf8'));
  for (const section of ['files', 'elsewhere', 'pins', 'required', 'while_mcp_write_off', 'outside_docs']) {
    assert.ok(Array.isArray(inventory[section]), `scripts/tracking-contract-docs.json: section "${section}" is missing`);
  }
  const files = [...walk(join(ROOT, 'content/docs')), ...walk(join(ROOT, 'content/blog')), join(ROOT, 'public/docs/skill.md'), join(ROOT, 'public/docs/openapi.yaml')];
  const known = new Set(files.map((path) => relative(ROOT, path)));
  const problems = [];
  const checked = new Set();

  // Window statements: each one is listed for its file, near-pattern and rule, with the exact count.
  const { statements, hits } = scanDocs(ROOT, inventory, files);
  const counts = inventory.files.map(() => 0);
  for (const s of statements) {
    const entries = inventory.files.map((e, k) => [e, k]).filter(([e]) => e.file === s.file);
    const pick = entries.find(([e]) => e.near && new RegExp(e.near).test(s.near)) ?? entries.find(([e]) => !e.near);
    if (!pick) { problems.push(`${s.file}:${s.line}: unlisted window statement (${s.found}): ${s.near.trim().slice(0, 100)}`); continue; }
    const [entry, k] = pick;
    counts[k] += 1;
    const expected = valueAt(values, entry.rule);
    if (s.found !== expected) problems.push(`${s.file}:${s.line}: says ${s.found}, rule ${entry.rule} is ${expected}`);
  }
  inventory.files.forEach((e, k) => {
    checked.add(e.rule);
    if (counts[k] !== e.count) problems.push(`${e.file}: ${counts[k]} statements of ${e.rule}${e.near ? ` (near /${e.near}/)` : ''}, inventory says ${e.count}`);
  });
  inventory.elsewhere.forEach((e, k) => {
    if (hits[k] !== (e.count ?? 1)) problems.push(`${e.file}: ${hits[k]} matches of the explained statement /${e.match}/, inventory says ${e.count ?? 1}`);
  });
  for (const e of [...inventory.files, ...inventory.elsewhere, ...inventory.pins, ...inventory.required]) {
    if (!known.has(e.file)) problems.push(`${e.file}: listed in scripts/tracking-contract-docs.json but missing`);
  }

  // Pins: a statement the window scan cannot read, asserted with its file, count and the value it must state.
  const unitCache = new Map();
  const unitsOf = (file) => {
    if (!unitCache.has(file)) unitCache.set(file, known.has(file) ? units(readFileSync(join(ROOT, file), 'utf8'), file) : []);
    return unitCache.get(file);
  };
  for (const pin of inventory.pins) {
    const what = pin.rule ?? pin.presence;
    if (pin.rule) checked.add(pin.rule);
    if (pin.minus) checked.add(pin.minus);
    let pattern = pin.match;
    if (pin.expect) {
      const value = String(valueAt(values, pin.rule));
      pattern = pin.expect[value];
      if (!pattern) { problems.push(`${pin.file}: no wording pinned for ${pin.rule} = ${value}`); continue; }
    }
    let n = 0;
    for (const unit of unitsOf(pin.file)) {
      for (const m of unit.text.matchAll(new RegExp(pattern, 'g'))) {
        n += 1;
        const line = unit.lineOf[m.index] + 1;
        if (pin.set) {
          const words = inventory.sets[pin.set];
          const found = Object.keys(words).filter((op) => new RegExp(words[op], 'i').test(m[1])).sort();
          const minus = pin.minus ? valueAt(values, pin.minus) : [];
          const want = valueAt(values, pin.rule).filter((op) => !minus.includes(op)).sort();
          if (found.join() !== want.join()) problems.push(`${pin.file}:${line}: names ${found.join(', ') || 'nothing'}, rule ${pin.rule}${pin.minus ? ` minus ${pin.minus}` : ''} is ${want.join(', ')}`);
        } else if (pin.match && pin.rule) {
          const expected = valueAt(values, pin.rule);
          if (String(m[1]) !== String(expected)) problems.push(`${pin.file}:${line}: says ${m[1]}, rule ${pin.rule} is ${expected}`);
        }
      }
    }
    if (n !== pin.count) problems.push(`${pin.file}: ${n} statements of ${what} match its pin, inventory says ${pin.count}`);
  }

  // Words that must be on a page, and wording that must not appear while hosted MCP write access is off.
  for (const r of inventory.required) {
    if (!unitsOf(r.file).some((unit) => new RegExp(r.match).test(unit.text))) problems.push(`${r.file}: must name ${r.match}`);
  }
  if (valueAt(values, 'mcp_write_live') === false) {
    checked.add('mcp_write_live');
    for (const file of known) {
      if (file.startsWith('content/blog/')) continue;
      for (const unit of unitsOf(file)) {
        for (const phrase of inventory.while_mcp_write_off) {
          const m = unit.text.match(new RegExp(phrase, 'i'));
          if (m) problems.push(`${file}:${unit.lineOf[m.index] + 1}: describes MCP write access while it is off ("${phrase}")`);
        }
      }
    }
  }

  // Every non-test sale example carries its idempotency key: transaction_id on the API, invoiceId in the SDK.
  assert.equal(valueAt(values, 'sale_transaction_id_required'), true, 'tracking contract: the sale example check is written for sale_transaction_id_required = true');
  checked.add('sale_transaction_id_required');
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

  // Every contract rule is checked above or explained as outside the docs (deployment or published state).
  const outside = new Set(inventory.outside_docs.map((o) => o.rule));
  for (const rule of leaves(values)) {
    if (!checked.has(rule) && !outside.has(rule)) problems.push(`x-affitor-contract: rule ${rule} is neither checked in the docs nor listed in outside_docs`);
    if (checked.has(rule) && outside.has(rule)) problems.push(`scripts/tracking-contract-docs.json: ${rule} is checked in the docs and also listed in outside_docs`);
  }
  for (const rule of [...checked, ...outside]) valueAt(values, rule);

  assert.ok(!problems.length, `tracking contract (docs) disagrees with x-affitor-contract:\n${problems.map((p) => `  ${p}`).join('\n')}`);
  return { statements: statements.length, pins: inventory.pins.reduce((sum, p) => sum + p.count, 0), examples, checked: checked.size, outside: outside.size };
}
