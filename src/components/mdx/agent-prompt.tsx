import type { ReactNode } from 'react';
import { CodeGroup } from '@/components/mdx/code-group';

/**
 * <AgentPrompt prompt="..."> — a line a reader hands to their AI coding agent, with Copy
 * (docs standard G2; Vercel's "Agent prompt", Resend's prompt block). Reuses CodeGroup, so it
 * looks and copies like every other code block; the text wraps instead of scrolling.
 *
 * Usage in MDX:
 *   <AgentPrompt prompt="Follow https://affitor.com/docs/skill.md to integrate Affitor. ...">
 *     Using an AI coding agent? Give it this line.
 *   </AgentPrompt>
 */
export function AgentPrompt({ prompt, children }: { prompt: string; children?: ReactNode }) {
  return (
    <div className="docs-agent-prompt">
      {children ? <div className="docs-agent-prompt-lead">{children}</div> : null}
      <CodeGroup items={[{ label: 'Agent prompt', lang: 'text', code: prompt }]} />
    </div>
  );
}
