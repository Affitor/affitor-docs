/**
 * Public URLs. This app is served through affitor.com (Next multi-zone): the
 * dashboard rewrites /docs/* and /blog/* to this app, so docs pages live at
 * https://affitor.com/docs/... and the blog at https://affitor.com/blog/...
 * Both zones share the affitor.com origin, so in-app links stay relative
 * (/docs/..., /blog/...) and these absolute URLs are only for canonicals,
 * structured data and the machine-readable surface.
 */
export const SITE_URL = 'https://affitor.com';
export const DOCS_URL = `${SITE_URL}/docs`;
export const BLOG_URL = `${SITE_URL}/blog`;

/**
 * Prefix for /docs links and assets inside the BLOG (served at affitor.com/blog).
 * docs.affitor.com serves /docs/* in every DOCS_HOST_REDIRECT mode (200, or a redirect
 * to affitor.com/docs once that is on), so these links work before, during and after
 * the dashboard starts proxying affitor.com/docs. Set to '' once that proxy is live.
 */
export const BLOG_DOCS_ORIGIN = 'https://docs.affitor.com';
