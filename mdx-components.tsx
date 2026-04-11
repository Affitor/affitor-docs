import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Mermaid } from '@/components/mermaid';
import { Checklist } from '@/components/mdx/checklist';
import { NextStep } from '@/components/mdx/next-step';
import { PageMeta } from '@/components/mdx/page-meta';
import { TaskCardGrid, TaskCard } from '@/components/mdx/task-card-grid';
import { FlowGrid, FlowCard } from '@/components/mdx/flow-grid';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    Checklist,
    NextStep,
    PageMeta,
    TaskCardGrid,
    TaskCard,
    FlowGrid,
    FlowCard,
    ...components,
  };
}
