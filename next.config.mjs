import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Docs and blog are proxied at https://affitor.com/docs and /blog (Next
// multi-zone), so build assets must be absolute to a host this app serves or
// /_next/* would resolve against the main app. Production only — VERCEL_ENV-aware
// so preview deployments keep serving their own assets. docs.affitor.com keeps
// serving /_next/* (its middleware only redirects pages).
const isProdDeploy = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const config = {
  ...(isProdDeploy && {
    assetPrefix: 'https://docs.affitor.com',
    // assetPrefix covers /_next/static but NOT the /_next/image optimizer that
    // MDX images (compiled to next/image) go through — pin it to the docs host
    // too so those <img> URLs also survive the proxy.
    images: { path: 'https://docs.affitor.com/_next/image' },
  }),
  async rewrites() {
    return [
      {
        // Machine-readable markdown twin for every page: `<page-url>.md`
        // returns the raw MDX body as text/markdown (Stripe/Vercel pattern).
        // afterFiles by default, so real files in public/ (docs/skill.md) still win.
        source: '/docs/:path*.md',
        destination: '/llms.md/:path*',
      },
      {
        source: '/blog/:path*.md',
        destination: '/llms.md/blog/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        // The landing page is /docs. Not on docs.affitor.com: its middleware sends
        // every page to affitor.com/docs in one hop, and config redirects run first.
        source: '/',
        missing: [{ type: 'host', value: 'docs.affitor.com' }],
        destination: '/docs',
        permanent: true,
      },
      {
        // tracker page renamed BEFORE the audience-slug catch-all below —
        // first match wins, and this one needs a different destination.
        source: '/docs/advertisers/tracking/pageview-tracker-click',
        destination: '/docs/brand/tracking/click-tracking',
        permanent: true,
      },
      {
        // audience slug renamed to match the app's /brand/* paths (old URLs
        // are indexed by search/AI engines — keep them alive forever)
        source: '/docs/advertisers/:path*',
        destination: '/docs/brand/:path*',
        permanent: true,
      },
      {
        // intro content now lives at the docs landing
        source: '/docs/getting-started/what-is-affitor',
        destination: '/docs',
        permanent: true,
      },
      {
        // glossary moved under Support
        source: '/docs/getting-started/glossary',
        destination: '/docs/support/glossary',
        permanent: true,
      },
      {
        // the error reference is the page people guess at as /errors
        source: '/docs/errors',
        destination: '/docs/api-reference/errors',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
