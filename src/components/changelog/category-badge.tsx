const CATEGORY_DOT: Record<string, string> = {
  Dashboard: '#155DFC',
  Tracking: '#0EA5E9',
  CMS: '#8B5CF6',
  CLI: '#10B981',
  Docs: '#F59E0B',
  OpenAffiliate: '#EC4899',
  Bugfix: '#EF4444',
};

export function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_DOT[category] ?? '#6B7280';
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-fd-muted-foreground">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {category}
    </span>
  );
}
