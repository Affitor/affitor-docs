type Item = {
  text: string;
  href?: string;
};

export function Checklist({ title, items }: { title?: string; items: Item[] }) {
  return (
    <div className="docs-checklist not-prose">
      {title ? <div className="docs-block-label">{title}</div> : null}
      <ul>
        {items.map((item) => (
          <li key={`${item.text}-${item.href ?? ''}`}>
            <span className="docs-check-icon" aria-hidden="true">
              ✓
            </span>
            {item.href ? <a href={item.href}>{item.text}</a> : <span>{item.text}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
