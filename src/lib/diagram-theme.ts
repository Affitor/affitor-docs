import type { CSSProperties } from 'react';

/**
 * Build to Own "Campus" design tokens — the single source of colour for every
 * diagram (Mermaid, <Flow>, <FlowGrid>). Values mirror build2own-site/DESIGN.md.
 * Campus is light-only, so diagrams always sit on a --paper card, in dark mode too.
 */
export const campus = {
  acc: '#2563EB',
  accSoft: '#EEF3FF',
  accLine: '#D3E1FF',
  ink: '#0D1B33',
  ink2: '#1B2C48',
  muted: '#49596E',
  sub: '#607490',
  paper: '#FFFFFF',
  cream: '#FAF9F6',
  line: '#E7EAEF',
  line2: '#F1F3F6',
  ok: '#0F7B4F',
  okBg: '#E8F6EF',
  warn: '#8A5A00',
  warnBg: '#FDF4E3',
  do: '#B4231C',
  doBg: '#FBE9E7',
  r: '10px',
  rLg: '14px',
  sh: '0 1px 2px rgba(13,27,51,.05), 0 0 0 1px rgba(13,27,51,.04)',
  font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
} as const;

/** Tokens as CSS variables, set on each diagram root; globals.css reads them. */
export const campusVars = Object.fromEntries(
  Object.entries(campus).map(([k, v]) => [`--c-${k.replace(/[A-Z0-9]/g, (m) => `-${m.toLowerCase()}`)}`, v]),
) as CSSProperties;

/**
 * Mermaid config. Semantic classes shared by every chart — use them in a chart
 * with `class A,B ok` / `warn` / `do` instead of per-page classDef/style colours.
 */
export const mermaidConfig = {
  startOnLoad: false,
  theme: 'base' as const,
  fontFamily: campus.font,
  fontSize: 14,
  themeVariables: {
    fontFamily: campus.font,
    background: campus.paper,
    primaryColor: campus.accSoft,
    primaryTextColor: campus.ink,
    primaryBorderColor: campus.accLine,
    secondaryColor: campus.cream,
    tertiaryColor: campus.paper,
    mainBkg: campus.accSoft,
    nodeBorder: campus.accLine,
    nodeTextColor: campus.ink,
    textColor: campus.ink,
    titleColor: campus.ink,
    lineColor: campus.muted,
    edgeLabelBackground: campus.paper,
    clusterBkg: campus.cream,
    clusterBorder: campus.line,
    actorBkg: campus.accSoft,
    actorBorder: campus.accLine,
    actorTextColor: campus.ink,
    actorLineColor: campus.line,
    signalColor: campus.muted,
    signalTextColor: campus.ink,
    labelBoxBkgColor: campus.accSoft,
    labelBoxBorderColor: campus.accLine,
    labelTextColor: campus.ink,
    noteBkgColor: campus.cream,
    noteBorderColor: campus.line,
    noteTextColor: campus.ink2,
  },
  themeCSS: (['ok', 'warn', 'do'] as const)
    .map((k) => {
      const fg = campus[k];
      const bg = campus[`${k}Bg`];
      return `.node.${k} rect,.node.${k} polygon,.node.${k} circle,.node.${k} path{fill:${bg}!important;stroke:${fg}!important}.node.${k} .nodeLabel,.node.${k} text{color:${fg}!important;fill:${fg}!important}`;
    })
    .join('')
    .concat(`.node rect{rx:${parseInt(campus.r)}px;ry:${parseInt(campus.r)}px}`),
};
