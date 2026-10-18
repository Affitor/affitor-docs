'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

/**
 * The one theme control on every channel (spec 2026-10-18 one-theme-toggle): a moon in light
 * mode, a sun in dark mode; a click flips light and dark. It replaces the System / Light / Dark
 * switch the blog and changelog had since 15/10. The first visit follows the zone default
 * (theme-root.tsx) and next-themes stores the choice once for every zone. `label` adds the action
 * as text for the mobile menu. Until mounted the theme is unknown, so an empty box of the same
 * size holds the place and the header does not move (and hydration matches, React #418).
 */
export function ThemeToggle({ label = false, className = '' }: { label?: boolean; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const size = label ? 'h-11' : 'h-8 w-8';
  if (!mounted) return <span aria-hidden className={`inline-block ${size} ${className}`} />;

  const dark = resolvedTheme === 'dark';
  const action = dark ? 'Switch to light theme' : 'Switch to dark theme';
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={action}
      title={action}
      className={`inline-flex ${size} items-center justify-center gap-2 rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc] focus-visible:ring-offset-1 focus-visible:ring-offset-fd-background ${label ? 'px-3 text-sm font-medium' : ''} ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
      {label && <span>{action}</span>}
    </button>
  );
}
