import type { CSSProperties, ReactNode } from 'react';
import { readList } from './table-data';
import { tool } from './tools';
import { PopIn } from './pop-in';
import { Logo } from './ui';

/*
 * The 2x2 map (founder's axes, 13/10/2026; positions and labels from the approved mockup), shared by
 * the comparison and pricing pages.
 *   up    = brings you partners (lists your program where affiliates look, or helps recruit them)
 *   right = no subscription: no fixed monthly fee at any revenue
 * Children: a markdown list, one item per quadrant, "**<label>:** Tool, Tool". The list is what
 * agents read in the .md twin; AT just places the chips, and the build fails if a chip sits
 * outside the quadrant its list item names.
 */
const CORNERS = {
  'Network + subscription': 'tl',
  'Network, no subscription': 'tr',
  'Software + subscription': 'bl',
  'Software, no subscription': 'br',
} as const;
type Corner = (typeof CORNERS)[keyof typeof CORNERS];

// Fact scores (quadlayout.py in the design workspace): x = entry-plan fixed fee on a log scale, quotes at the left edge; y = 15 + 30*listing + 30*recruiting + 10*network; nudged apart where chips would overlap.
/** Chip box position on the lg+ map: [left %, bottom %] of a 672px square. */
const AT: Record<string, [number, number]> = {
  affitor: [66.8, 76.2],
  partnerstack: [1.5, 82.3],
  awin: [27.3, 82.3],
  everflow: [2.1, 76.3],
  partnerize: [17.0, 76.3],
  partnero: [34.0, 76.3],
  rakuten: [2.6, 70.3],
  cj: [15.9, 70.3],
  endorsely: [28.5, 64.3],
  refersion: [28.5, 58.3],
  reditus: [6.8, 57.3],
  impact: [32.4, 52.3],
  dub: [12.7, 42.3],
  rewardful: [24.6, 29.0],
  promotekit: [33.0, 22.0],
  tapfiliate: [14.0, 22.0],
  firstpromoter: [21.9, 15.0],
  tolt: [27.0, 8.0],
  postaffiliatepro: [2.0, 8.0],
};
/** Pop-in order: our tool first, then top to bottom. */
const POP = Object.keys(AT).sort((a, b) => (a === 'affitor' ? -1 : b === 'affitor' ? 1 : AT[b][1] - AT[a][1]));
const CHIP: Record<string, string> = { 'Rakuten Advertising': 'Rakuten' };

const TINT: Record<Corner, string> = {
  tl: 'bg-sky-50/50 dark:bg-fd-primary/[0.04]',
  tr: 'bg-blue-100/70 dark:bg-fd-primary/[0.14]',
  bl: 'bg-stone-100/60 dark:bg-white/[0.03]',
  br: 'bg-stone-50/40 dark:bg-white/[0.01]',
};
const LABEL: Record<Corner, string> = {
  tl: 'text-sky-800/80 dark:text-sky-300/80',
  tr: 'text-blue-900/80 dark:text-blue-300/80',
  bl: 'text-stone-600/80 dark:text-fd-muted-foreground',
  br: 'text-stone-500/80 dark:text-fd-muted-foreground',
};
const LEGEND = [
  ['border-blue-300 bg-blue-100', 'Network, no subscription'],
  ['border-sky-300 bg-sky-100', 'Network + subscription or quote'],
  ['border-stone-300 bg-stone-100', 'Software + subscription'],
];
const AXIS = 'rounded bg-white/80 font-medium text-stone-500 text-xs uppercase tracking-wider dark:bg-fd-background/80 dark:text-fd-muted-foreground';

function parse(children: ReactNode) {
  const groups = Object.fromEntries(Object.values(CORNERS).map((c) => [c, [] as string[]])) as Record<Corner, string[]>;
  const labels = {} as Record<Corner, string>;
  for (const item of readList(children)) {
    const at = item.indexOf(':');
    const label = item.slice(0, at).trim() as keyof typeof CORNERS;
    const corner = CORNERS[label];
    if (!corner) throw new Error(`Quadrant: unknown quadrant "${label}"`);
    labels[corner] = label;
    const names = item.slice(at + 1).trim();
    if (/^none\b/i.test(names)) continue;
    for (const name of names.split(',').map((n) => n.trim())) {
      const t = tool(name);
      const pos = AT[t.id];
      if (!pos) throw new Error(`Quadrant: no position for ${name}`);
      const placed: Corner = `${pos[1] >= 50 ? 't' : 'b'}${pos[0] >= 50 ? 'r' : 'l'}` as Corner;
      if (placed !== corner) throw new Error(`Quadrant: ${name} is listed under "${label}" but drawn in ${placed}`);
      groups[corner].push(name);
    }
  }
  return { groups, labels };
}

function Chip({ name, lead }: { name: string; lead?: boolean }) {
  const t = tool(name);
  return (
    <a
      className={`relative flex items-center gap-1 rounded-md border border-stone-200 bg-white text-stone-700 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg sm:gap-1.5 sm:rounded-lg dark:border-fd-border dark:bg-fd-card dark:text-fd-foreground ${
        lead ? 'py-1.5 pr-2 pl-1.5 shadow-xl ring-2 ring-fd-primary/40' : 'py-0.5 pr-2 pl-0.5 sm:py-1 sm:pl-1'
      }`}
      href={`#tool-${t.id}`}
    >
      <Logo name={name} decorative className={`size-4 shadow-sm ${lead ? 'sm:size-7' : 'sm:size-5'}`} />
      <span className={`whitespace-nowrap font-semibold ${lead ? 'text-xs sm:text-base' : 'text-[11px] sm:text-xs'}`}>
        {CHIP[name] ?? name}
      </span>
    </a>
  );
}

export function Quadrant({ children }: { children: ReactNode }) {
  const { groups, labels } = parse(children);
  const all = Object.values(groups).flat();
  const corner = (c: Corner, pos: string) => (
    <div className={`absolute font-semibold text-sm uppercase tracking-wide ${pos} ${LABEL[c]}`}>{labels[c]}</div>
  );

  return (
    <div className="my-8">
      <p className="mb-3 font-medium text-fd-foreground text-lg">Affiliate network = affiliate management + marketplace</p>

      {/* lg and up: chips placed on the map (672px wide there); they pop in once, when 35% of the map is in view */}
      <PopIn className="relative hidden aspect-square w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-300 bg-gradient-to-br from-stone-50 to-stone-100 shadow-sm lg:block dark:border-fd-border dark:from-fd-card dark:to-fd-card">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className={`border-r border-b border-stone-200/60 dark:border-white/10 ${TINT.tl}`} />
          <div className={`border-b border-stone-200/60 dark:border-white/10 ${TINT.tr}`} />
          <div className={`border-r border-stone-200/60 dark:border-white/10 ${TINT.bl}`} />
          <div className={TINT.br} />
        </div>
        {corner('tl', 'top-4 left-4')}
        {corner('tr', 'top-4 right-4')}
        {corner('bl', 'bottom-4 left-4')}
        {corner('br', 'right-4 bottom-4')}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-stone-300/80 dark:bg-white/15" />
        <div className="absolute top-1/2 right-0 left-0 h-px bg-stone-300/80 dark:bg-white/15" />
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 ${AXIS}`}>No subscription →</div>
        <div className={`absolute top-1/2 left-2 -translate-y-1/2 rotate-180 px-0.5 py-2 [writing-mode:vertical-rl] ${AXIS}`}>
          Brings partners →
        </div>
        {all.map((name) => {
          const [x, y] = AT[tool(name).id];
          return (
            <div
              key={name}
              className="chip-pop absolute z-10"
              style={{ left: `${x}%`, bottom: `${y}%`, '--i': POP.indexOf(tool(name).id) } as CSSProperties}
            >
              <Chip name={name} lead={tool(name).ours} />
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-0">
          {[25, 75].map((p) => (
            <div key={`v${p}`} className="absolute top-0 bottom-0 w-px bg-stone-200/40 dark:bg-white/5" style={{ left: `${p}%` }} />
          ))}
          {[25, 75].map((p) => (
            <div key={`h${p}`} className="absolute right-0 left-0 h-px bg-stone-200/40 dark:bg-white/5" style={{ bottom: `${p}%` }} />
          ))}
        </div>
      </PopIn>

      {/* below lg: the same four quadrants as a 2x2 grid; chips wrap, so no name overlaps another */}
      <div className="lg:hidden">
        <p className="mb-2 font-medium text-[11px] text-stone-500 uppercase tracking-wider dark:text-fd-muted-foreground">
          ↑ Brings partners · → No subscription
        </p>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-300 bg-stone-300/60 dark:border-fd-border dark:bg-white/10">
          {(['tl', 'tr', 'bl', 'br'] as Corner[]).map((c) => (
            <div key={c} className="min-h-24 bg-stone-50 dark:bg-fd-card">
              <div className={`h-full p-2.5 ${TINT[c]}`}>
                <div className={`mb-2 font-semibold text-[10px] uppercase tracking-wide ${LABEL[c]}`}>{labels[c]}</div>
                <div className="flex flex-wrap gap-1.5">
                  {groups[c].map((name) => (
                    <Chip key={name} name={name} lead={tool(name).ours} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex max-w-lg flex-wrap gap-4 text-sm">
        {LEGEND.map(([cls, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`h-4 w-4 rounded border ${cls}`} />
            <span className="text-stone-600 dark:text-fd-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
