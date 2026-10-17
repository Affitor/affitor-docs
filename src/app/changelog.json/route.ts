import {
  CONTEXT_URL,
  contextPack,
  entryMedia,
  entrySlug,
  entryUrl,
  learnMore,
  points,
  sortedEntries,
} from '@/lib/changelog';

// affitor.com/changelog.json: every entry, newest first, built from the MDX at deploy (PLAN §5b),
// for the team and their AI tools making posts and videos. Same data as /changelog.md and RSS.
export const dynamic = 'force-static';

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;
const PACK = 'content/changelog/_context.md';
const COLORS: Record<string, string> = { brand: 'brand', ink: 'ink', text: 'text', muted: 'muted', lines: 'lines', 'soft background': 'soft_bg' };

/** Brand kit and "Never say" rules, read from the context pack so the two cannot drift. Fails the build if its lines move. */
function fromPack(md: string) {
  const line = (label: string) => {
    const found = md.match(new RegExp(`^\\s*- ${label}: (.+)$`, 'm'))?.[1];
    if (!found) throw new Error(`${PACK}: no "- ${label}:" line`);
    return found;
  };
  const urls = (label: string) => line(label).match(/https:\/\/[^\s,()]+/g) ?? [];
  const mark = urls('Mark');
  const logo = {
    mark_svg: mark.find((u) => u.endsWith('.svg')),
    mark_png: mark.find((u) => u.endsWith('.png')),
    wordmark_svg: urls('Wordmark').find((u) => u.endsWith('.svg')),
  };
  const colors = Object.fromEntries(
    line('Colors')
      .split(' · ')
      .map((part) => part.match(/^(.+?) (#[0-9A-Fa-f]{6})\b/))
      .filter((m): m is RegExpMatchArray => Boolean(m && COLORS[m[1]]))
      .map((m) => [COLORS[m[1]], m[2]]),
  );
  const rules = (md.split(/^## Never say\s*$/m)[1] ?? '').split(/^## /m)[0].match(/^- .+$/gm)?.map((l) => l.slice(2)) ?? [];
  const missing = [
    ...Object.entries(logo).filter(([, v]) => !v).map(([k]) => k),
    ...Object.values(COLORS).filter((k) => !colors[k]),
    ...(rules.length ? [] : ['Never say rules']),
  ];
  if (missing.length) throw new Error(`${PACK}: cannot read ${missing.join(', ')}`);
  return { brand: { logo, colors }, rules };
}

export async function GET() {
  const { brand, rules } = fromPack(contextPack());
  const entries = await Promise.all(
    sortedEntries().map(async (entry) => {
      const raw = (await entry.getText('raw')).replace(FRONTMATTER, '');
      return {
        slug: entrySlug(entry),
        url: entryUrl(entry),
        date: entry.date,
        type: entry.type,
        audience: entry.audience,
        surfaces: entry.surfaces,
        title: entry.title,
        description: entry.description,
        points: await points(entry),
        learn_more: learnMore(entry, raw),
        media: entryMedia(entry, raw),
        context: entry.context ?? null,
      };
    }),
  );
  const body = { generated_at: new Date().toISOString(), brand, global: { context_url: CONTEXT_URL, rules }, entries };
  return new Response(`${JSON.stringify(body, null, 2)}\n`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
