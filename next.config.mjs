import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  async redirects() {
    return [
      {
        // Old Mintlify/Starlight URLs without /docs prefix
        source: '/:path((?!docs|_next|api|favicon\\.ico|affitor-|images).*)',
        destination: '/docs/:path',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
