import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blog } from '@/../.source/server';
import { useMDXComponents } from '@/../mdx-components';
import { DocsShell } from '@/components/docs-shell';
import { formatDate, postSlug } from '@/components/blog/post-meta';

function getPost(slug: string) {
  return blog.find((post) => postSlug(post.info.path) === slug);
}

type Post = NonNullable<ReturnType<typeof getPost>>;

const SITE_URL = 'https://docs.affitor.com';

/** "Son Piaz, Founder" -> "Son Piaz" (role suffix is byline decoration, not the Person name). */
function authorName(author: string) {
  return author.split(',')[0].trim();
}

/** Flatten a TOC title (ReactNode: string | element | array) to plain text. */
function tocTitleToText(title: unknown): string {
  if (typeof title === 'string' || typeof title === 'number') return String(title);
  if (Array.isArray(title)) return title.map(tocTitleToText).join('');
  if (title && typeof title === 'object' && 'props' in title) {
    return tocTitleToText((title as { props: { children?: unknown } }).props.children);
  }
  return '';
}

/**
 * Server-rendered JSON-LD graph per AI-RANK-redesign.md A2, driven entirely by
 * frontmatter: BlogPosting always; FAQPage when `faq:`; ItemList when `tools:`;
 * HowTo when `howto: true` (steps from "Step N" H2s in the TOC); BreadcrumbList always.
 */
function buildJsonLd(post: Post, slug: string) {
  const url = `${SITE_URL}/blog/${slug}`;
  const dateModified = post.updated ?? post.date;
  const graph: object[] = [];

  graph.push({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: post.authors.map((author) => ({
      '@type': 'Person',
      name: authorName(author),
      url: 'https://affitor.com',
    })),
    publisher: {
      '@type': 'Organization',
      name: 'Affitor',
      url: 'https://affitor.com',
    },
    ...(post.image ? { image: `${SITE_URL}${post.image}` } : {}),
  });

  if (post.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }

  if (post.tools?.length) {
    graph.push({
      '@type': 'ItemList',
      itemListElement: post.tools.map((name, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name,
        url,
      })),
    });
  }

  if (post.howto) {
    // One HowToStep per "Step N" H2; fall back to all H2s if none are numbered.
    // TOC titles compile as ReactNode (arrays/elements even for plain text), so
    // flatten to text instead of type-guarding on string.
    const h2s = post.toc
      .filter((item) => item.depth === 2)
      .map((item) => ({ url: item.url, title: tocTitleToText(item.title) }))
      .filter((item) => item.title.length > 0);
    const stepH2s = h2s.filter((item) => /^step\s*\d/i.test(item.title));
    const steps = stepH2s.length > 0 ? stepH2s : h2s;
    if (steps.length > 0) {
      graph.push({
        '@type': 'HowTo',
        name: post.title,
        description: post.description,
        step: steps.map((item, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: item.title,
          url: `${url}${item.url}`,
        })),
      });
    }
  }

  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  });

  return { '@context': 'https://schema.org', '@graph': graph };
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
    alternates: {
      // machine-readable markdown twin of this post
      types: { 'text/markdown': `/blog/${slug}.md` },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
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
  const jsonLd = buildJsonLd(post, slug);

  return (
    <DocsShell>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- server-rendered schema; `<` escaped below
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
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
          {/* Visible freshness label (AI-RANK A7) — must match dateModified in the schema */}
          <p className="mt-2 text-[14px] leading-[20px] text-fd-muted-foreground">
            Updated {formatDate(post.updated ?? post.date)}
          </p>
        </header>

        <div className="prose dark:prose-invert max-w-none text-[17px] leading-[28px] [&_p]:leading-[28px] [&_a]:text-fd-primary [&_a]:font-medium [&_a]:no-underline hover:[&_a]:underline [&_img]:rounded-lg [&_img]:border [&_img]:border-fd-border">
          <Body components={components} />
        </div>
      </article>
    </DocsShell>
  );
}
