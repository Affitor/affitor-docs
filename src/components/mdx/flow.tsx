import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

/**
 * <Flow> — a sequential pipeline timeline (numbered nodes + connector line).
 * Replaces raw-ASCII flow diagrams stuffed into code blocks.
 *
 *   <Flow>
 *     <FlowStep caption="First touch is captured.">
 *       Partner shares link → visitor clicks → **Affitor tracks the click**
 *     </FlowStep>
 *     <FlowStep>…</FlowStep>
 *   </Flow>
 */
export function Flow({ children }: { children: ReactNode }) {
  const steps = Children.toArray(children).filter(isValidElement) as ReactElement<FlowStepProps>[];
  return (
    <div className="docs-flow not-prose">
      {steps.map((child, i) => cloneElement(child, { _n: i + 1, key: i }))}
    </div>
  );
}

interface FlowStepProps {
  caption?: string;
  children: ReactNode;
  /** injected by <Flow> — the 1-based step number */
  _n?: number;
}

export function FlowStep({ caption, children, _n }: FlowStepProps) {
  return (
    <div className="docs-flow-stage">
      <div className="docs-flow-node">{_n}</div>
      <div className="docs-flow-content">
        <div className="docs-flow-text">{children}</div>
        {caption ? <div className="docs-flow-caption">{caption}</div> : null}
      </div>
    </div>
  );
}
