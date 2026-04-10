'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

let initialized = false;

export function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const render = async () => {
      if (!containerRef.current) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        themeVariables:
          resolvedTheme === 'dark'
            ? {
                primaryColor: '#1e2233',
                primaryTextColor: '#e1e3ea',
                primaryBorderColor: '#5B8DEF',
                lineColor: '#5B8DEF',
                secondaryColor: '#232736',
                tertiaryColor: '#161923',
                background: '#0f1117',
                mainBkg: '#1e2233',
                nodeBorder: '#5B8DEF',
                clusterBkg: '#161923',
                titleColor: '#e1e3ea',
                edgeLabelBackground: '#161923',
              }
            : {
                primaryColor: '#dbeafe',
                primaryTextColor: '#1e293b',
                primaryBorderColor: '#155DFC',
                lineColor: '#155DFC',
                secondaryColor: '#eff6ff',
                tertiaryColor: '#f8fafc',
                background: '#ffffff',
                mainBkg: '#dbeafe',
                nodeBorder: '#155DFC',
                titleColor: '#1e293b',
                edgeLabelBackground: '#ffffff',
              },
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
      });

      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
      try {
        const { svg: rendered } = await mermaid.render(id, chart);
        setSvg(rendered);
      } catch {
        setSvg(`<pre style="color: red;">Failed to render diagram</pre>`);
      }
    };

    render();
  }, [chart, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-fd-border bg-fd-card p-6"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
