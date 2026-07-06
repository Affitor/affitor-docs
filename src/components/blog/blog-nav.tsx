'use client';

import { useState } from 'react';

/**
 * Marketing top bar for blog pages — recreates affitor.com's landing navbar
 * (white bar, center pill nav, blue Sign In CTA) inside the docs app.
 * No search, no docs tabs, no sidebar.
 *
 * `docsBase` is passed from the server shell (same pattern as DocsHeader) so
 * the logo asset resolves on the docs host when the blog is proxied at
 * affitor.com/blog, without client/server env drift.
 */
const NAV_LINKS: { label: string; href: string; active?: boolean }[] = [
  { label: 'Marketplace', href: 'https://affitor.com/marketplace' },
  { label: 'About', href: 'https://affitor.com/about' },
  { label: 'Docs', href: 'https://docs.affitor.com' },
  // /blog is the one namespace that exists on both hosts — keep it relative.
  { label: 'Blog', href: '/blog', active: true },
];

export function BlogNav({ docsBase = '' }: { docsBase?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] dark:bg-fd-background/80 dark:border-fd-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo → main site */}
          <a href="https://affitor.com" className="flex items-center shrink-0" aria-label="Affitor">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${docsBase}/affitor-logo.svg`}
              alt="Affitor"
              style={{ height: '22px', width: 'auto' }}
            />
          </a>

          {/* Center pill nav (landing style) */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center rounded-full px-1.5 py-1.5 bg-[#F3F4F6] dark:bg-fd-muted">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={link.active ? 'page' : undefined}
                  className={
                    link.active
                      ? 'px-4 py-1.5 text-sm font-medium text-[#0A2540] bg-white shadow-sm rounded-full dark:bg-fd-secondary dark:text-fd-foreground'
                      : 'px-4 py-1.5 text-sm font-medium text-[#425466] hover:text-[#0A2540] rounded-full hover:bg-white transition-all duration-150 dark:text-fd-muted-foreground dark:hover:text-fd-foreground dark:hover:bg-fd-secondary'
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Right: Sign In pill CTA (landing blue) */}
          <div className="hidden md:flex items-center">
            <a
              href="https://affitor.com"
              className="px-5 py-2 text-sm font-medium text-white bg-[#155DFC] hover:bg-[#1047C9] rounded-full transition-colors duration-150"
            >
              Sign In
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E5E7EB] dark:border-fd-border">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={
                    link.active
                      ? 'px-3 py-2 text-sm font-medium text-[#0A2540] bg-[#F3F4F6] rounded-lg dark:text-fd-foreground dark:bg-fd-muted'
                      : 'px-3 py-2 text-sm font-medium text-[#425466] hover:text-[#0A2540] hover:bg-[#F3F4F6] rounded-lg dark:text-fd-muted-foreground dark:hover:text-fd-foreground dark:hover:bg-fd-muted'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://affitor.com"
                className="mt-3 px-5 py-2.5 text-sm font-medium text-white bg-[#155DFC] hover:bg-[#1047C9] rounded-full text-center transition-colors duration-150"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
