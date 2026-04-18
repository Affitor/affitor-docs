type Section = {
  title: string;
  items?: string[];
};

function VerifyCard({ title, items = [] }: Section) {
  if (items.length === 0) return null;
  return (
    <div className="docs-verify-card">
      <div className="docs-verify-title">{title}</div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function VerifySuccess({
  browser,
  network,
  dashboard,
  ifNotWorking,
}: {
  browser?: string[];
  network?: string[];
  dashboard?: string[];
  ifNotWorking?: string[];
}) {
  return (
    <div className="docs-verify not-prose">
      <div className="docs-block-label">Verify success</div>
      <div className="docs-verify-grid">
        <VerifyCard title="Browser" items={browser} />
        <VerifyCard title="Network" items={network} />
        <VerifyCard title="Dashboard" items={dashboard} />
        <VerifyCard title="If it doesn't work" items={ifNotWorking} />
      </div>
    </div>
  );
}
