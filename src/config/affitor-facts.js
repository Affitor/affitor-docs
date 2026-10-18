/**
 * Affitor's own numbers and words for `layout: compare` posts: the reference column of "At a glance"
 * and the "Also worth a look" paragraph, on the page (compare-post.tsx) and in the .md twin
 * (src/lib/agent-md.ts). Plain JS so scripts/check-agent-surface.mjs rebuilds the same twin.
 */

const SITE = 'https://affitor.com';

// Mirror of PRICING in affiliate-dashboard src/lib/agent-surface/identity.ts (the locked model on
// /pricing). Change both.
export const PRICING = { freeUsd: 10000, feePct: 3.5 };

// "per program" under "First $10,000": waits on Sơn's `per program` answer. true shows the note.
export const PER_PROGRAM_NOTE = true;

// Live programs on the Affitor marketplace and the day they were read (or the dated fallback):
// written once per build by scripts/fetch-programs.mjs (prebuild, predev); gitignored.
export { default as PROGRAMS } from './programs.json' with { type: 'json' };

/** @param {number} n */
export const usd = (n) => `$${n.toLocaleString('en-US')}`;
/** "Oct 18, 2026" @param {string} iso */
export const day = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
/** "October 18, 2026" @param {string} iso */
const longDay = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const AFFITOR_HEAD = { main: 'Affitor', sub: '', href: `${SITE}/pricing` };

/**
 * Affitor's reference column, one cell per row label of a post's table. MCP: the hosted server is
 * read scope only, every tool readOnlyHint (affiliate-cms src/mcp/http.ts, src/mcp/tools/defs.ts).
 * @param {{ count: number, asOf: string }} programs
 * @returns {Record<string, { main: string, sub: string }>}
 */
export function affitorColumn(programs) {
  const cell = (main, sub = '') => ({ main, sub });
  return {
    'Monthly fee': cell('$0', 'no subscription'),
    'Fee on top': cell(`${PRICING.feePct}% of affiliate-driven sales`, `after the first ${usd(PRICING.freeUsd)}`),
    'Free before fees': cell(`First ${usd(PRICING.freeUsd)}`, PER_PROGRAM_NOTE ? 'per program' : ''),
    'Revenue cap': cell('None'),
    'Partners on the entry plan': cell('Unlimited'),
    'Live programs on a marketplace': cell(String(programs.count), day(programs.asOf)),
    'Payouts sent for you': cell('Yes, bank or Wise'),
    'Tax forms': cell('W-8BEN, W-8BEN-E or W-9'),
    Stripe: cell('Native, no code'),
    'MCP server': cell('Yes, read-only'),
    Importer: cell('None', 'invite partners by CSV'),
  };
}

/** @param {string} checked YYYY-MM-DD */
export const glanceNote = (checked) =>
  `Entry plans as listed on each pricing page on ${longDay(checked)}. We make Affitor; its column is there for reference.`;

/**
 * "Also worth a look" paragraph as [before, link text, after]; the link text goes to the marketplace.
 * @param {{ count: number, asOf: string }} programs
 */
export function alsoWorthALook(programs) {
  return [
    `If neither fits, Affitor, which we make, has no subscription: it costs nothing until a program has made ${usd(PRICING.freeUsd)} through affiliates, then ${PRICING.feePct}% of affiliate-driven sales. ${programs.count} programs are live on its `,
    'marketplace',
    ` (as of ${day(programs.asOf)}). It has no importer, so partners get new links.`,
  ];
}
export const MARKETPLACE_URL = `${SITE}/marketplace`;

/**
 * The .md twin body of a compare post: <AtAGlance> becomes its full markdown table with Affitor's
 * column and the note, <AlsoWorthALook /> becomes the paragraph.
 * @param {string} body raw MDX body
 * @param {{ count: number, asOf: string }} programs
 */
export function compareMarkdown(body, programs) {
  const ours = affitorColumn(programs);
  const cell = ({ main, sub }) => (sub ? `${main}<br />${sub}` : main);
  const [before, link, after] = alsoWorthALook(programs);
  return body
    .replace(/<AtAGlance checked="(\d{4}-\d{2}-\d{2})">\n\n([\s\S]*?)\n\n<\/AtAGlance>/g, (_, checked, table) => {
      const lines = table.split('\n').map((line, i) => {
        if (i === 0) return `${line} [Affitor](${AFFITOR_HEAD.href}) |`;
        if (i === 1) return `${line} --- |`;
        const label = line.split('|')[1].trim();
        if (!ours[label]) throw new Error(`At a glance: no Affitor value for row "${label}"`);
        return `${line} ${cell(ours[label])} |`;
      });
      return `${lines.join('\n')}\n\n${glanceNote(checked)}`;
    })
    .replace('<AlsoWorthALook />', `${before}[${link}](${MARKETPLACE_URL})${after}`);
}
