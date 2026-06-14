import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  async redirects() {
    return [
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
      {
        // tracker page renamed "Pageview Tracker" -> "Click Tracking"
        source: '/advertisers/tracking/pageview-tracker-click',
        destination: '/advertisers/tracking/click-tracking',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
