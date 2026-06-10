import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Mermaid } from '@/components/mermaid';
import { Checklist } from '@/components/mdx/checklist';
import { NextStep } from '@/components/mdx/next-step';
import { PageMeta } from '@/components/mdx/page-meta';
import { TaskCardGrid, TaskCard } from '@/components/mdx/task-card-grid';
import { FlowGrid, FlowCard } from '@/components/mdx/flow-grid';
import { Flow, FlowStep } from '@/components/mdx/flow';
import { FeatureCards, FeatureCard } from '@/components/mdx/feature-card';
import { CommonMistakes } from '@/components/mdx/common-mistakes';
import { RecommendedPath } from '@/components/mdx/recommended-path';
import { VerifySuccess } from '@/components/mdx/verify-success';
import { ParamList, ParamField } from '@/components/mdx/param-field';
import { CodeGroup } from '@/components/mdx/code-group';
import { ResponseTabs } from '@/components/mdx/response-tabs';
import { Callout } from '@/components/mdx/callout';

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
    Flow,
    FlowStep,
    FeatureCards,
    FeatureCard,
    CommonMistakes,
    RecommendedPath,
    VerifySuccess,
    ParamList,
    ParamField,
    CodeGroup,
    ResponseTabs,
    Callout,
    ...components,
  };
}
