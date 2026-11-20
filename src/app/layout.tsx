import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { PostHog } from '@/components/posthog';
import { ThemeRoot } from '@/components/theme-root';
import { BLOG_DOCS_ORIGIN, SITE_URL } from '@/lib/site';
import { Inter, JetBrains_Mono } from 'next/font/google';

// Self-hosted at build time (no Google Fonts CSS or origin at runtime, no render-blocking stylesheet).
// Inter carries the LCP text, so it is preloaded; JetBrains Mono is only in code, so it loads when used.
const inter = Inter({ subsets: ['latin'], axes: ['opsz'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  // Every page is published on affitor.com (multi-zone), so relative canonicals, alternates and
  // og images resolve there. The default og/twitter images live in app/docs/, so they are served
  // at affitor.com/docs/opengraph-image.png (affitor.com/<file> belongs to the dashboard).
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | Affitor Docs',
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
