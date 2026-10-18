'use client';

import { DASHBOARD_LABEL, LOGIN_LINK, SIGNUP_LINK } from '@/config/site-nav';
import { useDashboardHref } from '@/lib/signed-in';
import { Logo } from '@/components/logo';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function DocsHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setOpenSearch } = useSearchContext();
  // The theme is only known in the browser: render the server's icon until mounted, or
  // hydration fails for visitors whose OS is dark (React #418).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';
  const dashboardHref = useDashboardHref();
  const cta = dashboardHref ? { label: DASHBOARD_LABEL, href: dashboardHref } : SIGNUP_LINK;

  return (
    <header className="bg-fd-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 sm:gap-4 px-4 sm:px-5 max-w-[1536px] mx-auto">
      {/* Left: Logo (the affitor.com wordmark, links home) */}
      <Logo />

      {/* Center: wide search (Mintlify-style); an icon button on phones */}
      <div className="flex-1 flex justify-end sm:justify-center sm:px-6">
        <button
          onClick={() => setOpenSearch(true)}
          aria-label="Search"
          className="flex items-center justify-center sm:justify-start gap-2 h-9 w-9 sm:w-full max-w-[440px] rounded-lg border border-fd-border bg-fd-muted/40 sm:px-3.5 text-[13px] text-fd-muted-foreground hover:border-fd-muted-foreground/30 transition-colors cursor-text"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-100 sm:opacity-50"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="hidden sm:inline opacity-70">Search...</span>
          <span className="ml-auto hidden sm:flex gap-0.5 text-[11px] opacity-50">
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5 font-sans">
              ⌘
            </kbd>
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5 font-sans">
              K
            </kbd>
          </span>
        </button>
      </div>

      {/* Right: Log in + CTA (Go to Dashboard when signed in) + theme toggle (Changelog lives in the tab row, not here).
          Under 360 px only the CTA stays, so the header fits a 320 px screen; the theme follows the system there. */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {!dashboardHref && (
          <a
            href={LOGIN_LINK.href}
            className="max-[359px]:hidden whitespace-nowrap text-[13px] font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            {LOGIN_LINK.label}
          </a>
        )}
        <a
          href={cta.href}
          className="inline-flex items-center whitespace-nowrap h-8 rounded-lg bg-[#155DFC] px-2.5 sm:px-3.5 text-[12px] sm:text-[13px] font-medium text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#1047C9] active:scale-[0.97]"
        >
          {cta.label}
        </a>

        {/* Theme toggle — Son's existing sun/moon icon, kept verbatim */}
        <button
          onClick={() =>
            setTheme(isDark ? 'light' : 'dark')
          }
          className="max-[359px]:hidden rounded-md p-1.5 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
      </div>
    </header>
  );
}
