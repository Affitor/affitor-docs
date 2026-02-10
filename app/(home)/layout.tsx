import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      nav={{
        title: (
          <span className="text-sm font-medium tracking-tight text-fd-foreground">
            Affitor
          </span>
        ),
        url: '/',
      }}
      links={[
        { text: 'Docs', url: '/docs' },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
