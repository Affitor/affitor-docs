'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Pops the `.chip-pop` children in once, when 35% of the box is in view (styles in globals.css).
 * The server HTML has every chip visible; the box is armed only after hydration, so readers
 * without JS, and anyone who prefers reduced motion, see the static map.
 */
export function PopIn({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.add('quad-anim');
    let done: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.35) return;
        el.classList.add('in');
        io.disconnect();
        // After the last chip lands, drop the animation classes so a later layout change
        // (resize across lg, print) cannot replay it. The end state equals the default state.
        const last = el.querySelectorAll('.chip-pop').length - 1;
        done = setTimeout(() => el.classList.remove('quad-anim', 'in'), 120 + last * 70 + 450 + 100);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(done);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
