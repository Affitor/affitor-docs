import { ASK_AI_PROMPT, FOOTER_COLUMNS, FOOTER_TAGLINE, SOCIAL_LINKS } from '@/config/site-nav';
import { ENGINES } from '@/components/blog/ask-ai-row';
import { Logo } from '@/components/logo';
import { AskAiLink } from '@/components/ask-ai-link';
import { PublicLink } from '@/components/public-link';

/**
 * The affitor.com footer (affiliate-dashboard LandingRedesign/Footer) for the docs, the blog
 * and the changelog. Data lives in src/config/site-nav.ts.
 */
const MUTED = 'text-[#425466] hover:text-[#0A2540] transition-colors duration-150 dark:text-fd-muted-foreground dark:hover:text-fd-foreground';
const ASK_AI_Q = encodeURIComponent(ASK_AI_PROMPT);

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] dark:bg-fd-background dark:border-fd-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Logo full />
            <p className="text-sm text-[#425466] mt-3 max-w-xs dark:text-fd-muted-foreground">{FOOTER_TAGLINE}</p>
            <div className="mt-6">
              <p className="text-sm font-semibold text-[#0A2540] mb-3 dark:text-fd-foreground">Ask AI about Affitor</p>
              <div className="flex items-center gap-2">
                {ENGINES.map((engine) => (
                  <AskAiLink
                    key={engine.name}
                    engine={engine.key}
                    href={engine.base + ASK_AI_Q}
                    label={`Ask ${engine.name} about Affitor`}
                    className="w-9 h-9 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center text-[#425466] hover:text-[#0A2540] hover:border-[#c7cdd6] hover:-translate-y-0.5 transition-all duration-150 dark:bg-fd-background dark:border-fd-border dark:text-fd-muted-foreground dark:hover:text-fd-foreground"
                  >
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
                      <path d={engine.path} />
                    </svg>
                  </AskAiLink>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-[#0A2540] mb-4 dark:text-fd-foreground">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <PublicLink href={link.href} className={`text-sm ${MUTED}`}>
                      {link.label}
                    </PublicLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Socials and copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[#E5E7EB] dark:border-fd-border">
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className={MUTED} aria-label="X">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={MUTED} aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <p className="text-sm text-[#425466] dark:text-fd-muted-foreground">
            &copy; {new Date().getFullYear()} Affitor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
