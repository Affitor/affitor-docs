import type { ReactNode } from 'react';
import { tool } from './tools';

/*
 * Shared pieces of the comparison layout. Class strings are ported from the approved v5 mockup
 * (shadcn on Tailwind 4) with its tokens mapped to the site's fumadocs tokens, so dark mode follows
 * the theme: background -> fd-background, foreground -> fd-foreground, muted-foreground ->
 * fd-muted-foreground, primary -> fd-primary, border -> fd-border.
 */

/** Affitor's 5% tint, mixed into the background so it stays solid on sticky cells. */
export const OURS_BG = 'bg-[color-mix(in_oklab,var(--color-fd-primary)_5%,var(--color-fd-background))]';
export const LINK = 'text-fd-primary hover:underline';
export const TILE = 'h-full rounded bg-fd-background/75';
/** Tiles separated by 1px of the page background: the gridline look. */
export const GRID =
  'grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-fd-background/75 relative';

const GUTTER = (
  <div className="p-[0.5px]">
    <div className={`${TILE} max-lg:w-2`} />
  </div>
);

/** One full-width row: gutter tile | 69rem content | gutter tile. */
export function Band({ children, tile = TILE, padded = true }: { children: ReactNode; tile?: string; padded?: boolean }) {
  return (
    <div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_minmax(0,69rem)_1fr]">
      {GUTTER}
      <div className={`mx-auto w-full max-w-276 lg:min-w-5xl xl:min-w-276${padded ? ' p-[0.5px]' : ''}`}>
        {padded ? (
          <div className={tile} data-slot="content">
            {children}
          </div>
        ) : (
          children
        )}
      </div>
      {GUTTER}
    </div>
  );
}

export function Spacer({ className = 'h-8' }: { className?: string }) {
  return (
    <Band tile={`rounded bg-fd-background/75 ${className}`}>
      <div className={className} />
    </Band>
  );
}

/** Dashed underline + native tooltip, as on the v5 table headers. */
export function Tip({ label, text }: { label: string; text?: string }) {
  if (!text) return <>{label}</>;
  return (
    <span className="w-fit cursor-help border-b border-dashed border-fd-muted-foreground/30 pb-px" title={text}>
      {label}
    </span>
  );
}

const AVATAR =
  'relative flex shrink-0 overflow-hidden rounded-md bg-white before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-black/15';

/** Logos sit on a white tile in both themes: they are drawn for light backgrounds. */
export function Logo({ name, className = 'size-6 shadow-xs', decorative }: { name: string; className?: string; decorative?: boolean }) {
  const t = tool(name);
  return (
    <span className={`${AVATAR} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- plain img: next/image breaks the blog host checks */}
      <img
        className="aspect-square size-full object-contain"
        src={`/blog/logos/${t.logo}`}
        width={64}
        height={64}
        alt={decorative ? '' : `${name} logo`}
        loading="lazy"
      />
    </span>
  );
}

const SVG = {
  ok: 'M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z',
  part: 'M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128Z',
  no: 'M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z',
};

const ICONS = {
  yes: { path: SVG.ok, label: 'Supported', cls: 'bg-emerald-600 text-white' },
  partial: { path: SVG.part, label: 'Partial', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300' },
  no: { path: SVG.no, label: 'Not supported', cls: 'bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-300' },
  typically: { path: SVG.ok, label: 'Typically supported', cls: 'bg-fd-foreground/[0.065] text-fd-foreground/65' },
};
export type IconKind = keyof typeof ICONS;

export function Icon({ kind }: { kind: IconKind }) {
  const icon = ICONS[kind];
  return (
    <span className={`flex size-5 items-center justify-center rounded-full ${icon.cls}`} role="img" aria-label={icon.label}>
      <svg className="size-3" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
        <path d={icon.path} />
      </svg>
    </span>
  );
}

export const ARROW = (
  <svg className="size-4 pl-1" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
  </svg>
);
