/**
 * The one header and footer every public Affitor page shows.
 *
 * Twin file: affiliate-dashboard/src/config/site-nav.ts holds the same data. Change both.
 * Here, links to dashboard pages are absolute (https://affitor.com/...), because a root link
 * resolves inside this docs app; docs, blog and changelog links stay relative. The dashboard
 * twin uses root-relative links for its own pages.
 */
import { SITE_URL } from '@/lib/site';

export type SiteLink = { label: string; href: string };

export const HOME_URL = SITE_URL;

export const HEADER_LINKS: SiteLink[] = [
  { label: 'Marketplace', href: `${SITE_URL}/marketplace` },
  { label: 'How it works', href: `${SITE_URL}/#how-it-works` },
  { label: 'Pricing', href: `${SITE_URL}/pricing` },
  { label: 'Docs', href: '/docs' },
];

// Logged out: Log in + Create free account. Signed in (src/lib/signed-in.ts): Log in is hidden
// and the CTA reads Go to Dashboard, like the dashboard's useLandingCTA.
export const LOGIN_LINK: SiteLink = { label: 'Log in', href: `${SITE_URL}/login` };
export const SIGNUP_LINK: SiteLink = { label: 'Create free account', href: `${SITE_URL}/signup` };
export const DASHBOARD_LABEL = 'Go to Dashboard';

export const FOOTER_TAGLINE =
  'The AI-native affiliate network. Built for modern SaaS companies who want to grow through partnerships.';

export const FOOTER_COLUMNS: { title: string; links: SiteLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Marketplace', href: `${SITE_URL}/marketplace` },
      { label: 'Features', href: `${SITE_URL}/#features` },
      { label: 'Pricing', href: `${SITE_URL}/pricing` },
      { label: 'How it works', href: `${SITE_URL}/#how-it-works` },
      { label: 'About', href: `${SITE_URL}/about` },
      { label: 'Affitor Refer Program', href: `${SITE_URL}/marketplace/referral-program` },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Documentation', href: '/docs' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: `${SITE_URL}/terms` },
      { label: 'Privacy Policy', href: `${SITE_URL}/privacy` },
    ],
  },
];

export const SOCIAL_LINKS = {
  x: 'https://x.com/affitor_ai',
  linkedin: 'https://linkedin.com/company/affitor',
};

// Same prompt as the dashboard's AskAI footer row.
export const ASK_AI_PROMPT =
  'As a SaaS founder, I want to understand how Affitor can help me launch and grow ' +
  'an affiliate program (recruiting the right partners, tracking sales through Stripe, ' +
  'and automating commission payouts) without building any of it in-house. ' +
  "Summarize the highlights from Affitor's website: https://affitor.com and their docs: https://affitor.com/docs";
