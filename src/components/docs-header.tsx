'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function DocsHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setOpenSearch } = useSearchContext();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b border-fd-border bg-fd-background/95 backdrop-blur-sm px-6">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <img
          src="/affitor-logo.svg"
          alt="Affitor"
          style={{ height: '22px', width: 'auto' }}
        />
      </Link>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-8">
        <button
          onClick={() => setOpenSearch(true)}
          className="flex items-center gap-2 rounded-md border border-fd-border bg-fd-muted/50 px-3.5 py-1.5 text-[13px] text-fd-muted-foreground hover:bg-fd-muted transition-colors w-full max-w-sm cursor-text"
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
          <span className="opacity-60">Search...</span>
          <span className="ml-auto flex gap-0.5 text-[11px] opacity-40">
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5 font-sans">
              ⌘
            </kbd>
            <kbd className="rounded border border-fd-border bg-fd-background px-1.5 py-0.5 font-sans">
              K
            </kbd>
          </span>
        </button>
      </div>

      {/* Right: Dashboard + Get Started + Theme toggle */}
      <div className="flex items-center gap-4 shrink-0">
        <Link
          href="https://affitor.com/affiliate-management"
          className="text-[13px] font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors hidden sm:block"
        >
          Dashboard
        </Link>
        <Link
          href="/advertisers/quickstart/create-account"
          className="rounded-md bg-fd-primary px-3.5 py-1.5 text-[13px] font-medium text-fd-primary-foreground hover:opacity-90 transition-opacity hidden sm:block"
        >
          Get Started
        </Link>
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
