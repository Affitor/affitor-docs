import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// The blog is proxied at https://affitor.com/blog (Next multi-zone), so every
// asset URL in the HTML must be absolute to the docs host or it would resolve
// against affitor.com after proxying. Production only — VERCEL_ENV-aware so
// preview deployments keep serving their own assets.
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
  async headers() {
    return [
      {
        // fumadocs search dialog fetches this endpoint; on proxied blog pages
        // the fetch comes from the affitor.com origin (see RootProvider's
        // absolute `api` option in src/app/layout.tsx).
        source: '/api/search',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://affitor.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        ],
      },
    ];
  },
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
