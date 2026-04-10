'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function DocsHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setOpenSearch } = useSearchContext();

  return (
    <header className="sticky top-0 z-50 flex h-12 items-center border-b border-fd-border bg-fd-background/95 backdrop-blur-sm px-4">
      {/* Left: Logo */}
      <Link href="/docs" className="flex items-center gap-2 shrink-0">
        <img src="/affitor-logo.svg" alt="Affitor" style={{ height: '24px', width: 'auto' }} />
      </Link>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-4">
        <button
          onClick={() => setOpenSearch(true)}
          className="flex items-center gap-2 rounded-lg border border-fd-border bg-fd-muted/50 px-4 py-1.5 text-sm text-fd-muted-foreground hover:bg-fd-muted transition-colors w-full max-w-md"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          Search...
          <span className="ml-auto flex gap-0.5 text-xs opacity-60">
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5">⌘</kbd>
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5">K</kbd>
          </span>
        </button>
      </div>

      {/* Right: Dashboard + Get Started + Theme toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="https://affitor.com/affiliate-management"
          className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors hidden sm:block"
        >
          Dashboard
        </Link>
        <Link
          href="/docs/advertisers/quickstart/create-account"
          className="rounded-lg bg-fd-primary px-4 py-1.5 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition-opacity hidden sm:block"
        >
          Get Started
        </Link>
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="rounded-lg p-2 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted transition-colors"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
