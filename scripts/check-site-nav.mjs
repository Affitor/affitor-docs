// The public header/footer data is generated from affitor.com's source (apps/web/src/config/site-nav.ts) by its sync script.
// This refuses a hand edit: the data must hash to the SITE_NAV_BODY_SHA256 the generator wrote.   node scripts/check-site-nav.mjs
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const ts = createRequire(import.meta.url)('typescript');
const file = new URL('../src/config/site-nav.generated.ts', import.meta.url);
const js = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const module = { exports: {} };
vm.runInNewContext(js, { module, exports: module.exports, require: () => ({}) });
const e = module.exports;
const data = { DOCS_LINK: e.DOCS_LINK, HEADER_NAV: e.HEADER_NAV, LOGIN_LINK: e.LOGIN_LINK, SIGNUP_LINK: e.SIGNUP_LINK,
  FOOTER_TAGLINE: e.FOOTER_TAGLINE, FOOTER_COLUMNS: e.FOOTER_COLUMNS, SOCIAL_LINKS: e.SOCIAL_LINKS };
const body = createHash('sha256').update(JSON.stringify(data)).digest('hex');
if (body !== e.SITE_NAV_BODY_SHA256) {
  console.error('site-nav.generated.ts was edited by hand (body hash differs). Change apps/web/src/config/site-nav.ts on affitor.com and run its sync script instead.');
  process.exit(1);
}
console.log(`site-nav.generated.ts intact (source ${String(e.SITE_NAV_SOURCE_SHA256).slice(0, 12)})`);
