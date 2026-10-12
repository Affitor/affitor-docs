import './globals.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { PostHog } from '@/components/posthog';

export const metadata: Metadata = {
  title: {
    template: '%s | Affitor Docs',
    default: 'Affitor Documentation',
  },
  description: 'Complete guide to the Affitor affiliate management platform',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/docs/favicon.svg', type: 'image/svg+xml' },
      { url: '/docs/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/docs/favicon-64.png', type: 'image/png', sizes: '64x64' },
      { url: '/docs/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/docs/apple-touch-icon.png', sizes: '180x180' }],
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
        {/* Under /docs so it rides the affitor.com/docs zone rewrite: /api/* on
            affitor.com belongs to the main app. */}
        <RootProvider search={{ options: { api: '/docs/api/search' } }}>
          {children}
        </RootProvider>
        <PostHog />
      </body>
    </html>
  );
}
