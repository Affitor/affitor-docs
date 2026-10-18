#!/usr/bin/env node
/**
 * Live programs on the Affitor marketplace (`total` of the public list endpoint), read once per build
 * (prebuild, predev) into src/config/programs.json (gitignored), so every page, .md twin and llms-full
 * of a compare post state one number. When the read fails it writes the dated fallback, so the build
 * never breaks. Never the OpenAffiliate count: that directory lists programs not on Affitor.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FILE = fileURLToPath(new URL('../src/config/programs.json', import.meta.url));
const FALLBACK = { count: 59, asOf: '2026-10-17' };

let programs = FALLBACK;
try {
  const res = await fetch('https://api.affitor.com/api/marketplace/programs?limit=1', { signal: AbortSignal.timeout(5000) });
  const body = res.ok ? await res.json() : null;
  if (!Number.isInteger(body?.total) || body.total < 1) throw new Error(`no total (HTTP ${res.status})`);
  programs = { count: body.total, asOf: new Date().toISOString().slice(0, 10) };
} catch (error) {
  console.log(`Marketplace not read (${error.message}); using the fallback.`);
}
writeFileSync(FILE, `${JSON.stringify(programs, null, 2)}\n`);
console.log(`src/config/programs.json: ${programs.count} live programs as of ${programs.asOf}.`);
