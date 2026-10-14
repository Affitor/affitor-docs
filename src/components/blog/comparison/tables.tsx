import type { ReactNode } from 'react';
import { readTable, type Cell } from './table-data';
import { OURS, tool } from './tools';
import { Icon, Logo, OURS_BG, Tip, type IconKind } from './ui';

/*
 * The three comparison tables. Each takes a markdown table as children (see table-data.ts).
 * Header cells stick below the 64px blog nav from lg up, where the tables fit without scrolling;
 * below lg the table scrolls sideways and the tool column sticks instead.
 */

const TABLE = 'w-full min-w-3xl border-collapse bg-fd-background text-sm';
const HEAD = 'bg-fd-background lg:sticky lg:top-16 lg:z-20 lg:shadow-[inset_0_-1px_0_var(--color-fd-border)]';
const TH = `${HEAD} whitespace-nowrap border-b border-l border-fd-border px-4 py-4 text-center font-medium text-fd-muted-foreground text-xs uppercase tracking-wider`;
const TH_FIRST = `${HEAD} sticky left-0 z-10 lg:z-30 min-w-52 border-b border-r border-fd-border px-6 py-4 text-left font-medium text-fd-muted-foreground text-xs uppercase tracking-wider`;
const TD = 'border-b border-l border-fd-border px-4 py-3 text-center align-middle';
const TD_FIRST = 'sticky left-0 z-10 border-b border-r border-fd-border px-6 py-3 text-left align-middle';
const TINT = 'bg-fd-primary/5';

const MARKS: Record<string, IconKind> = { Yes: 'yes', Partial: 'partial', No: 'no' };

/** Matrix cell: "Yes|Partial|No" (+ qualifier after <br />) draws an icon; anything else is muted text. */
function Mark({ cell }: { cell: Cell }) {
  const kind = MARKS[cell.main];
  if (!kind) return <span className="text-[11px] text-fd-muted-foreground/70 italic">{cell.main}</span>;
  return (
    <div className="flex items-center justify-center">
      <div className="flex h-full flex-col items-center justify-center gap-0.5">
        <Icon kind={kind} />
        {cell.sub ? (
          <span className="max-w-[90px] px-1 text-center text-[10px] text-fd-muted-foreground leading-tight">{cell.sub}</span>
        ) : null}
      </div>
    </div>
  );
}

/** First column: rank (row order, omitted when unranked), logo and the tool name linking to its pricing page. */
function ToolCell({ cell, rank, sub }: { cell: Cell; rank?: number; sub?: string }) {
  const t = tool(cell.main);
  const color = t.ours ? 'text-fd-primary' : 'text-fd-foreground';
  const name = cell.href ? (
    <a className={`font-medium text-sm hover:underline ${color}${sub ? ' block truncate' : ''}`} href={cell.href}>
      {t.name}
    </a>
  ) : (
    <span className={`font-medium text-sm ${color}`}>{t.name}</span>
  );
  return (
    <td className={`${TD_FIRST} ${t.ours ? OURS_BG : 'bg-fd-background'}${sub ? '' : ' whitespace-nowrap'}`}>
      <div className={sub ? 'flex w-56 items-center gap-3' : 'flex items-center gap-3'}>
        {rank ? (
          <span className={`w-5 shrink-0 font-mono text-xs ${t.ours ? 'text-fd-foreground' : 'text-fd-muted-foreground'}`}>#{rank}</span>
        ) : null}
        <Logo name={t.name} />
        {sub ? (
          <div className="flex min-w-0 flex-col">
            {name}
            <span className="text-[11px] text-fd-muted-foreground leading-tight">{sub}</span>
          </div>
        ) : (
          name
        )}
      </div>
    </td>
  );
}

function HeadRow({ head, first }: { head: Cell[]; first?: string }) {
  return (
    <thead>
      <tr>
        <th className={TH_FIRST}>{first ?? head[0].main}</th>
        {head.slice(1).map((h) => (
          <th key={h.main} className={TH}>
            <Tip label={h.main} text={h.sub} />
          </th>
        ))}
      </tr>
    </thead>
  );
}

/**
 * Feature matrix: rows are tools, columns are capabilities ("Label<br />tooltip").
 * `anchors` gives each row `id="tool-<id>"`, the target of the quadrant chips; `ranked={false}` drops the row numbers.
 */
export function FeatureMatrix({ children, anchors, ranked = true }: { children: ReactNode; anchors?: boolean; ranked?: boolean }) {
  const { head, rows } = readTable(children);
  return (
    <table className={TABLE}>
      <HeadRow head={head} />
      <tbody>
        {rows.map((row, i) => {
          const t = tool(row[0].main);
          return (
            <tr key={t.id} id={anchors ? `tool-${t.id}` : undefined} className={`scroll-mt-32 ${t.ours ? TINT : ''}`}>
              <ToolCell cell={row[0]} rank={ranked ? i + 1 : undefined} />
              {row.slice(1).map((cell, j) => (
                <td key={j} className={`${TD} ${t.ours ? TINT : ''}`}>
                  <Mark cell={cell} />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/**
 * Group table: columns are groups ("Group<br />members"), the column named after our tool is tinted;
 * rows are capabilities ("Label<br />tooltip"). Cells: Yes (green), Typically (grey: the usual case
 * in that group), No, or short text.
 */
export function GroupTable({ children }: { children: ReactNode }) {
  const { head, rows } = readTable(children);
  const ours = head.map((h) => h.main === OURS);
  const icon: Record<string, IconKind> = { Yes: 'yes', Typically: 'typically', No: 'no' };
  return (
    <table className={TABLE}>
      <thead>
        <tr>
          <th className={`${HEAD} sticky left-0 z-10 lg:z-30 w-2/5 min-w-40 border-b border-r border-fd-border px-6 py-4 text-left font-medium text-fd-muted-foreground text-xs uppercase tracking-wider`}>
            {head[0].main}
          </th>
          {head.slice(1).map((h, j) => (
            <th key={h.main} className={`${TH} whitespace-normal ${ours[j + 1] ? OURS_BG : ''}`}>
              <span className={`block text-sm ${ours[j + 1] ? 'text-fd-primary' : 'text-fd-foreground'}`}>{h.main}</span>
              {h.sub ? <span className="mt-0.5 block font-normal text-[11px] text-fd-muted-foreground">{h.sub}</span> : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0].main}>
            <td className={`${TD_FIRST} min-w-40 bg-fd-background`}>
              <Tip label={row[0].main} text={row[0].sub} />
            </td>
            {row.slice(1).map((cell, j) => (
              <td key={j} className={`${TD} ${ours[j + 1] ? TINT : 'text-fd-muted-foreground'}`}>
                {icon[cell.main] ? (
                  <span className="inline-flex justify-center">
                    <Icon kind={icon[cell.main]} />
                  </span>
                ) : (
                  <span className="text-xs">{cell.main}</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TwoLine({ cell }: { cell: Cell }) {
  return (
    <div className="mx-auto max-w-[11rem]">
      <span className="text-fd-foreground">{cell.main}</span>
      {cell.sub ? (
        <span className="mt-0.5 block text-[11px] text-fd-muted-foreground leading-tight">{cell.sub}</span>
      ) : null}
    </div>
  );
}

/**
 * Cost table: "[Tool](pricing url)<br />plan note" | "price<br />optional note" | then "value<br />note" columns.
 * Our price sits in a pill; the last column is a muted note column (billing systems).
 */
export function CostTable({ children, ranked = true }: { children: ReactNode; ranked?: boolean }) {
  const { head, rows } = readTable(children);
  const last = head.length - 1;
  return (
    <table className={TABLE}>
      <HeadRow head={head} />
      <tbody>
        {rows.map((row, i) => {
          const t = tool(row[0].main);
          const tint = t.ours ? TINT : '';
          return (
            <tr key={t.id} className={tint}>
              <ToolCell cell={row[0]} rank={ranked ? i + 1 : undefined} sub={row[0].sub || 'Entry plan'} />
              <td className={`${TD} ${tint} whitespace-nowrap font-medium text-fd-foreground`}>
                {t.ours ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-fd-primary px-2 py-0.5 font-medium text-fd-primary-foreground text-xs">
                    {row[1].main}
                  </span>
                ) : (
                  row[1].main
                )}
                {row[1].sub ? (
                  <span className="mx-auto mt-0.5 block max-w-[11rem] whitespace-normal font-normal text-[11px] text-fd-muted-foreground leading-tight">
                    {row[1].sub}
                  </span>
                ) : null}
              </td>
              {row.slice(2).map((cell, j) =>
                j + 2 === last ? (
                  <td key={j} className={`${TD} ${tint} text-fd-muted-foreground text-xs`}>
                    <div className="mx-auto max-w-[11rem]">{cell.main}</div>
                  </td>
                ) : (
                  <td key={j} className={`${TD} ${tint} text-xs`}>
                    <TwoLine cell={cell} />
                  </td>
                ),
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export const TABLES: unknown[] = [FeatureMatrix, GroupTable, CostTable];
