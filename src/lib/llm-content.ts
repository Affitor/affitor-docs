import { promises as fs } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs');

/**
 * Read the raw MDX source for a doc slug, straight from the same file that
 * renders the HTML page. Returns null if no source file exists for the slug.
 *
 * The .mdx file is the single source of truth: serving it verbatim gives the
 * markdown representation for free, with zero manual sync. Edit the .mdx and
 * both the HTML page and this markdown change together.
 */
export async function readDocMarkdown(slug: string[]): Promise<string | null> {
  const rel = slug.join('/');
  const candidates = rel
    ? [path.join(CONTENT_DIR, `${rel}.mdx`), path.join(CONTENT_DIR, rel, 'index.mdx')]
    : [path.join(CONTENT_DIR, 'index.mdx')];

  for (const candidate of candidates) {
    // Path-traversal guard: a resolved file must stay inside CONTENT_DIR
    // because `slug` ultimately comes from the request URL.
    const resolved = path.resolve(candidate);
    if (resolved !== CONTENT_DIR && !resolved.startsWith(CONTENT_DIR + path.sep)) {
      continue;
    }
    try {
      return await fs.readFile(resolved, 'utf8');
    } catch {
      // Not this candidate; try the next.
    }
  }
  return null;
}
