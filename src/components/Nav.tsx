import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BUSINESS, NAV_LINKS } from '../lib/business';
import { getOpenState } from '../lib/hours';
import { Logo } from './Logo';

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  /**
   * Which surface the nav is currently floating over. The page alternates bone
   * and near-black sections, so a single fixed treatment would be unreadable
   * on half of them.
   */
  const [surface, setSurface] = useState<'hero' | 'dark' | 'light'>('hero');
  const [status, setStatus] = useState(() => getOpenState());

  // Keep the open/closed pill honest on a long-lived tab.
  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenState()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    // Sample the section crossing the nav's mid-line and match it.
    const NAV_MIDLINE = 40;

    const onScroll = () => {
      const hero = document.getElementById('top');
      if (hero && hero.getBoundingClientRect().bottom > 96) {
        setSurface('hero');
        return;
      }

      const overDark = Array.from(
        document.querySelectorAll<HTMLElement>('[data-surface="dark"]'),
      ).some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= NAV_MIDLINE && rect.bottom >= NAV_MIDLINE;
      });

      setSurface(overDark ? 'dark' : 'light');
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Don't leave the page scrollable behind an open mobile sheet. Only touch
  // body overflow while the sheet is actually open and restore what was there
  // — writing '' on mount would stomp the intro's own scroll lock.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  /** Light type, for the hero photo and the near-black sections. */
  const light = surface !== 'light' && !menuOpen;

  const bar = menuOpen
    ? ''
    : surface === 'hero'
      ? ''
      : surface === 'dark'
        ? 'bg-neutral-950/70 backdrop-blur-md'
        : 'bg-bone/85 backdrop-blur-md';

  const dot = (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        status.isOpen ? 'bg-green-400' : light ? 'bg-white/40' : 'bg-neutral-400'
      }`}
    />
  );

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-[70] flex items-center justify-between px-5 py-4 transition-colors duration-300 sm:px-8 sm:py-5 ${bar}`}
      >
        <a href="#top" className="flex items-center" aria-label={`${BUSINESS.name} home`}>
          <Logo tone={light ? 'text-white' : 'text-neutral-950'} />
        </a>

        <div
          className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full px-2 py-1.5 backdrop-blur-sm transition-colors duration-300 md:flex ${
            light ? 'bg-black/35 ring-1 ring-white/15' : 'bg-neutral-900'
          }`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span
            className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${
              light ? 'text-white/70' : 'text-neutral-500'
            }`}
          >
            {dot}
            {status.label}
          </span>
          <a
            href={BUSINESS.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
              light
                ? 'bg-white text-neutral-950 hover:bg-maroon hover:text-white'
                : 'bg-neutral-950 text-white hover:bg-maroon'
            }`}
          >
            Book Now
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className={`relative z-[80] p-1 transition-colors duration-300 md:hidden ${
            light ? 'text-white' : 'text-neutral-950'
          }`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed left-0 right-0 top-0 z-[60] flex flex-col gap-1 bg-bone px-5 pb-6 pt-16 shadow-lg md:hidden">
          <span className="flex items-center gap-2 border-b border-neutral-200 pb-3 text-xs font-medium text-neutral-500">
            {dot}
            {status.label}
          </span>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-neutral-200 py-3 text-left text-base font-medium text-neutral-800 transition-colors hover:text-maroon"
            >
              {link.label}
            </a>
          ))}
          <a
            href={BUSINESS.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-maroon"
          >
            Book Now
          </a>
        </div>
      )}
    </>
  );
}
