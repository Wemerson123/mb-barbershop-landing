import { useCallback, useEffect, useState } from 'react';

/** Total run time, kept in step with the keyframes in base.css. */
const RUN_MS = 2400;
/** Once the split starts the hero is already visible behind it. */
const SPLIT_AT_MS = 1500;
const SESSION_KEY = 'mb-intro-played';

function shouldPlay(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Deep-linking to a section shouldn't be interrupted by a title card.
  if (window.location.hash) return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    // Private mode with storage blocked — play it, just don't remember.
    return true;
  }
}

/**
 * Opening title card: the MB sign strikes on in brass neon, then the panel
 * splits and lifts away to the hero. Plays once per session, skips on any
 * click, key or scroll, and never runs for reduced-motion or hash entry.
 */
export function Intro() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'splitting' | 'done'>(() =>
    shouldPlay() ? 'playing' : 'done',
  );

  const finish = useCallback(() => {
    setPhase((current) => (current === 'done' ? current : 'splitting'));
  }, []);

  useEffect(() => {
    if (phase === 'done') return;

    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage blocked; nothing to remember */
    }

    // Hold the page still underneath, and pin it to the top so the reveal
    // always lands on the hero.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const toSplit = window.setTimeout(finish, SPLIT_AT_MS);
    const toEnd = window.setTimeout(() => setPhase('done'), RUN_MS);

    window.addEventListener('pointerdown', finish);
    window.addEventListener('keydown', finish);
    window.addEventListener('wheel', finish, { passive: true });
    window.addEventListener('touchstart', finish, { passive: true });

    return () => {
      window.clearTimeout(toSplit);
      window.clearTimeout(toEnd);
      window.removeEventListener('pointerdown', finish);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchstart', finish);
      document.body.style.overflow = overflow;
    };
  }, [phase, finish]);

  // Once splitting starts, retire the overlay a beat later even if the timer
  // that owns RUN_MS was the one skipped past.
  useEffect(() => {
    if (phase !== 'splitting') return;
    const id = window.setTimeout(() => setPhase('done'), 900);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (phase === 'done') return null;

  const splitting = phase === 'splitting';

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="presentation"
      aria-hidden="true"
      data-splitting={splitting ? '' : undefined}
    >
      {/* Two panels that part to reveal the hero. */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-neutral-950 ${
          splitting ? 'animate-intro-lift-top' : ''
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-neutral-950 ${
          splitting ? 'animate-intro-lift-bottom' : ''
        }`}
      />

      {/* Hairline seam that widens as the panels part. */}
      <div
        className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
        style={{
          background: 'linear-gradient(90deg, transparent, #c9a44c 22%, #c9a44c 78%, transparent)',
          opacity: splitting ? 0 : 1,
          transition: 'opacity 320ms ease-out',
        }}
      />

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${
          splitting ? 'animate-intro-logo-out' : ''
        }`}
      >
        <span
          className="animate-intro-strike text-[15vw] font-bold leading-none tracking-[-0.06em] text-gold-300 sm:text-[7rem]"
          style={{
            // Neon bloom, matched to the sign hanging in the shop.
            textShadow:
              '0 0 6px rgba(227,198,132,0.55), 0 0 26px rgba(201,164,76,0.45), 0 0 70px rgba(201,164,76,0.22)',
          }}
        >
          MB
        </span>
        <span className="flex items-center gap-3">
          <span className="animate-intro-rule h-px w-10 bg-gold/60 sm:w-14" />
          <span className="animate-intro-track text-[9px] font-semibold uppercase leading-none tracking-[0.4em] text-gold-300/85 sm:text-[11px]">
            Barbershop
          </span>
          <span className="animate-intro-rule h-px w-10 bg-gold/60 sm:w-14" />
        </span>
        <span className="animate-intro-sub mt-2 text-[8px] font-medium uppercase tracking-[0.3em] text-white/35 sm:text-[10px]">
          Caxton St · Paddington
        </span>
      </div>
    </div>
  );
}
