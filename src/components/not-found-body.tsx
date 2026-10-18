import { SITE_URL } from '@/lib/site';
import { PublicLink } from '@/components/public-link';

const LINKS = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Affitor home', href: SITE_URL },
];

/** 404 content shared by the site-wide and the docs not-found pages. */
export function NotFoundBody() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
      <p className="text-sm font-medium text-fd-primary">404</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-[#0A2540] dark:text-fd-foreground">
        Page not found
      </h1>
      <p className="mt-4 text-base text-[#425466] dark:text-fd-muted-foreground">
        The page you are looking for does not exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {LINKS.map((link, i) => (
          <PublicLink
            key={link.label}
            href={link.href}
            className={
              i === 0
                ? 'px-5 py-2.5 text-sm font-medium text-white bg-[#155DFC] hover:bg-[#1047C9] rounded-lg transition-colors'
                : 'px-5 py-2.5 text-sm font-medium text-[#0A2540] border border-[#d8dee4] hover:bg-[#F3F4F6] rounded-lg transition-colors dark:text-fd-foreground dark:border-fd-border dark:hover:bg-fd-muted'
            }
          >
            {link.label}
          </PublicLink>
        ))}
      </div>
    </div>
  );
}
