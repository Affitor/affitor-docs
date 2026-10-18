import { cache } from 'react';

/**
 * Affitor's own numbers for the compare posts' reference column and "Also worth a look" paragraph,
 * so no post types them.
 */

// Mirror of PRICING in affiliate-dashboard src/lib/agent-surface/identity.ts (the locked model on
// /pricing). Change both.
export const PRICING = { freeUsd: 10000, feePct: 3.5 } as const;

// "per program" under "First $10,000": waits on Sơn's `per program` answer. true shows the note.
export const PER_PROGRAM_NOTE = true;

// Used when the marketplace cannot be read at build time, so the build never breaks.
const PROGRAMS_FALLBACK = { count: 59, asOf: '2026-10-17' };

/**
 * Live programs on the Affitor marketplace (`total` of the public list endpoint), read once per build,
 * with the day it was read. Never the OpenAffiliate count: that directory lists programs not on Affitor.
 */
export const livePrograms = cache(async (): Promise<{ count: number; asOf: string }> => {
  try {
    const res = await fetch('https://api.affitor.com/api/marketplace/programs?limit=1', {
      signal: AbortSignal.timeout(5000),
    });
    const body = res.ok ? await res.json() : null;
    if (!Number.isInteger(body?.total) || body.total < 1) return PROGRAMS_FALLBACK;
    return { count: body.total, asOf: new Date().toISOString().slice(0, 10) };
  } catch {
    return PROGRAMS_FALLBACK;
  }
});

export const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
