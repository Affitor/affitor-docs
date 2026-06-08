'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function DocsHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setOpenSearch } = useSearchContext();

  return (
    <header className="sticky top-0 z-50 flex h-12 items-center gap-4 border-b border-fd-border bg-fd-background/80 backdrop-blur-md px-5">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <img
          src="/affitor-logo.svg"
          alt="Affitor"
          style={{ height: '20px', width: 'auto' }}
        />
      </Link>

      <div className="flex-1" />

      {/* Right: compact search + nav + CTA + theme toggle */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Compact search trigger (right-aligned, Linear-style) */}
        <button
          onClick={() => setOpenSearch(true)}
          className="hidden sm:flex items-center gap-2 h-8 w-[210px] rounded-md border border-fd-border bg-fd-muted/50 px-2.5 text-[13px] text-fd-muted-foreground hover:border-fd-muted-foreground/30 transition-colors cursor-text"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-50"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="opacity-70">Search…</span>
          <span className="ml-auto flex gap-0.5 text-[11px] opacity-50">
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5 font-sans">
              ⌘
            </kbd>
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5 font-sans">
              K
            </kbd>
          </span>
        </button>

        <Link
          href="/changelog"
          className="text-[13px] font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors hidden sm:block"
        >
          Changelog
        </Link>
        <Link
          href="https://affitor.com/affiliate-management"
          className="text-[13px] font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors hidden sm:block"
        >
          Dashboard
        </Link>
        <Link
          href="/advertisers/quickstart/create-account"
          className="hidden sm:inline-flex items-center h-8 rounded-md bg-fd-primary px-3.5 text-[13px] font-medium text-fd-primary-foreground transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
        >
          Get Started
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
