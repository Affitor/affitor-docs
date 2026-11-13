import { blog } from '@/../.source/server';
import { postSlug } from '@/components/blog/post-meta';

export type Post = (typeof blog)[number];

/** The blog index description: page metadata, its CollectionPage and /blog.md (check-agent-surface.mjs mirrors it). */
export const BLOG_DESCRIPTION =
  'Essays, launches, and guides from the team building Affitor — affiliate infrastructure for the agent era.';

/**
 * The blog index order everywhere (the page, its JSON-LD, /blog.md): newest first, then by slug, so posts of the
 * same day keep one order (CORE-690 follow-up, 13/11/2026).
 */
export function sortedPosts(): Post[] {
  return [...blog].sort((a, b) => b.date.localeCompare(a.date) || postSlug(a.info.path).localeCompare(postSlug(b.info.path)));
}
