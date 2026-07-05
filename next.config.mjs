import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  async rewrites() {
    return [
      {
        // Machine-readable markdown twin for every page: `<page-url>.md`
        // returns the raw MDX body as text/markdown (Stripe/Vercel pattern).
        // afterFiles by default, so real files in public/ (skill.md) still win.
        source: '/:path*.md',
        destination: '/llms.md/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        // tracker page renamed BEFORE the audience-slug catch-all below —
        // first match wins, and this one needs a different destination.
        source: '/advertisers/tracking/pageview-tracker-click',
        destination: '/brand/tracking/click-tracking',
        permanent: true,
      },
      {
        // audience slug renamed to match the app's /brand/* paths (old URLs
        // are indexed by search/AI engines — keep them alive forever)
        source: '/advertisers/:path*',
        destination: '/brand/:path*',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/docs/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        // intro content now lives at the root landing
        source: '/getting-started/what-is-affitor',
        destination: '/',
        permanent: true,
      },
      {
        // glossary moved under Support
        source: '/getting-started/glossary',
        destination: '/support/glossary',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
