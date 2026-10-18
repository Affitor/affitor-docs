'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { RootProvider } from 'fumadocs-ui/provider/next';

// The changelog starts light (brand: light first) until a visitor picks Dark with
// the header toggle; the docs and the blog keep following the OS. A visitor's choice is
// stored once and applies across all zones. To default the changelog to dark, use 'dark'.
// The provider is keyed by zone: next-themes reads defaultTheme only when it mounts, so a
// client-side move from /docs to /changelog must remount it to pick up the zone's default
// (a stored choice still wins, it is read again from localStorage).
const LIGHT_FIRST = /^\/changelog(?:[/.]|$)/;

export function ThemeRoot({ children }: { children: ReactNode }) {
  const lightFirst = LIGHT_FIRST.test(usePathname() ?? '');
  return (
    // Under /docs so it rides the affitor.com/docs zone rewrite: /api/* on affitor.com
    // belongs to the main app.
    <RootProvider
      key={lightFirst ? 'light-first' : 'system'}
      search={{ options: { api: '/docs/api/search' } }}
      theme={{ defaultTheme: lightFirst ? 'light' : 'system' }}
    >
      {children}
    </RootProvider>
  );
}
