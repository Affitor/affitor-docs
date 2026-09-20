import type { ReactNode } from 'react';

/**
 * Render the inline markdown inside a plain-string prop.
 *
 * Components that take their content as `string[]` props (VerifySuccess,
 * CommonMistakes) never reach the MDX pipeline, so authors writing `code`,
 * **bold** or [links](/path) in those strings would otherwise see the source
 * characters on the published page. Handles those three; everything else is
 * emitted as text.
 */
export function renderInlineMarkdown(text: string): ReactNode {
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  const out: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) out.push(text.slice(cursor, match.index));

    const [raw, code, bold, linkText, href] = match;
    const key = `${match.index}-${raw.length}`;

    if (code !== undefined) {
      out.push(<code key={key}>{code}</code>);
    } else if (bold !== undefined) {
      out.push(<strong key={key}>{bold}</strong>);
    } else {
      out.push(
        <a key={key} href={href}>
          {linkText}
        </a>,
      );
    }

    cursor = match.index + raw.length;
  }

  if (cursor < text.length) out.push(text.slice(cursor));
  return out.length > 0 ? out : text;
}
