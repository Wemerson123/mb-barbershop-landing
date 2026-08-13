import { Instagram } from 'lucide-react';
import { BUSINESS } from '../lib/business';
import { Carousel3D } from './Carousel3D';

export function Work() {
  return (
    <section
      id="work"
      data-surface="dark"
      className="relative overflow-hidden bg-neutral-950 py-20 sm:py-24 md:py-28"
    >
      {/* Warm pool of light behind the ring, so the cards sit in a room. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[120%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(128,0,0,0.28) 0%, rgba(128,0,0,0.08) 42%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div
          data-reveal
          className="mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-maroon-400 sm:text-[11px]">
              The Work
            </p>
            <h2 className="max-w-xl text-3xl font-bold leading-[1.02] tracking-[-0.025em] text-white sm:text-4xl md:text-5xl">
              Every cut leaves
              <br />
              a sharp edge.
            </h2>
          </div>
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white sm:text-sm"
          >
            <Instagram size={15} className="transition-colors group-hover:text-maroon-400" />
            {BUSINESS.instagramHandle}
          </a>
        </div>
      </div>

      <div data-reveal className="relative">
        <Carousel3D />
      </div>
    </section>
  );
}
