import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blog } from '@/../.source/server';
import { useMDXComponents } from '@/../mdx-components';
import { DocsShell } from '@/components/docs-shell';
import { formatDate, postSlug } from '@/components/blog/post-meta';

function getPost(slug: string) {
  return blog.find((post) => postSlug(post.info.path) === slug);
}

export function generateStaticParams() {
  return blog.map((post) => ({ slug: postSlug(post.info.path) }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const Body = post.body;
  const components = useMDXComponents({});

  return (
    <DocsShell>
      {/* Article measure: 640px centered (FACTS-aesthetics rule 3) */}
      <article className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
        <header className="mb-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-fd-primary mb-3">
            {post.category}
          </p>
          <h1 className="text-[40px] leading-[48px] font-semibold tracking-[-0.01em] text-fd-foreground mb-4">
            {post.title}
          </h1>
          <p className="text-[20px] leading-[30px] text-fd-muted-foreground mb-6">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[14px] leading-[20px]">
            <span className="font-medium text-fd-foreground">
              {post.authors.join(', ')}
            </span>
            <span className="text-fd-muted-foreground" aria-hidden>
              ·
            </span>
            <span className="text-fd-muted-foreground">
              {formatDate(post.date)}
            </span>
            {post.readTime ? (
              <>
                <span className="text-fd-muted-foreground" aria-hidden>
                  ·
                </span>
                <span className="text-fd-muted-foreground">
                  {post.readTime}
                </span>
              </>
            ) : null}
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none text-[17px] leading-[28px] [&_p]:leading-[28px] [&_a]:text-fd-primary [&_a]:font-medium [&_a]:no-underline hover:[&_a]:underline [&_img]:rounded-lg [&_img]:border [&_img]:border-fd-border">
          <Body components={components} />
        </div>
      </article>
    </DocsShell>
  );
}
