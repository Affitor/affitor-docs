import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { PostHog } from '@/components/posthog';
import { ThemeRoot } from '@/components/theme-root';
import { BLOG_DOCS_ORIGIN, SITE_URL } from '@/lib/site';
import { Inter, JetBrains_Mono } from 'next/font/google';

// Self-hosted at build time (no Google Fonts CSS or origin at runtime, no render-blocking stylesheet).
// No preload: measured, a preloaded Inter made first paint shape the variable font on slow CPUs (mobile LCP
// +140 ms); without it the first paint uses the metric-matched fallback and Inter swaps in (CLS ~0).
const inter = Inter({ subsets: ['latin'], axes: ['opsz'], variable: '--font-inter', display: 'swap', preload: false });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  // Every page is published on affitor.com (multi-zone), so relative canonicals and alternates resolve there.
  // Share images are the approved card from affitor.com/api/og (shareCard in lib/site.ts, CORE-687); the old static
  // card stays at public/docs/opengraph-image.png so links to it keep answering.
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s · Affitor',
    default: 'Affitor Documentation',
  },
  description: 'Complete guide to the Affitor affiliate management platform',
  // Absolute: this layout also renders the blog at affitor.com/blog (see BLOG_DOCS_ORIGIN).
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: `${BLOG_DOCS_ORIGIN}/docs/favicon.svg`, type: 'image/svg+xml' },
      { url: `${BLOG_DOCS_ORIGIN}/docs/favicon-32.png`, type: 'image/png', sizes: '32x32' },
      { url: `${BLOG_DOCS_ORIGIN}/docs/favicon-64.png`, type: 'image/png', sizes: '64x64' },
      { url: `${BLOG_DOCS_ORIGIN}/docs/icon-512.png`, type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: `${BLOG_DOCS_ORIGIN}/docs/apple-touch-icon.png`, sizes: '180x180' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeRoot>{children}</ThemeRoot>
        <PostHog />
      </body>
    </html>
  );
}
