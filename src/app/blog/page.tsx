import type { Metadata } from 'next';
import Link from 'next/link';
import { blog } from '@/../.source/server';
import { DocsShell } from '@/components/docs-shell';
import { formatDate, postSlug } from '@/components/blog/post-meta';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Essays, launches, and guides from the team building Affitor — affiliate infrastructure for the agent era.',
  openGraph: {
    title: 'Affitor Blog',
    description:
      'Essays, launches, and guides from the team building Affitor.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affitor Blog',
    description:
      'Essays, launches, and guides from the team building Affitor.',
  },
};

type Post = (typeof blog)[number];

function byDateDesc(a: Post, b: Post) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function PostCard({ post }: { post: Post }) {
  const slug = postSlug(post.info.path);
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:bg-fd-accent/50 no-underline"
    >
      {/* Cover: 1.90:1 (Dub card ratio). Gradient tile fallback when no image. */}
      <div className="aspect-[1.9/1] w-full overflow-hidden rounded-lg border border-fd-border">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#eff6ff] to-white dark:from-fd-accent dark:to-fd-card flex items-center justify-center">
            <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-fd-primary">
              {post.category}
            </span>
          </div>
        )}
      </div>

      <h2 className="mt-4 text-[18px] leading-[26px] font-semibold text-fd-foreground line-clamp-2">
        {post.title}
      </h2>
      <p className="mt-2 text-[14px] leading-[20px] text-fd-muted-foreground line-clamp-2">
        {post.description}
      </p>
      <div className="mt-4 flex items-center gap-2 text-[14px] leading-[20px] text-fd-muted-foreground">
        <span>{formatDate(post.date)}</span>
        {post.readTime ? (
          <>
            <span aria-hidden>·</span>
            <span>{post.readTime}</span>
          </>
        ) : null}
      </div>
    </Link>
  );
}

export default function BlogIndexPage() {
  const posts = [...blog].sort(byDateDesc);

  return (
    <DocsShell>
      <div className="mx-auto w-full max-w-[1152px] px-6 py-16 md:py-24">
        <header className="mb-16 md:mb-20">
          <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-fd-primary mb-3">
            Blog
          </p>
          <h1 className="text-[40px] leading-[48px] font-semibold tracking-[-0.01em] text-fd-foreground mb-4">
            Notes from the team building Affitor
          </h1>
          <p className="text-[17px] leading-[28px] text-fd-muted-foreground max-w-xl">
            Launches, guides, and essays on affiliate infrastructure — written
            by the people shipping it.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-[17px] leading-[28px] text-fd-muted-foreground">
            First post coming soon. Meanwhile, the{' '}
            <Link href="/changelog" className="text-fd-primary font-medium hover:underline">
              changelog
            </Link>{' '}
            has everything we&rsquo;ve shipped.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.info.path} post={post} />
            ))}
          </div>
        )}
      </div>
    </DocsShell>
  );
}
