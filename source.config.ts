import { defineDocs, defineCollections, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';
import { remarkAdmonition } from 'fumadocs-core/mdx-plugins';
import { remarkMermaid } from './src/lib/remark-mermaid';

// `:::note / :::tip / :::warning / :::caution` colon-fence callouts -> <Callout>.
// Without this, Fumadocs 16 leaves the `:::` markers as literal text on every
// page that uses them. Cover every type used across the docs (the default
// typeMap omits `caution`). The plugin takes the first key the line starts
// with, so `warning` must come before `warn` or `:::warning[Title]` loses its
// title. Values must be a type <Callout> styles (`warning`, not `warn`).
const admonitionTypeMap = {
  info: 'info',
  note: 'info',
  tip: 'info',
  warning: 'warning',
  warn: 'warning',
  caution: 'warning',
  danger: 'error',
  error: 'error',
  success: 'success',
};

export const docs = defineDocs({
  dir: 'content/docs',
});

// YAML reads an unquoted 2026-09-20 as a Date; keep every changelog date a YYYY-MM-DD string.
const day = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
);

// affitor.com/changelog (src/app/changelog). One file per entry; the slug is the file name.
// Admonitions (`:::warning`) are banned here: check-agent-surface.mjs fails on them.
export const changelog = defineCollections({
  type: 'doc',
  dir: 'content/changelog',
  // Bundled into the page module, so the daily ISR render of the index never reads the disk.
  postprocess: { includeProcessedMarkdown: true },
  schema: frontmatterSchema.extend({
    date: day,
    type: z.enum(['feature', 'digest', 'breaking', 'deprecation', 'security', 'pricing']),
    audience: z.array(z.enum(['brands', 'partners', 'developers'])).min(1),
    surfaces: z.array(z.enum(['dashboard', 'marketplace', 'tracking', 'api', 'sdk', 'cli', 'mcp'])).default([]),
    description: z.string(),
    // Files public/docs/changelog/<slug>/banner-{light,dark}.png. Omit for a digest.
    banner: z.object({ pill: z.string(), subject: z.enum(['ui', 'code', 'none']) }).optional(),
    version: z.string().optional(),
    action: z.object({ who: z.string(), what: z.string(), by: day.optional() }).optional(),
    deprecations: z.array(z.object({ what: z.string(), replacement: z.string(), sunset: day })).optional(),
    // The week still running: the date rail says "This week".
    draft: z.boolean().optional(),
  }),
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    // description doubles as the one-line dek + machine summary — required for blog
    description: z.string(),
    date: z.string(),
    category: z.string(),
    authors: z.array(z.string()),
    readTime: z.string().optional(),
    image: z.string().optional(),
    // AI-citability fields (AI-RANK-redesign.md A2/A7) — all optional, template-driven
    // ISO date of last content refresh; drives dateModified in BlogPosting schema
    // and the visible "Updated" label. Falls back to `date` when absent.
    updated: z.string().optional(),
    // FAQ section mirror -> FAQPage JSON-LD
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    // Tool names in ranked order (listicle posts) -> ItemList JSON-LD
    tools: z.array(z.string()).optional(),
    // How-to posts -> HowTo JSON-LD (steps derived from "Step N" H2 headings)
    howto: z.boolean().optional(),
    // `comparison` renders the wide comparison shell (src/components/blog/comparison);
    // route, sitemap, .md twin and JSON-LD stay the same
    layout: z.enum(['comparison']).optional(),
    // A word of the title the comparison hero tints
    highlight: z.string().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMermaid, [remarkAdmonition, { typeMap: admonitionTypeMap }]],
    // Dark code blocks in BOTH light & dark page modes — pair a dark Shiki
    // theme (light text) with the dark code surface so text never goes
    // dark-on-dark. (Fumadocs' default dual github-light/dark put DARK text in
    // light mode, which is invisible on our forced-dark code background.)
    rehypeCodeOptions: {
      themes: {
        light: 'github-dark',
        dark: 'github-dark',
      },
    },
  },
});
