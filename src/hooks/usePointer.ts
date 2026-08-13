import { useEffect, useRef, useState } from 'react';
import { GRID_DRIFT, GRID_EASE, POINTER_EASE } from '../lib/constants';

export type PointerState = {
  /** Smoothed cursor position, relative to the tracked element. */
  x: number;
  y: number;
  /** Smoothed grid offset in px, driven by cursor distance from centre. */
  gridX: number;
  gridY: number;
  /** False until the pointer has actually moved over the element. */
  active: boolean;
};

const IDLE: PointerState = { x: 0, y: 0, gridX: 0, gridY: 0, active: false };

/**
 * Tracks the pointer over `ref` and eases two values towards it on a single
 * requestAnimationFrame loop: the cursor itself (POINTER_EASE) and a slower
 * parallax offset for the grid (GRID_EASE). Coordinates are element-relative
 * so they stay correct once the page is scrolled.
 *
 * The loop parks itself whenever the element is offscreen or the pointer is
 * within half a pixel of its target, so an idle hero costs nothing.
 */
export function usePointer(ref: React.RefObject<HTMLElement>) {
  const [state, setState] = useState<PointerState>(IDLE);

  // Raw pointer position in viewport coords, written straight from the event.
  const raw = useRef({ x: 0, y: 0, seen: false });
  // Smoothed values, carried across frames.
  const smooth = useRef({ x: 0, y: 0, gridX: 0, gridY: 0 });
  const visible = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (event: PointerEvent) => {
      // Touch drags shouldn't fight the page scroll for the spotlight.
      if (event.pointerType === 'touch') return;
      raw.current.x = event.clientX;
      raw.current.y = event.clientY;
      raw.current.seen = true;
    };

    const onLeave = () => {
      raw.current.seen = false;
      setState((prev) => (prev.active ? { ...prev, active: false } : prev));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(el);

    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible.current || !raw.current.seen) return;

      const rect = el.getBoundingClientRect();
      const targetX = raw.current.x - rect.left;
      const targetY = raw.current.y - rect.top;

      // Normalised distance from the element's centre, -0.5 .. 0.5.
      const cx = rect.width ? targetX / rect.width - 0.5 : 0;
      const cy = rect.height ? targetY / rect.height - 0.5 : 0;

      const s = smooth.current;
      const ease = reduced ? 1 : POINTER_EASE;
      const gridEase = reduced ? 1 : GRID_EASE;

      s.x += (targetX - s.x) * ease;
      s.y += (targetY - s.y) * ease;
      s.gridX += (cx * GRID_DRIFT - s.gridX) * gridEase;
      s.gridY += (cy * GRID_DRIFT - s.gridY) * gridEase;

      setState((prev) => {
        const settled =
          prev.active &&
          Math.abs(prev.x - s.x) < 0.5 &&
          Math.abs(prev.y - s.y) < 0.5 &&
          Math.abs(prev.gridX - s.gridX) < 0.05 &&
          Math.abs(prev.gridY - s.gridY) < 0.05;

        if (settled) return prev;

        return { x: s.x, y: s.y, gridX: s.gridX, gridY: s.gridY, active: true };
      });
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      observer.disconnect();
    };
  }, [ref]);

  return state;
}
