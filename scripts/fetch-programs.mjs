#!/usr/bin/env node
/**
 * Live programs on the Affitor marketplace (`total` of the public list endpoint), read once per build
 * (prebuild) into src/config/programs.json, so every page, .md twin and llms-full of a compare post
 * state one number. The committed file is the dated fallback: when the read fails, it is left as is
 * and the build goes on. Never the OpenAffiliate count: that directory lists programs not on Affitor.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FILE = fileURLToPath(new URL('../src/config/programs.json', import.meta.url));

try {
  const res = await fetch('https://api.affitor.com/api/marketplace/programs?limit=1', { signal: AbortSignal.timeout(5000) });
  const body = res.ok ? await res.json() : null;
  if (!Number.isInteger(body?.total) || body.total < 1) throw new Error(`no total (HTTP ${res.status})`);
  const programs = { count: body.total, asOf: new Date().toISOString().slice(0, 10) };
  writeFileSync(FILE, `${JSON.stringify(programs, null, 2)}\n`);
  console.log(`src/config/programs.json: ${programs.count} live programs as of ${programs.asOf}.`);
} catch (error) {
  console.log(`src/config/programs.json kept (marketplace not read: ${error.message}).`);
}
