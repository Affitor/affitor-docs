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

/** The 1200x630 card the dashboard draws (affitor.com/api/og): the share image of a page that has none of its own. */
export const ogCard = (title: string, description: string, path: string) =>
  `${SITE_URL}/api/og?${new URLSearchParams({ title, description, path })}`;

/**
 * Prefix for /docs links and assets inside the blog. '' now that affitor.com proxies
 * /docs (dashboard docs zone), so the blog links /docs/... on its own origin.
 */
export const BLOG_DOCS_ORIGIN = '';
