/**
 * Cross-zone URL helpers (Next multi-zone).
 *
 * The blog is proxied at https://affitor.com/blog while this app deploys on
 * docs.affitor.com. Inside blog chrome, links/assets that belong to docs
 * sections must be ABSOLUTE to the docs host in production — relative ones
 * would resolve against affitor.com and collide with the main app's routes.
 * Blog canonicals point at affitor.com/blog.
 *
 * `docsBase` is '' in dev and preview deployments so navigation stays on the
 * local host. Guard is VERCEL_ENV-aware: local `next build` and Vercel
 * production get the absolute prefix, Vercel previews don't.
 */
export const DOCS_URL = 'https://docs.affitor.com';
export const BLOG_URL = 'https://affitor.com/blog';

const isProd = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production';

export const docsBase = isProd ? DOCS_URL : '';
