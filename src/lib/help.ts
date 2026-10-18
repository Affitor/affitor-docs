/**
 * Help center categories, in chip order (docs-skeleton spec §5). The help home
 * (content/docs/help/index.mdx) files each card under one of them in its `articles` frontmatter;
 * source.config.ts rejects any other value.
 */
export const HELP_CATEGORIES = [
  'Getting started',
  'Tracking and attribution',
  'Stripe and payments',
  'Commissions and payouts',
  'Partners',
  'Account and login',
  'Billing',
  'Troubleshooting',
] as const;
