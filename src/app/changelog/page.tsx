import type { Metadata } from 'next';
import { changelog } from '@/../.source/server';
import { useMDXComponents } from '@/../mdx-components';
import { DocsShell } from '@/components/docs-shell';
import { ChangelogEntry } from '@/components/changelog/entry';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'New features, improvements, and fixes shipped on Affitor — written for the people using the product, not the team building it.',
  openGraph: {
    title: 'Affitor Changelog',
    description:
      'Every meaningful change to Affitor, with the user benefit up front.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affitor Changelog',
    description:
      'Every meaningful change to Affitor, with the user benefit up front.',
  },
};

type Entry = (typeof changelog)[number];

function byDateDesc(a: Entry, b: Entry) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export default function ChangelogPage() {
  const components = useMDXComponents({});
  const entries = [...changelog].sort(byDateDesc);

  return (
    <DocsShell>
      <div className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
        <header className="mb-16 md:mb-20">
          <p className="text-[13px] font-medium uppercase tracking-wider text-fd-primary mb-3">
            Changelog
          </p>
          <h1 className="text-[40px] md:text-[48px] leading-[1.05] font-semibold tracking-tight text-fd-foreground mb-4">
            What&rsquo;s new on Affitor
          </h1>
          <p className="text-[17px] leading-relaxed text-fd-muted-foreground max-w-xl">
            Features, improvements, and fixes — written for the people using
            the product. Updated whenever something ships that changes how
            Affitor feels to use.
          </p>
        </header>

        <div>
          {entries.map((entry) => {
            const Body = entry.body;
            return (
              <ChangelogEntry
                key={entry.info.path}
                date={entry.date as string}
                title={entry.title as string}
                category={entry.category as string}
                benefit={entry.benefit as string}
                sourcePR={entry.sourcePR as string | undefined}
              >
                <Body components={components} />
              </ChangelogEntry>
            );
          })}
        </div>
      </div>
    </DocsShell>
  );
}
