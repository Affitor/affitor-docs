import { renderInlineMarkdown } from './inline-markdown';

type Step = { title: string; text: string; href: string };

/**
 * <UseCaseSteps items={[{ title, text, href }]} />: the numbered steps of a use case page (spec
 * §7.4, mock U2): each step one line, with a link to the guide that does it. `text` takes inline
 * `code`, **bold** and [links](/docs/...).
 */
export function UseCaseSteps({ items }: { items: Step[] }) {
  return (
    <ol className="aff-uc-steps not-prose">
      {items.map((step, i) => (
        <li key={step.title}>
          <span className="aff-uc-step-n" aria-hidden>
            {i + 1}
          </span>
          <div>
            <div className="aff-uc-step-title">{step.title}</div>
            <p>{renderInlineMarkdown(step.text)}</p>
          </div>
          <a href={step.href} className="aff-uc-step-link" aria-label={`Guide: ${step.title}`}>
            Guide
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        </li>
      ))}
    </ol>
  );
}
