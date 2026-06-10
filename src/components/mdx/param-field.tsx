import type { ReactNode } from 'react';

/**
 * <ParamList> + <ParamField> — Mintlify-style parameter documentation rows.
 *
 * Usage in MDX:
 *   <ParamList>
 *     <ParamField name="transaction_id" type="string" required>
 *       Your unique payment identifier.
 *     </ParamField>
 *     <ParamField name="currency" type="string" requirement="optional" enum={['USD','EUR','VND']}>
 *       ISO 4217 currency code. Defaults to USD.
 *     </ParamField>
 *   </ParamList>
 *
 * Props:
 *   name        — parameter name (rendered in mono)
 *   type        — type label (rendered in muted mono)
 *   required    — boolean shorthand for requirement="required"
 *   requirement — "required" | "conditional" | "optional" (default "optional")
 *   enum        — string[] of allowed values, shown as inline code chips
 *   children    — description (MDX content)
 */

type Requirement = 'required' | 'conditional' | 'optional';

export function ParamList({ children }: { children: ReactNode }) {
  return <div className="docs-param-list">{children}</div>;
}

export function ParamField({
  name,
  type,
  required,
  requirement,
  enum: enumValues,
  children,
}: {
  name: string;
  type?: string;
  required?: boolean;
  requirement?: Requirement;
  enum?: string[];
  children?: ReactNode;
}) {
  const req: Requirement = required ? 'required' : (requirement ?? 'optional');

  const pillClass =
    req === 'required'
      ? 'docs-param-pill docs-param-pill--required'
      : req === 'conditional'
        ? 'docs-param-pill docs-param-pill--conditional'
        : 'docs-param-pill docs-param-pill--optional';

  const pillLabel =
    req === 'required' ? 'Required' : req === 'conditional' ? 'Conditional' : 'Optional';

  return (
    <div className="docs-param-row">
      <div className="docs-param-row-header">
        <span className="docs-param-name">{name}</span>
        {type && <span className="docs-param-type">{type}</span>}
        <span className={pillClass}>{pillLabel}</span>
      </div>
      {children && <div className="docs-param-desc">{children}</div>}
      {enumValues && enumValues.length > 0 && (
        <div className="docs-param-enum">
          {enumValues.map((v) => (
            <code key={v} className="docs-param-enum-chip">
              {v}
            </code>
          ))}
        </div>
      )}
    </div>
  );
}
