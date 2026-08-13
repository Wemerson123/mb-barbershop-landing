import { useEffect } from 'react';

/**
 * Reveals any [data-reveal] element once it scrolls into view by adding
 * `data-shown`. One observer for the whole page; elements are unobserved after
 * firing so nothing re-animates on the way back up. Honours
 * prefers-reduced-motion by showing everything immediately.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (nodes.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.setAttribute('data-shown', ''));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-shown', '');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}
