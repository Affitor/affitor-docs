'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DASHBOARD_LABEL, HEADER_NAV, publicHref, LOGIN_LINK, SIGNUP_LINK, isHeaderMenu, type HeaderMenu } from '@/config/site-nav';
import { useDashboardHref, useSignedIn } from '@/lib/signed-in';
import { Logo } from '@/components/logo';
import { ThemeSwitch } from '@/components/theme-switch';
import { NavIconSvg } from '@/components/blog/nav-icons';

/**
 * The affitor.com header (affiliate-dashboard LandingRedesign/Navbar, dash#771) for the blog and the
 * changelog: logo, Product and Resources menus between the plain links, Log in + Create free account
 * (Go to Dashboard when signed in), plus the theme switch. Below 1024 px: the call to action and a
 * drawer. Data lives in src/config/site-nav.ts. Behaviour matches the dashboard twin; keep them in step.
 */

// Measures an open panel before paint (so it never flashes off-screen) without the SSR warning.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const menuId = (label: string) => `site-menu-${label.toLowerCase()}`;

const groupTitle = 'text-xs font-semibold uppercase tracking-[0.04em] text-[#6a7383] dark:text-fd-muted-foreground';

function DesktopMenu({
  menu,
  open,
  onHover,
  onLeave,
  onToggle,
  triggerRef,
}: {
  menu: HeaderMenu;
  open: boolean;
  onHover: () => void;
  onLeave: () => void;
  onToggle: () => void;
  triggerRef: (el: HTMLButtonElement | null) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  // Keep the panel inside the viewport.
  useIsoLayoutEffect(() => {
    if (!open || !panelRef.current) {
      setShift(0);
      return;
    }
    const overflow = panelRef.current.getBoundingClientRect().right - (window.innerWidth - 16);
    setShift(overflow > 0 ? -overflow : 0);
  }, [open]);

  return (
    <div
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && onHover()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onLeave()}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId(menu.label)}
        onClick={onToggle}
        className={`flex h-8 items-center gap-1 rounded-md px-2.5 text-sm font-medium transition-colors ${
          open
            ? 'bg-[#f1f3f5] text-[#0A2540] dark:bg-fd-muted dark:text-fd-foreground'
            : 'text-[#425466] hover:bg-[#f1f3f5] hover:text-[#0A2540] dark:text-fd-muted-foreground dark:hover:bg-fd-muted dark:hover:text-fd-foreground'
        }`}
      >
        {menu.label}
        <NavIconSvg name="chevron" className={`h-3.5 w-3.5 text-[#6a7383] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {/* pt-2 bridges the gap under the trigger, so the pointer never leaves the menu on its way down. */}
      <div hidden={!open} className="absolute left-0 top-full pt-2" style={{ transform: shift ? `translateX(${shift}px)` : undefined }}>
        <div
          id={menuId(menu.label)}
          ref={panelRef}
          className="flex gap-6 rounded-xl border border-[#e3e8ee] bg-white p-5 shadow-[0_12px_32px_rgba(10,37,64,0.12)] dark:border-fd-border dark:bg-fd-popover"
        >
          {menu.groups.map((group) => (
            <div key={group.title}>
              <p className={`mb-2 ${groupTitle}`}>{group.title}</p>
              <ul className="flex flex-col">
                {group.items.map((item) => (
                  <li key={item.href + item.label}>
                    <a href={item.href} className="flex w-[244px] gap-3 rounded-lg p-2 hover:bg-[#f8f9fa] dark:hover:bg-fd-muted">
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-[#e3e8ee] bg-white text-[#155DFC] dark:border-fd-border dark:bg-fd-background">
                        <NavIconSvg name={item.icon} className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[#0A2540] dark:text-fd-foreground">{item.label}</span>
                        <span className="block text-[13px] leading-[18px] text-[#6a7383] dark:text-fd-muted-foreground">{item.description}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {menu.feature && (
            <div>
              <p className={`mb-2 ${groupTitle}`}>Recommended</p>
              <a
                href={menu.feature.href}
                className="flex w-[260px] flex-col gap-2 rounded-lg bg-[#f8f9fa] p-3.5 hover:bg-[#f1f3f5] dark:bg-fd-muted dark:hover:bg-fd-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static, lazy, only requested once the menu opens */}
                <img
                  src={menu.feature.image}
                  alt={menu.feature.imageAlt}
                  width={232}
                  height={187}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-md border border-[#e3e8ee] dark:border-fd-border"
                />
                <span className="text-sm font-semibold text-[#0A2540] dark:text-fd-foreground">{menu.feature.label}</span>
                <span className="text-[13px] leading-[18px] text-[#6a7383] dark:text-fd-muted-foreground">{menu.feature.description}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DrawerMenu({ menu, onNavigate }: { menu: HeaderMenu; onNavigate: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#e3e8ee] py-3 dark:border-fd-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${menuId(menu.label)}-drawer`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-base font-semibold text-[#0A2540] dark:text-fd-foreground"
      >
        {menu.label}
        <NavIconSvg name="chevron" className={`h-4 w-4 text-[#6a7383] transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      <div id={`${menuId(menu.label)}-drawer`} hidden={!open}>
        {menu.groups.map((group) => (
          <div key={group.title}>
            <p className={`mt-2.5 ${groupTitle}`}>{group.title}</p>
            {group.items.map((item) => (
              <a
                key={item.href + item.label}
                href={item.href}
                onClick={onNavigate}
                className="block py-2 text-sm text-[#425466] hover:text-[#0A2540] dark:text-fd-muted-foreground dark:hover:text-fd-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const openedByHover = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const drawerButton = useRef<HTMLButtonElement>(null);
  const drawerClose = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dashboardHref = useDashboardHref();
  const signedIn = useSignedIn();
  const cta = dashboardHref ? { label: DASHBOARD_LABEL, href: dashboardHref } : SIGNUP_LINK;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A desktop menu closes on Escape (focus back on its trigger) and on a press anywhere outside the bar.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      triggers.current.get(openMenu)?.focus();
      setOpenMenu(null);
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [openMenu]);

  // The drawer covers the page: lock its scroll, close on Escape, keep Tab inside it (aria-modal),
  // move focus in and back out, and close when the window grows to the desktop bar.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerClose.current?.focus();
    const button = drawerButton.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const desktop = typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 1024px)') : null;
    const onDesktop = () => desktop?.matches && setDrawerOpen(false);
    desktop?.addEventListener('change', onDesktop);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      desktop?.removeEventListener('change', onDesktop);
      button?.focus();
    };
  }, [drawerOpen]);

  // Opened by hover, the first click keeps it open (the pointer was already there); opened by click, it toggles.
  // Decided inside the updater: a hover's update may not have rendered yet when the click runs.
  const toggleMenu = (label: string) => {
    const keepOpen = openedByHover.current;
    openedByHover.current = false;
    setOpenMenu((current) => (current === label ? (keepOpen ? label : null) : label));
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-lg border-b border-[#E5E7EB] shadow-sm dark:bg-fd-background/80 dark:border-fd-border'
            : 'bg-white/95 backdrop-blur-sm border-b border-transparent dark:bg-fd-background/95'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-16">
            <Logo full />

            {/* Desktop (lg and up): menus and links, mock N1–N3 */}
            <nav aria-label="Site" className="hidden lg:flex flex-1 items-center gap-0.5">
              {HEADER_NAV.map((entry) =>
                isHeaderMenu(entry) ? (
                  <DesktopMenu
                    key={entry.label}
                    menu={entry}
                    open={openMenu === entry.label}
                    onHover={() => {
                      openedByHover.current = true;
                      setOpenMenu(entry.label);
                    }}
                    onLeave={() => {
                      openedByHover.current = false;
                      setOpenMenu((current) => (current === entry.label ? null : current));
                    }}
                    onToggle={() => toggleMenu(entry.label)}
                    triggerRef={(el) => {
                      if (el) triggers.current.set(entry.label, el);
                    }}
                  />
                ) : (
                  <a
                    key={entry.label}
                    href={publicHref(entry.href, signedIn)}
                    className="flex h-8 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-[#425466] transition-colors hover:bg-[#f1f3f5] hover:text-[#0A2540] dark:text-fd-muted-foreground dark:hover:bg-fd-muted dark:hover:text-fd-foreground"
                  >
                    {entry.label}
                  </a>
                ),
              )}
            </nav>

            {/* Desktop: theme switch, Log in, primary CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <ThemeSwitch />
              {!dashboardHref && (
                <a
                  href={LOGIN_LINK.href}
                  className="flex h-8 items-center whitespace-nowrap rounded-md px-3 text-sm font-semibold text-[#0A2540] hover:bg-[#f1f3f5] dark:text-fd-foreground dark:hover:bg-fd-muted"
                >
                  {LOGIN_LINK.label}
                </a>
              )}
              <a
                href={cta.href}
                className="flex h-8 items-center whitespace-nowrap rounded-md px-3 text-sm font-semibold text-white bg-[#155DFC] hover:bg-[#1047C9] transition-colors duration-150"
              >
                {cta.label}
              </a>
            </div>

            {/* Below lg: the CTA and the drawer button */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={cta.href}
                className="flex h-8 items-center whitespace-nowrap rounded-md px-3 text-sm font-semibold text-white bg-[#155DFC] hover:bg-[#1047C9] transition-colors duration-150"
              >
                {cta.label}
              </a>
              <button
                ref={drawerButton}
                type="button"
                className="flex h-8 w-8 items-center justify-center -mr-1 text-[#0A2540] dark:text-fd-foreground"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                aria-controls="site-nav-drawer"
              >
                <NavIconSvg name="menu" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Phone drawer, mock P1. Outside <header>: its backdrop-filter would make it the containing block
          of a fixed child (64 px tall). */}
      {drawerOpen && (
        <div
          id="site-nav-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] overflow-y-auto bg-white lg:hidden dark:bg-fd-background"
        >
          <div className="flex h-14 items-center justify-between border-b border-[#e3e8ee] px-4 dark:border-fd-border">
            <Logo full />
            <button
              ref={drawerClose}
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center -mr-1 text-[#0A2540] dark:text-fd-foreground"
            >
              <NavIconSvg name="close" className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 pb-8 pt-1">
            {HEADER_NAV.map((entry) =>
              isHeaderMenu(entry) ? (
                <DrawerMenu key={entry.label} menu={entry} onNavigate={() => setDrawerOpen(false)} />
              ) : (
                <a
                  key={entry.label}
                  href={publicHref(entry.href, signedIn)}
                  onClick={() => setDrawerOpen(false)}
                  className="block border-b border-[#e3e8ee] py-3 text-base font-semibold text-[#0A2540] dark:border-fd-border dark:text-fd-foreground"
                >
                  {entry.label}
                </a>
              ),
            )}
            <div className="py-3">
              <ThemeSwitch large />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <a
                href={cta.href}
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 items-center justify-center rounded-md text-sm font-semibold text-white bg-[#155DFC] hover:bg-[#1047C9] transition-colors"
              >
                {cta.label}
              </a>
              {!dashboardHref && (
                <a
                  href={LOGIN_LINK.href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 items-center justify-center rounded-md border border-[#d8dee4] text-sm font-semibold text-[#0A2540] dark:border-fd-border dark:text-fd-foreground"
                >
                  {LOGIN_LINK.label}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
