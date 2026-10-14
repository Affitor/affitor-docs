import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

/**
 * Comparison components take a plain markdown table as children, so the `.md` twin stays a
 * readable table. A cell is `main` or `main<br />sub`; each component decides what `sub` is
 * (a qualifier, a sub-line or a tooltip). A link in `main` gives `href`.
 */
export type Cell = { main: string; sub: string; href?: string };

type El = ReactElement<{ children?: ReactNode; href?: string }>;

function elements(node: ReactNode): El[] {
  return Children.toArray(node).filter(isValidElement) as El[];
}

function find(node: ReactNode, type: string, out: El[] = []): El[] {
  for (const el of elements(node)) {
    if (el.type === type) out.push(el);
    else find(el.props.children, type, out);
  }
  return out;
}

export function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) return textOf((node as El).props.children);
  return '';
}

function hrefOf(node: ReactNode): string | undefined {
  for (const el of elements(node)) {
    const href = el.props.href ?? hrefOf(el.props.children);
    if (href) return href;
  }
  return undefined;
}

function readCell(el: El): Cell {
  const parts: ReactNode[][] = [[]];
  for (const child of Children.toArray(el.props.children)) {
    if (isValidElement(child) && child.type === 'br') parts.push([]);
    else parts[parts.length - 1].push(child);
  }
  const clean = (nodes: ReactNode[] = []) => textOf(nodes).replace(/\s+/g, ' ').trim();
  return { main: clean(parts[0]), sub: clean(parts.slice(1).flat()), href: hrefOf(parts[0]) };
}

/** The first row is the header; every other row is a body row. */
export function readTable(children: ReactNode): { head: Cell[]; rows: Cell[][] } {
  const rows = find(children, 'tr').map((tr) =>
    elements(tr.props.children)
      .filter((cell) => cell.type === 'th' || cell.type === 'td')
      .map(readCell),
  );
  if (rows.length < 2) throw new Error('Comparison table needs a markdown table with a header and rows');
  const [head, ...body] = rows;
  for (const row of body) {
    if (row.length !== head.length) throw new Error(`Row "${row[0]?.main}" has ${row.length} cells, header has ${head.length}`);
  }
  return { head, rows: body };
}

/** Markdown list items as plain text, e.g. "**Label:** a, b" -> "Label: a, b". */
export function readList(children: ReactNode): string[] {
  return find(children, 'li').map((li) => textOf(li.props.children).replace(/\s+/g, ' ').trim());
}
