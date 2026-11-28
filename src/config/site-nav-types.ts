/** Shapes of the public header and footer data (the data itself is generated from affitor.com's source: site-nav.generated.ts). */
export type SiteLink = { label: string; href: string };
export type NavIcon = 'store' | 'chart' | 'send' | 'grid' | 'gift' | 'plug' | 'bot' | 'code' | 'book' | 'help' | 'news' | 'swap';
export type MenuItem = SiteLink & { description: string; icon: NavIcon };
export type MenuGroup = { title: string; items: MenuItem[] };
export type MenuFeature = SiteLink & { description: string; image: string; imageAlt: string };
export type HeaderMenu = { label: string; groups: MenuGroup[]; feature?: MenuFeature };
export type HeaderEntry = SiteLink | HeaderMenu;
export type FooterColumn = { title: string; links: SiteLink[] };
