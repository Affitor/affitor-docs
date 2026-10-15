'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const OPTIONS = [
  {
    value: 'system',
    label: 'System theme',
    icon: <path d="M3 5h18v11H3zM8 20h8M12 16v4" />,
  },
  {
    value: 'light',
    label: 'Light theme',
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  },
  {
    value: 'dark',
    label: 'Dark theme',
    icon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  },
] as const;

/**
 * System / Light / Dark switch for the blog and changelog header (next-themes, shared with
 * the docs). `large` gives 44 px touch targets for the mobile menu.
 */
export function ThemeSwitch({ large = false }: { large?: boolean }) {
  const { theme, setTheme } = useTheme();
  // The stored choice is only known in the browser; render no pressed state until then.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center rounded-full border border-[#E5E7EB] p-0.5 dark:border-fd-border"
    >
      {OPTIONS.map((option) => {
        const active = mounted && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={active}
            onClick={() => setTheme(option.value)}
            className={`inline-flex ${large ? 'h-11 w-11' : 'h-7 w-7'} items-center justify-center rounded-full transition-colors duration-150 ${
              active
                ? 'bg-[#F3F4F6] text-[#0A2540] dark:bg-fd-secondary dark:text-fd-foreground'
                : 'text-[#6B7280] hover:text-[#0A2540] dark:text-fd-muted-foreground dark:hover:text-fd-foreground'
            }`}
          >
            <svg viewBox="0 0 24 24" width={large ? 18 : 15} height={large ? 18 : 15} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {option.icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
