import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '../lib/asset';

const GALLERY = [
  { src: asset('/img/gallery/g1.webp'), alt: 'Close detail of a finished skin fade' },
  { src: asset('/img/gallery/g2.webp'), alt: 'Straight razor setting the edge of a beard' },
  { src: asset('/img/gallery/g3.webp'), alt: 'Scissor work caught mid-cut' },
  {
    src: asset('/img/gallery/g4.webp'),
    alt: 'Clippers, razor, combs and brush laid out on leather',
  },
  {
    src: asset('/img/gallery/g5.webp'),
    alt: 'Hot towel resting over a client before beard work',
  },
  { src: asset('/img/gallery/g6.webp'), alt: 'The barber chair under a single warm light' },
];

/** Two laps of the set, so the ring reads as continuous. */
const CARDS = [...GALLERY, ...GALLERY];

// translateZ for a ring of N cards is -(w/2 + gap) / tan(pi/N). cot(pi/12) is
// precomputed because CSS trig() support is still uneven, and translateZ won't
// take percentages — hence the --card-w length variable.
const COT_HALF_STEP = 3.7320508;

/** Idle drift, matching the 44s loop this replaced. */
const AUTO_DEG_PER_S = 360 / 44;
/** How much rotation a pixel of drag buys. */
const DEG_PER_PX = 0.4;
/** Velocity retained per 60fps frame — governs both fling glide and resume. */
const FRICTION = 0.94;
const MAX_DEG_PER_S = 900;

/**
 * Drag-to-spin photo ring. Rotation is owned by a ref and written straight to
 * the node each frame, never through React state — at 60fps that would be
 * hundreds of renders of twelve cards.
 *
 * A single exponential decay toward a target velocity does double duty: it's
 * the fling inertia after a drag, and it's the ease back up to idle drift.
 * Hovering sets the target to zero so a card can be studied.
 */
export function Carousel3D() {
  const ringRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const velocity = useRef(AUTO_DEG_PER_S);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const reduced = useRef(false);
  const lastX = useRef(0);
  const lastMoveAt = useRef(0);
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) velocity.current = 0;

    const ring = ringRef.current;
    if (!ring) return;

    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      // Clamp dt so a backgrounded tab doesn't resume with a huge jump.
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      if (!dragging.current) {
        const target = hovering.current || reduced.current ? 0 : AUTO_DEG_PER_S;
        const decay = FRICTION ** (dt * 60);
        velocity.current = target + (velocity.current - target) * decay;
        angle.current += velocity.current * dt;
      }

      ring.style.transform = `rotateY(${angle.current.toFixed(2)}deg)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    // Let the browser keep vertical scrolling on touch.
    if (event.pointerType === 'mouse') event.preventDefault();
    dragging.current = true;
    velocity.current = 0;
    lastX.current = event.clientX;
    lastMoveAt.current = performance.now();
    try {
      // Throws if the pointer is already gone by the time this runs.
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* drag still works, it just won't track outside the element */
    }
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;

    const dx = event.clientX - lastX.current;
    if (dx === 0) return;

    const now = performance.now();
    const dt = Math.max((now - lastMoveAt.current) / 1000, 1 / 240);

    angle.current += dx * DEG_PER_PX;
    // Smooth the sampled velocity so a jittery mouse doesn't fling wildly.
    const sampled = (dx * DEG_PER_PX) / dt;
    velocity.current = Math.max(
      -MAX_DEG_PER_S,
      Math.min(MAX_DEG_PER_S, velocity.current * 0.7 + sampled * 0.3),
    );

    lastX.current = event.clientX;
    lastMoveAt.current = now;
    if (!hasDragged) setHasDragged(true);
  }, [hasDragged]);

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    // A drag that ended on a stale sample shouldn't coast on it.
    if (performance.now() - lastMoveAt.current > 120) velocity.current = 0;
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* already released */
    }
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 90 : 30;
    if (event.key === 'ArrowLeft') {
      angle.current -= step;
      velocity.current = 0;
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      angle.current += step;
      velocity.current = 0;
      event.preventDefault();
    }
  }, []);

  const step = 360 / CARDS.length;

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Photo gallery — drag or use the arrow keys to spin"
      className="relative grid h-[380px] w-full cursor-grab place-items-center overflow-hidden active:cursor-grabbing sm:h-[540px] md:h-[680px]"
      style={
        {
          perspective: '35em',
          '--card-w': 'clamp(10.5rem, 22vw, 17.5rem)',
          touchAction: 'pan-y',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          // Fades off the cards nearest the camera, whose perspective shear at
          // 35em is dramatic but unreadable at the very edges.
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 23%, #000 77%, transparent)',
          maskImage: 'linear-gradient(90deg, transparent, #000 23%, #000 77%, transparent)',
        } as React.CSSProperties
      }
      onPointerEnter={() => {
        hovering.current = true;
      }}
      onPointerLeave={(event) => {
        hovering.current = false;
        endDrag(event);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      <div ref={ringRef} className="grid place-self-center" style={{ transformStyle: 'preserve-3d' }}>
        {CARDS.map((card, i) => (
          <figure
            key={`${card.src}-${i}`}
            className="relative col-start-1 row-start-1 overflow-hidden rounded-[1.5rem]"
            style={{
              width: 'var(--card-w)',
              aspectRatio: '7 / 10',
              backfaceVisibility: 'hidden',
              transform: `rotateY(${i * step}deg) translateZ(calc(-1 * (0.5 * var(--card-w) + 0.5rem) * ${COT_HALF_STEP}))`,
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.8)',
            }}
          >
            <img
              src={card.src}
              alt={card.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/15"
            />
          </figure>
        ))}
      </div>

      {/* Same teaching cue as the hero spotlight — retires once it's understood. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] text-white/40 transition-opacity duration-700 sm:bottom-5 sm:text-[10px] ${
          hasDragged ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="h-px w-6 bg-white/25" />
        Drag to spin
        <span className="h-px w-6 bg-white/25" />
      </div>
    </div>
  );
}
