import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    description: 'Learn what Affitor is, how it works, and our pricing model.',
    href: '/docs/getting-started/what-is-affitor',
  },
  {
    title: 'Advertiser Guide',
    description: 'Set up your program, define commissions, and manage partners.',
    href: '/docs/advertisers/quickstart/create-account',
  },
  {
    title: 'Tracking & Integration',
    description: 'Implement click, signup, and payment tracking with Stripe.',
    href: '/docs/advertisers/tracking/tracking-overview',
  },
  {
    title: 'FAQ & Support',
    description: 'Common questions answered. Contact our team.',
    href: '/docs/faq',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-medium tracking-tight text-fd-foreground">
          Affitor Documentation
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
          Build and scale affiliate programs for your SaaS.
        </p>

        <div className="mt-4">
          <Link
            href="/docs/getting-started/what-is-affitor"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-foreground underline underline-offset-4 decoration-fd-muted-foreground/50 hover:decoration-fd-foreground transition-colors"
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-16 space-y-0 divide-y divide-fd-border">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group flex items-center justify-between py-5 transition-colors"
            >
              <div>
                <h2 className="text-sm font-medium text-fd-foreground">
                  {section.title}
                </h2>
                <p className="mt-1 text-xs text-fd-muted-foreground">
                  {section.description}
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        <p className="mt-16 text-xs text-fd-muted-foreground">
          Can&apos;t find what you need?{' '}
          <Link
            href="/docs/support/contact"
            className="text-fd-foreground underline underline-offset-4 decoration-fd-muted-foreground/50 hover:decoration-fd-foreground"
          >
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}
