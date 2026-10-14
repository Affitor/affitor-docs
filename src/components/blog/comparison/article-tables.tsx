import type { ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { CostTable, FeatureMatrix } from './tables';

/*
 * The comparison tables inside a regular article (the 640px column), e.g. the vs posts.
 * The frame widens past the column from lg up (848px, 976px from xl) and scrolls sideways when a table
 * is still wider. `.not-prose` opts it out of the article table styles in globals.css. The frame is a
 * scroll container, so the header's sticky offset is reset to 0 here (64px would push it over the first row).
 * Rows carry no rank numbers: a head-to-head is not a ranking.
 */
const FRAME = 'not-prose my-8 overflow-x-auto border-y border-fd-border lg:-mx-32 xl:-mx-48 [&_th]:top-0';

export const articleComponents: MDXComponents = {
  CostTable: ({ children }: { children: ReactNode }) => (
    <div className={FRAME}>
      <CostTable ranked={false}>{children}</CostTable>
    </div>
  ),
  FeatureMatrix: ({ children }: { children: ReactNode }) => (
    <div className={FRAME}>
      <FeatureMatrix ranked={false}>{children}</FeatureMatrix>
    </div>
  ),
};
