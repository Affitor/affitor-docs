'use client';

import { useEffect } from 'react';

export function SidebarSpotlight() {
  useEffect(() => {
    const sidebar = document.querySelector('[data-fd-sidebar]');
    if (!sidebar) return;

    const spotlight = document.createElement('div');
    spotlight.style.cssText = `
      position: fixed;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      background: radial-gradient(circle, var(--color-fd-muted) 0%, transparent 70%);
    `;
    sidebar.appendChild(spotlight);

    function handleMouseMove(e: Event) {
      const mouseEvent = e as MouseEvent;
      const rect = (sidebar as HTMLElement).getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;

      spotlight.style.left = `${x - 110}px`;
      spotlight.style.top = `${y - 110 + (sidebar as HTMLElement).scrollTop}px`;
      spotlight.style.opacity = '1';
    }

    function handleMouseLeave() {
      spotlight.style.opacity = '0';
    }

    sidebar.addEventListener('mousemove', handleMouseMove);
    sidebar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      sidebar.removeEventListener('mousemove', handleMouseMove);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
      spotlight.remove();
    };
  }, []);

  return null;
}
