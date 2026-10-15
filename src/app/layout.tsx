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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRoot>{children}</ThemeRoot>
        <PostHog />
      </body>
    </html>
  );
}
