'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { RootProvider } from 'fumadocs-ui/provider/next';

// The changelog starts light (brand: light first) until a visitor picks System or Dark in
// the header switch; the docs and the blog keep following the OS. A visitor's choice is
// stored once and applies across all zones. To default the changelog to dark, use 'dark'.
const LIGHT_FIRST = /^\/changelog(?:[/.]|$)/;

export function ThemeRoot({ children }: { children: ReactNode }) {
  const lightFirst = LIGHT_FIRST.test(usePathname() ?? '');
  return (
    // Under /docs so it rides the affitor.com/docs zone rewrite: /api/* on affitor.com
    // belongs to the main app.
    <RootProvider
      search={{ options: { api: '/docs/api/search' } }}
      theme={{ defaultTheme: lightFirst ? 'light' : 'system' }}
    >
      {children}
    </RootProvider>
  );
}
