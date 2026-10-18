import { defineDocs, defineCollections, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';
import { remarkAdmonition } from 'fumadocs-core/mdx-plugins';
import { remarkMermaid } from './src/lib/remark-mermaid';
import { HELP_CATEGORIES } from './src/lib/help';

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

// YAML reads an unquoted 2026-09-20 as a Date; keep every docs and changelog date a YYYY-MM-DD string.
const day = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
);

// Docs page kinds (docs standard STANDARD.md §3): each kind has its template. last_updated is the
// day the page's content last changed, set by whoever edits it; it drives "Last updated", the .md
// twin's `updated`, dateModified and the sitemap lastmod.
const DOC_KINDS = ['concept', 'quickstart', 'guide', 'reference', 'terms', 'explainer', 'faq'] as const;

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      kind: z.enum(DOC_KINDS),
      last_updated: day,
      // The help home's cards (content/docs/help/index.mdx): a docs page by its path under /docs, a
      // category and search tags. The card text is that page's own title and description.
      articles: z
        .array(z.object({ page: z.string(), category: z.enum(HELP_CATEGORIES), tags: z.array(z.string()).min(1) }).strict())
        .min(1)
        .optional(),
    }),
  },
});

// affitor.com/changelog (src/app/changelog). One .mdx file per entry; the slug is the file name.
// _context.md beside them is the shared AI context pack (/changelog/context.md), not an entry.
// Admonitions (`:::warning`) are banned here: check-agent-surface.mjs fails on them.
export const changelog = defineCollections({
  type: 'doc',
  dir: 'content/changelog',
  files: ['*.mdx'],
  // The MDAST is bundled into the page module, so the daily ISR render of the index reads the
  // digest bullets without touching the disk. (Not includeProcessedMarkdown: its serializer
  // recursed forever on bold text in the fumadocs-mdx release Vercel installs, 14/10/2026.
  // And not { removePosition: true }: it serializes removePosition()'s return, undefined.)
  postprocess: { includeMDAST: true },
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
    // /changelog.json `points` when the body uses H2s instead of top-level bullets.
    points: z.array(z.string()).optional(),
    // Data for AI-made posts and videos, checked like the entry's sentences. Not shown on the
    // page: it ends the .md twin ("Context for AI") and is `context` in /changelog.json.
    context: z
      .object({
        facts: z.array(z.string()).optional(),
        ui: z.array(z.string()).optional(),
        avoid: z.array(z.string()).optional(),
        cta: z.object({ label: z.string(), url: z.url({ protocol: /^https$/ }) }).strict().optional(),
      })
      .strict()
      .optional(),
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
