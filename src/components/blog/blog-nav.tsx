'use client';

import { useEffect, useState } from 'react';
import { DASHBOARD_LABEL, HEADER_LINKS, LOGIN_LINK, SIGNUP_LINK } from '@/config/site-nav';
import { useDashboardHref } from '@/lib/signed-in';
import { Logo } from '@/components/logo';
import { ThemeSwitch } from '@/components/theme-switch';

/**
 * The affitor.com header (affiliate-dashboard LandingRedesign/Navbar) for the blog and the
 * changelog: logo, center pill nav, Log in + Create free account (Go to Dashboard when signed in),
 * plus the theme switch.
 * Data lives in src/config/site-nav.ts. Mobile mirrors home: Marketplace and Pricing inline,
 * the rest in the toggle menu.
 */
const MOBILE_INLINE = HEADER_LINKS.filter((link) => link.label === 'Marketplace' || link.label === 'Pricing');
const MOBILE_MENU = HEADER_LINKS.filter((link) => !MOBILE_INLINE.includes(link));

export function BlogNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dashboardHref = useDashboardHref();
  const cta = dashboardHref ? { label: DASHBOARD_LABEL, href: dashboardHref } : SIGNUP_LINK;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-[#E5E7EB] shadow-sm dark:bg-fd-background/80 dark:border-fd-border'
          : 'bg-white/95 backdrop-blur-sm border-b border-transparent dark:bg-fd-background/95'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop: center pill nav */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center rounded-full px-1.5 py-1.5 bg-[#F3F4F6] dark:bg-fd-muted">
              {HEADER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="whitespace-nowrap px-4 py-1.5 text-sm font-medium text-[#425466] hover:text-[#0A2540] rounded-full hover:bg-white transition-all duration-150 dark:text-fd-muted-foreground dark:hover:text-fd-foreground dark:hover:bg-fd-secondary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Desktop: theme switch, Log in, primary CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeSwitch />
            {!dashboardHref && (
              <a
                href={LOGIN_LINK.href}
                className="whitespace-nowrap px-4 py-2 text-sm font-medium text-[#425466] hover:text-[#0A2540] transition-colors duration-150 dark:text-fd-muted-foreground dark:hover:text-fd-foreground"
              >
                {LOGIN_LINK.label}
              </a>
            )}
            <a
              href={cta.href}
              className="whitespace-nowrap px-6 py-2 text-sm font-medium text-white bg-[#155DFC] hover:bg-[#1047C9] rounded-lg transition-colors duration-150"
            >
              {cta.label}
            </a>
          </div>

          {/* Mobile: Marketplace and Pricing inline, then the menu toggle */}
          <div className="flex lg:hidden items-center gap-1">
            {MOBILE_INLINE.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-2 py-1.5 text-sm font-medium text-[#425466] hover:text-[#0A2540] dark:text-fd-muted-foreground dark:hover:text-fd-foreground"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="p-2 -mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-6 h-6 text-[#0A2540] dark:text-fd-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E5E7EB] dark:border-fd-border">
            <div className="flex flex-col gap-1">
              {MOBILE_MENU.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-[#425466] hover:text-[#0A2540] hover:bg-[#F3F4F6] rounded-lg dark:text-fd-muted-foreground dark:hover:text-fd-foreground dark:hover:bg-fd-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-3 pt-2">
                <ThemeSwitch large />
              </div>
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#E5E7EB] dark:border-fd-border">
                {!dashboardHref && (
                  <a
                    href={LOGIN_LINK.href}
                    className="px-3 py-2 text-sm font-medium text-[#425466] hover:text-[#0A2540] dark:text-fd-muted-foreground dark:hover:text-fd-foreground"
                  >
                    {LOGIN_LINK.label}
                  </a>
                )}
                <a
                  href={cta.href}
                  className="px-6 py-3 text-sm font-medium text-white bg-[#155DFC] hover:bg-[#1047C9] rounded-lg text-center transition-colors duration-150"
                >
                  {cta.label}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
