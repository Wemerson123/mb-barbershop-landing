import { useRef } from 'react';
import { MapPin, MoveRight, Play } from 'lucide-react';
import { usePointer } from '../hooks/usePointer';
import { asset } from '../lib/asset';
import { BUSINESS, HAIRCUT_FROM } from '../lib/business';
import { GridBackdrop } from './GridBackdrop';
import { RevealLayer } from './RevealLayer';

const BEFORE = asset('/img/hero-before.webp');
const AFTER = asset('/img/hero-after.webp');

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const pointer = usePointer(heroRef);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative w-full overflow-hidden bg-bone"
      style={{ height: '100vh' }}
    >
      <GridBackdrop offsetX={pointer.gridX} offsetY={pointer.gridY} />

      {/* Base frame: grown out, flat, waiting. */}
      <div
        className="absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${BEFORE}')` }}
      />

      {/* Revealed inside the cursor spotlight: the same chair, cut fresh. */}
      <RevealLayer x={pointer.x} y={pointer.y} active={pointer.active} image={AFTER} />

      {/* Scrim keeps the headline legible over both frames. Weighted to the
          bottom only — a wash across the top just made the photo look foggy. */}
      <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.86) 0%, rgba(10,10,10,0.5) 32%, rgba(10,10,10,0.08) 62%, transparent 100%)',
        }}
      />
      {/* Just enough shade at the very top for the nav to sit on. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-40 h-28"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.5), transparent)' }}
      />

      <div className="absolute bottom-12 left-5 z-50 max-w-[300px] sm:left-8 sm:max-w-md md:bottom-40 md:left-12 md:max-w-2xl">
        <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:mb-3 sm:text-[11px]">
          <MapPin size={12} className="text-maroon-400" />
          {BUSINESS.address.street} · {BUSINESS.address.suburb}
        </p>

        <h1 className="mb-4 text-[2.1rem] font-bold leading-[0.95] tracking-[-0.03em] text-white sm:mb-5 sm:text-5xl md:text-[5.2rem]">
          Walk in rough.
          <br />
          <span className="text-maroon-400">Walk out sharp.</span>
        </h1>

        <p className="mb-5 max-w-sm text-[13px] leading-relaxed text-white/75 sm:mb-7 sm:text-base md:max-w-md">
          Precision fades, beard work and razor detail in {BUSINESS.address.suburb}. Real prices,
          thirty-minute chairs, cuts from A${HAIRCUT_FROM}.
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <a
            href={BUSINESS.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-neutral-900 transition-all hover:bg-maroon hover:text-white sm:px-7 sm:py-3 sm:text-sm"
          >
            Book Appointment
            <MoveRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <a
            href="#work"
            className="flex items-center gap-2 text-xs font-medium text-white/80 transition-colors hover:text-white sm:text-sm"
          >
            <Play size={12} className="fill-current" />
            See the work
          </a>
        </div>
      </div>

      {/* Teaches the spotlight — it's invisible until someone moves the mouse. */}
      <div
        className={`pointer-events-none absolute bottom-6 right-5 z-50 hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 transition-opacity duration-700 md:flex ${
          pointer.active ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="h-px w-8 bg-white/30" />
        Move to reveal the cut
      </div>
    </section>
  );
}
