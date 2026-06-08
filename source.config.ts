import { defineDocs, defineCollections, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';
import { remarkMermaid } from './src/lib/remark-mermaid';

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
    remarkPlugins: [remarkMermaid],
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
