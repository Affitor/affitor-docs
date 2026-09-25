'use client';

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { campusVars, mermaidConfig } from '@/lib/diagram-theme';

export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    const render = async () => {
      mermaid.initialize(mermaidConfig);
      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
      try {
        const { svg: rendered } = await mermaid.render(id, chart);
        setSvg(rendered);
      } catch {
        setSvg(`<pre style="color: var(--c-do);">Failed to render diagram</pre>`);
      }
    };

    render();
  }, [chart]);

  return (
    <div
      className="docs-diagram my-6 flex justify-center overflow-x-auto p-6"
      style={campusVars}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
