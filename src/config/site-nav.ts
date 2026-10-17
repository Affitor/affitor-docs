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

/** Icon names, the same in both twins; each header maps a name to its own icon. */
export type NavIcon = 'store' | 'chart' | 'send' | 'grid' | 'gift' | 'bot' | 'code' | 'book' | 'help' | 'news';
export type MenuItem = SiteLink & { description: string; icon: NavIcon };
export type MenuGroup = { title: string; items: MenuItem[] };
export type MenuFeature = SiteLink & { description: string; image: string; imageAlt: string };
export type HeaderMenu = { label: string; groups: MenuGroup[]; feature?: MenuFeature };
export type HeaderEntry = SiteLink | HeaderMenu;

export const isHeaderMenu = (entry: HeaderEntry): entry is HeaderMenu => 'groups' in entry;

/**
 * The top bar, left to right (mock marketing-site N1–N3, P1; Sơn ok 17/10 14:1x), the same data as the
 * dashboard twin (dash#771). Only pages that exist today: Integrations, Switch and Compare join when
 * their pages ship, Solutions when the docs use-case pages ship (until then "How it works" stays on the
 * top bar), and AI agents points at the MCP guide until /agents exists. The Recommended image is the
 * dashboard's public file, so it loads from affitor.com on every host.
 */
export const HEADER_NAV: HeaderEntry[] = [
  {
    label: 'Product',
    groups: [
      {
        title: 'For brands',
        items: [
          { label: 'Run an affiliate program', description: 'Partners sell your SaaS, you pay on results', href: '/docs/brand/quickstart', icon: 'store' },
          { label: 'Track sales', description: 'Stripe with no code, or from your server', href: '/docs/brand/tracking/tracking-overview', icon: 'chart' },
          { label: 'Pay partners', description: 'Wise or bank transfer, tax forms collected', href: '/docs/brand/quickstart/payouts', icon: 'send' },
        ],
      },
      {
        title: 'For partners',
        items: [
          { label: 'Marketplace', description: 'Find programs to promote', href: `${SITE_URL}/marketplace`, icon: 'grid' },
          { label: 'Refer a brand', description: 'Earn by bringing a brand to Affitor', href: `${SITE_URL}/marketplace/referral-program`, icon: 'gift' },
        ],
      },
      {
        title: 'Build',
        items: [
          { label: 'AI agents', description: 'Ask your AI app about your program', href: '/docs/api-reference/mcp', icon: 'bot' },
          { label: 'API and SDK', description: 'Track clicks, signups and sales', href: '/docs/api-reference/overview', icon: 'code' },
        ],
      },
    ],
  },
  { label: 'How it works', href: `${SITE_URL}/#how-it-works` },
  {
    label: 'Resources',
    groups: [
      {
        title: 'Learn',
        items: [
          { label: 'Docs', description: 'Guides and API reference', href: '/docs', icon: 'book' },
          { label: 'Support', description: 'Contact, status and glossary', href: '/docs/support', icon: 'help' },
          { label: 'Changelog', description: 'What shipped this week', href: '/changelog', icon: 'news' },
          { label: 'Blog', description: 'Guides and news', href: '/blog', icon: 'news' },
        ],
      },
    ],
    feature: {
      label: 'Connect a new Stripe account',
      description: 'Create the account, connect it in one click, check it worked.',
      href: '/docs/brand/tracking/connect-stripe-account',
      image: `${SITE_URL}/nav/payments-connected.webp`,
      imageAlt: 'Payments settings with Stripe connected',
    },
  },
  { label: 'Marketplace', href: `${SITE_URL}/marketplace` },
  { label: 'Pricing', href: `${SITE_URL}/pricing` },
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

// Same prompt as the dashboard's AskAI footer row (affiliate-dashboard LandingRedesign/AskAI.tsx, dash#758):
// two readers, no numbers, Affitor's own sources last.
export const ASK_AI_PROMPT =
  "I'm looking at Affitor (affitor.com), an affiliate platform for SaaS. Explain how it helps " +
  "a SaaS company launch and run an affiliate program (recruiting partners, tracking sales " +
  "through Stripe or its API, paying commissions), how its pricing works, and how a creator " +
  "can earn by promoting SaaS products there. Use Affitor's own sources: " +
  'https://affitor.com/llms.txt and https://affitor.com/docs';
