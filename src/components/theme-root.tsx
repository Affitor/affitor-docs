'use client';

import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';

// Light only, like affitor.com's own public pages: no theme switch anywhere, and a dark OS setting does not change these
// pages.
export function ThemeRoot({ children }: { children: ReactNode }) {
  return (
    // Under /docs so it rides the affitor.com/docs zone rewrite: /api/* on affitor.com
    // belongs to the main app.
    <RootProvider search={{ options: { api: '/docs/api/search' } }} theme={{ defaultTheme: 'light', forcedTheme: 'light', enableSystem: false }}>
      {children}
    </RootProvider>
  );
}
