import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { PostHog } from '@/components/posthog';
import { ThemeRoot } from '@/components/theme-root';
import { BLOG_DOCS_ORIGIN } from '@/lib/site';

export const metadata: Metadata = {
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

// Self-hosted fonts (latin subset, from Google Fonts): no third-party font CSS blocks the
// first paint on mobile. Inline in the document, not in globals.css, so the URLs resolve
// on the page's own host: in production the CSS is served from docs.affitor.com (assetPrefix)
// while pages are read on affitor.com, and two hosts would mean two downloads.
// 'Inter Fallback' is Arial sized to Inter's metrics, so the swap does not move the text.
const INTER = '/docs/fonts/inter-latin-v20.woff2';
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const FONT_FACES = [
  `@font-face{font-family:'Inter';font-style:normal;font-weight:400 700;font-display:swap;src:url(${INTER}) format('woff2');unicode-range:${LATIN}}`,
  `@font-face{font-family:'Inter Fallback';src:local('Arial');ascent-override:90.44%;descent-override:22.52%;line-gap-override:0%;size-adjust:107.12%}`,
  `@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:400 500;font-display:swap;src:url(/docs/fonts/jetbrains-mono-latin-v24.woff2) format('woff2');unicode-range:${LATIN}}`,
].join('');

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href={INTER} as="font" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: FONT_FACES }} />
      </head>
      <body>
        <ThemeRoot>{children}</ThemeRoot>
        <PostHog />
      </body>
    </html>
  );
}
