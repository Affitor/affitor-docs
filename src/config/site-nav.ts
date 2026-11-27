/**
 * The one header and footer every public Affitor page shows. The data is generated from affitor.com's own source
 * (apps/web/src/config/site-nav.ts) into site-nav.generated.ts: never edit it here; change the web source and run its sync
 * script. Here, links to dashboard pages are absolute (https://affitor.com/...), because a root link resolves inside this docs
 * app; docs, blog and changelog links stay relative.
 */
import { SITE_URL } from '@/lib/site';
import type { HeaderEntry, HeaderMenu } from './site-nav-types';

export type { SiteLink, NavIcon, MenuItem, MenuGroup, MenuFeature, HeaderMenu, HeaderEntry, FooterColumn } from './site-nav-types';
export { DOCS_LINK, HEADER_NAV, LOGIN_LINK, SIGNUP_LINK, FOOTER_TAGLINE, FOOTER_COLUMNS, SOCIAL_LINKS } from './site-nav.generated';

export const HOME_URL = SITE_URL;

/**
 * Signed in, affitor.com `/` sends people into the app, so the home link and the `/#…` anchors point
 * at the public `/home` instead (dashboard twin: usePublicSiteHref). Anonymous visitors keep `/`.
 */
export function publicHref(href: string, signedIn: boolean): string {
  if (!signedIn) return href;
  if (href === SITE_URL || href === `${SITE_URL}/`) return `${SITE_URL}/home`;
  if (href.startsWith(`${SITE_URL}/#`)) return `${SITE_URL}/home${href.slice(SITE_URL.length + 1)}`;
  return href;
}

export const isHeaderMenu = (entry: HeaderEntry): entry is HeaderMenu => 'groups' in entry;

export const DASHBOARD_LABEL = 'Dashboard';

// Same prompt as the dashboard's AskAI footer row (affiliate-dashboard LandingRedesign/AskAI.tsx, dash#758):
// two readers, no numbers, Affitor's own sources last.
export const ASK_AI_PROMPT =
  "I'm looking at Affitor (affitor.com), an affiliate platform for SaaS. Explain how it helps " +
  "a SaaS company launch and run an affiliate program (recruiting partners, tracking sales " +
  "through Stripe or its API, paying commissions), how its pricing works, and how a creator " +
  "can earn by promoting SaaS products there. Use Affitor's own sources: " +
  'https://affitor.com/llms.txt and https://affitor.com/docs';
