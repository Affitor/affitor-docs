export function NextStep({
  title,
  description,
  href,
  ctaLabel = 'Continue',
}: {
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
}) {
  return (
    <div className="docs-next-step not-prose">
      <div>
        <div className="docs-block-label">Next recommended step</div>
        <div className="docs-next-title">{title}</div>
        <p>{description}</p>
      </div>
      <a href={href} className="docs-next-link">
        {ctaLabel} →
      </a>
    </div>
  );
}
