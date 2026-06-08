'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function DocsHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setOpenSearch } = useSearchContext();

  return (
    <header className="flex h-14 items-center gap-4 bg-fd-background/80 backdrop-blur-md px-5">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <img
          src="/affitor-logo.svg"
          alt="Affitor"
          style={{ height: '22px', width: 'auto' }}
        />
      </Link>

      {/* Center: wide search (Mintlify-style) */}
      <div className="flex-1 flex justify-center px-6">
        <button
          onClick={() => setOpenSearch(true)}
          className="flex items-center gap-2 h-9 w-full max-w-[440px] rounded-lg border border-fd-border bg-fd-muted/40 px-3.5 text-[13px] text-fd-muted-foreground hover:border-fd-muted-foreground/30 transition-colors cursor-text"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-50"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="opacity-70">Search...</span>
          <span className="ml-auto flex gap-0.5 text-[11px] opacity-50">
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5 font-sans">
              ⌘
            </kbd>
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5 font-sans">
              K
            </kbd>
          </span>
        </button>
      </div>

      {/* Right: nav + CTA + theme toggle (Changelog lives in the tab row, not here) */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="https://affitor.com/affiliate-management"
          className="text-[13px] font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors hidden md:block"
        >
          Dashboard
        </Link>
        <Link
          href="/advertisers/quickstart/create-account"
          className="hidden sm:inline-flex items-center gap-1 h-8 rounded-md bg-fd-primary px-3.5 text-[13px] font-medium text-fd-primary-foreground transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
        >
          Get Started
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="-mr-0.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        {/* Theme toggle — Son's existing sun/moon icon, kept verbatim */}
        <button
          onClick={() =>
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          }
          className="rounded-md p-1.5 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted transition-colors"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
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
    </header>
  );
}
