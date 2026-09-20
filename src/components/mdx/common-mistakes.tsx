import { renderInlineMarkdown } from './inline-markdown';

export function CommonMistakes({ title = 'Common mistakes', items }: { title?: string; items: string[] }) {
  return (
    <div className="docs-common-mistakes not-prose">
      <div className="docs-block-label">{title}</div>
      <ul>
        {items.map((item) => (
          // The li is a flex row (::before marker + text). Keep the rendered
          // fragments in one span so they stay a single flex item and flow as
          // a sentence instead of being spread by the row gap.
          <li key={item}>
            <span>{renderInlineMarkdown(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
