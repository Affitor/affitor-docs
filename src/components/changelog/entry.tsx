import type { ReactNode } from 'react';
import { CategoryBadge } from './category-badge';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    short: `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`,
    year: String(d.getUTCFullYear()),
  };
}

export function ChangelogEntry({
  date,
  title,
  category,
  benefit,
  sourcePR,
  children,
}: {
  date: string;
  title: string;
  category: string;
  benefit: string;
  sourcePR?: string;
  children: ReactNode;
}) {
  const { short, year } = formatDate(date);
  return (
    <article className="relative grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 md:gap-12 pb-20 md:pb-24 last:pb-0">
      {/* Date column */}
      <div className="md:sticky md:top-20 md:self-start">
        <div className="text-[13px] font-medium text-fd-foreground">{short}</div>
        <div className="text-[12px] text-fd-muted-foreground">{year}</div>
      </div>

      {/* Content column */}
      <div className="relative md:border-l md:border-fd-border md:pl-12 -ml-px">
        {/* Timeline node */}
        <span
          className="hidden md:block absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-fd-background ring-2 ring-fd-border"
          aria-hidden
        />

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <CategoryBadge category={category} />
          {sourcePR ? (
            <a
              href={sourcePR}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              View source
            </a>
          ) : null}
        </div>

        <h2 className="text-[26px] leading-tight font-semibold tracking-tight text-fd-foreground mb-3">
          {title}
        </h2>

        <p className="text-[16px] leading-relaxed text-fd-muted-foreground mb-6">
          {benefit}
        </p>

        <div className="prose prose-sm dark:prose-invert max-w-none text-fd-foreground/90 [&_p]:leading-relaxed [&_a]:text-fd-primary [&_a]:no-underline hover:[&_a]:underline">
          {children}
        </div>
      </div>
    </article>
  );
}
