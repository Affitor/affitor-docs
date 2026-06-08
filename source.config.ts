import { defineDocs, defineCollections, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';
import { remarkAdmonition } from 'fumadocs-core/mdx-plugins';
import { remarkMermaid } from './src/lib/remark-mermaid';

// `:::note / :::tip / :::warning / :::caution` colon-fence callouts -> <Callout>.
// Without this, Fumadocs 16 leaves the `:::` markers as literal text on every
// page that uses them. Cover every type used across the docs (the default
// typeMap omits `caution`).
const admonitionTypeMap = {
  info: 'info',
  note: 'info',
  tip: 'info',
  warn: 'warn',
  warning: 'warn',
  caution: 'warn',
  danger: 'error',
  error: 'error',
  success: 'success',
};

export const docs = defineDocs({
  dir: 'content/docs',
});

export const changelog = defineCollections({
  type: 'doc',
  dir: 'content/changelog',
  schema: frontmatterSchema.extend({
    date: z.string(),
    category: z.enum([
      'Dashboard',
      'Tracking',
      'CMS',
      'CLI',
      'Docs',
      'OpenAffiliate',
      'Bugfix',
    ]),
    benefit: z.string(),
    sourcePR: z.string().url().optional(),
    image: z.string().optional(),
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
