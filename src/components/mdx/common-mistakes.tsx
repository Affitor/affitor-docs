export function CommonMistakes({ title = 'Common mistakes', items }: { title?: string; items: string[] }) {
  return (
    <div className="docs-common-mistakes not-prose">
      <div className="docs-block-label">{title}</div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
