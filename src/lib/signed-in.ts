'use client';

import { useEffect, useState } from 'react';
import { SITE_URL } from '@/lib/site';

/**
 * Signed-in check for the blog, changelog and docs headers, which share the affitor.com
 * origin with the dashboard. At login the dashboard sets the session (`auth_token`, HttpOnly,
 * unreadable here) together with `csrf_token` (readable, same lifetime, cleared at logout).
 * We only test that `csrf_token` exists; its value is never read or sent.
 *
 * Returns the "Go to Dashboard" href when signed in, else null. null on the server and
 * first render, so hydration matches the logged-out header.
 */
const ROLE_CONTEXTS = [
  { key: 'advertiser_session_context', path: '/brand' },
  { key: 'partner_session_context', path: '/partner' },
];
const CONTEXT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

// Same choice as the dashboard's useLandingCTA: the role used last, else the role picker.
function dashboardPath(): string {
  let best = { path: '/select-role', at: 0 };
  for (const { key, path } of ROLE_CONTEXTS) {
    try {
      const at = Number(JSON.parse(localStorage.getItem(key) ?? 'null')?.lastAccessed);
      if (at > best.at && Date.now() - at < CONTEXT_MAX_AGE_MS) best = { path, at };
    } catch {
      // unreadable context: ignore it
    }
  }
  return best.path;
}

export function useDashboardHref(): string | null {
  const [href, setHref] = useState<string | null>(null);
  useEffect(() => {
    if (/(?:^|;\s*)csrf_token=/.test(document.cookie)) setHref(`${SITE_URL}${dashboardPath()}`);
  }, []);
  return href;
}
