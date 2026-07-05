import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
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
