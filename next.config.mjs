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
    ];
  },
};

export default withMDX(config);
