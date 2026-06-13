const BASE = (process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.affitor.com').replace(/\/$/, '');

type DocPage = { url: string; data: { title?: string; description?: string } };

/**
 * Emits schema.org TechArticle + BreadcrumbList for a doc page, derived from the
 * same page data the HTML renders from. Helps search engines and AI search
 * understand the page semantically and cite it.
 */
export function DocJsonLd({ page, slug }: { page: DocPage; slug: string[] }) {
  const url = `${BASE}${page.url}`;

  const crumbs: { name: string; item: string }[] = [{ name: 'Docs', item: `${BASE}/` }];
  let acc = '';
  for (const segment of slug) {
    acc += `/${segment}`;
    crumbs.push({ name: segment.replace(/[-_]/g, ' '), item: `${BASE}${acc}` });
  }

  const graph = [
    {
      '@type': 'TechArticle',
      '@id': url,
      headline: page.data.title,
      description: page.data.description,
      url,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: 'Affitor Documentation', url: BASE },
      publisher: { '@type': 'Organization', name: 'Affitor', url: 'https://affitor.com' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
