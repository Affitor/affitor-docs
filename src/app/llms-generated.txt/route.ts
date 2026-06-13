import { source } from '@/lib/source';

// Spike preview endpoint at /llms-generated.txt — does NOT replace the curated
// public/llms.txt. It demonstrates generating the page index from the source
// tree (zero-sync) so we can compare against the hand-written file and decide
// the final hybrid: generated index + curated preamble/appendix.
export const dynamic = 'force-static';

const BASE = (process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.affitor.com').replace(/\/$/, '');

const PREAMBLE = `# Affitor Documentation

> Affitor is an affiliate growth platform for SaaS companies.
> This file provides LLM-readable documentation for integrating Affitor.
> Full docs: ${BASE}

> **AI coding agents — integration entry point:** follow ${BASE}/skill.md.
> It is a self-contained runbook for wiring click + lead + sale tracking and
> verifying the integration end-to-end.
`;

function asString(name: unknown): string | null {
  return typeof name === 'string' && name.trim().length > 0 ? name : null;
}

export function GET() {
  const meta = new Map(source.getPages().map((page) => [page.url, page.data]));

  const line = (url: string, fallback?: string | null): string => {
    const data = meta.get(url);
    const name = (data?.title as string | undefined) || fallback || url;
    const description = data?.description ? `: ${data.description}` : '';
    return `- [${name}](${BASE}${url})${description}\n`;
  };

  const walk = (nodes: any[], depth: number): string => {
    let out = '';
    for (const node of nodes) {
      if (node.type === 'folder') {
        const heading = asString(node.name);
        if (heading) out += `\n${'#'.repeat(Math.min(depth + 2, 6))} ${heading}\n\n`;
        if (node.index?.url) out += line(node.index.url, asString(node.index.name));
        out += walk(node.children ?? [], depth + 1);
      } else if (node.type === 'page' && typeof node.url === 'string') {
        out += line(node.url, asString(node.name));
      }
    }
    return out;
  };

  const tree = source.pageTree as { children?: any[] };
  const body = PREAMBLE + walk(tree.children ?? [], 0);

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
