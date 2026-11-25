/**
 * Public URLs. This app is served through affitor.com (Next multi-zone): the
 * dashboard rewrites /docs/* and /blog/* to this app, so docs pages live at
 * https://affitor.com/docs/... and the blog at https://affitor.com/blog/...
 * Both zones share the affitor.com origin, so in-app links stay relative
 * (/docs/..., /blog/...) and these absolute URLs are only for canonicals,
 * structured data and the machine-readable surface.
 */
export const SITE_URL = 'https://affitor.com';

/**
 * The approved share card (CORE-687, Sơn's "ok share card" 07/11/2026): affitor.com renders the 1200×630 template
 * (Affitor logo + title) for any title. Used for every page without a designed image of its own; designed blog
 * covers and changelog banners stay (CTO ruling D1, 25/11).
 */
export const shareCard = (title: string) => ({
  url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`,
  width: 1200,
  height: 630,
});
export const DOCS_URL = `${SITE_URL}/docs`;
export const BLOG_URL = `${SITE_URL}/blog`;

/**
 * Prefix for /docs links and assets inside the blog. '' now that affitor.com proxies
 * /docs (dashboard docs zone), so the blog links /docs/... on its own origin.
 */
export const BLOG_DOCS_ORIGIN = '';
