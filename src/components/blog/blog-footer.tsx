import { docsBase } from '@/lib/site';

/**
 * Compact marketing footer for blog pages — landing's muted link style.
 * Changelog lives on the docs host, so it goes through `docsBase` to survive
 * the affitor.com/blog proxy; the rest are absolute already.
 */
const FOOTER_LINKS = [
  { label: 'Docs', href: 'https://docs.affitor.com' },
  { label: 'Changelog', href: `${docsBase}/changelog` },
  { label: 'About', href: 'https://affitor.com/about' },
  { label: 'X @affitor_ai', href: 'https://x.com/affitor_ai' },
];

export function BlogFooter() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] dark:bg-fd-background dark:border-fd-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#425466] dark:text-fd-muted-foreground">
          &copy; {new Date().getFullYear()} Affitor. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#425466] hover:text-[#0A2540] transition-colors duration-150 dark:text-fd-muted-foreground dark:hover:text-fd-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
