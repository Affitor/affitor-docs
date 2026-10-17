'use client';

import type { ReactNode } from 'react';

type PostHog = { capture?: (event: string, props: Record<string, string>) => void };

// Same event as the dashboard footer (dash#758): ask_ai_click {engine, page}, PostHog project 438505.
// Middle-click opens a tab without firing onClick; onAuxClick also fires for the right button,
// so it counts only button 1.
const track = (engine: string) =>
  (window as { posthog?: PostHog }).posthog?.capture?.('ask_ai_click', { engine, page: window.location.pathname });

export function AskAiLink({
  engine,
  href,
  label,
  className,
  children,
}: {
  engine: string;
  href: string;
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      className={className}
      onClick={() => track(engine)}
      onAuxClick={(e) => e.button === 1 && track(engine)}
    >
      {children}
    </a>
  );
}
