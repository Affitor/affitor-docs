import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { Twitter, Linkedin, Globe } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="text-sm font-medium tracking-tight text-fd-foreground">
            Affitor
          </span>
        ),
        url: '/',
      }}
      links={[
        {
          type: 'icon',
          icon: <Twitter className="size-4" />,
          text: 'Twitter',
          label: 'Follow on X',
          url: 'https://x.com/affitor_ai',
          external: true,
        },
        {
          type: 'icon',
          icon: <Linkedin className="size-4" />,
          text: 'LinkedIn',
          label: 'Connect on LinkedIn',
          url: 'https://linkedin.com/company/affitor',
          external: true,
        },
        {
          type: 'button',
          icon: <Globe className="size-4" />,
          text: 'affitor.com',
          url: 'https://affitor.com',
          external: true,
        },
      ]}
      sidebar={{
        defaultOpenLevel: 2,
        collapsible: true,
      }}
    >
      {children}
    </DocsLayout>
  );
}
