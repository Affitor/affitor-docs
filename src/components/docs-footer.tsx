const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Affitor',
    icon: (
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/affitor',
    icon: (
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 17V9.93H6V17h2.34zM7.17 8.9a1.36 1.36 0 1 0 0-2.72 1.36 1.36 0 0 0 0 2.72zM18 17v-3.88c0-2.07-1.1-3.03-2.58-3.03-1.19 0-1.72.65-2.02 1.11V9.93h-2.34V17h2.34v-3.95c0-.21.02-.42.08-.57.17-.42.55-.85 1.2-.85.84 0 1.18.64 1.18 1.58V17H18z" />
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/affitor_ai',
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.65l-5.21-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.71 6.231 5.453-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    ),
  },
  {
    label: 'Website',
    href: 'https://affitor.com',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  },
];

export function DocsFooter() {
  return (
    <footer className="mt-16 pt-6 border-t border-fd-border flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={s.label === 'Website' ? 'none' : 'currentColor'}
              stroke={s.label === 'Website' ? 'currentColor' : 'none'}
              strokeWidth="2"
            >
              {s.icon}
            </svg>
          </a>
        ))}
      </div>
      <span className="text-[12.5px] text-fd-muted-foreground">
        © {'2026'} Affitor
      </span>
    </footer>
  );
}
