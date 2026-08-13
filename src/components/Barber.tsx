import { Instagram, MoveRight, Scissors, ShieldCheck, Timer } from 'lucide-react';
import { asset } from '../lib/asset';
import { BUSINESS } from '../lib/business';

/**
 * Only load-bearing facts here: the booking system, the chair length, the
 * days open and the owner's handle. No invented years, awards or headcounts.
 */
const POINTS = [
  {
    icon: Timer,
    title: 'Thirty-minute chairs',
    body: 'Cuts and beard work are booked as a full half hour. You are not being rushed out for the next head.',
  },
  {
    icon: Scissors,
    title: 'Clippers and scissors',
    body: 'Skin fades and razor line-ups, or a full scissor cut worked by hand when the shape calls for it.',
  },
  {
    icon: ShieldCheck,
    title: 'Book, pay, done',
    body: 'Slots are held through Square. Card, Apple Pay, Google Pay or Afterpay at the counter.',
  },
];

export function Barber() {
  return (
    <section
      id="manolo"
      data-surface="dark"
      className="relative overflow-hidden bg-neutral-950 py-20 sm:py-24 md:py-28"
    >
      {/* Warm brass wash, picking up the gold of the sign behind him. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(201,164,76,0.14) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
          <figure data-reveal className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            {/* Brass hairline frame, offset so the portrait feels hung, not pasted. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 h-full w-full rounded-lg border border-gold/30 sm:-bottom-4 sm:-right-4"
            />
            <img
              src={asset('/img/manolo.webp')}
              alt={`${BUSINESS.owner}, ${BUSINESS.ownerRole.toLowerCase()} at ${BUSINESS.name}, seated in the shop's barber chair`}
              width={1086}
              height={1448}
              loading="lazy"
              decoding="async"
              className="relative w-full rounded-lg object-cover shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/90 via-black/45 to-transparent px-5 pb-4 pt-14 sm:px-6 sm:pb-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                {BUSINESS.ownerRole}
              </p>
              <p className="text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                {BUSINESS.owner}
              </p>
            </figcaption>
          </figure>

          <div className="flex flex-col">
            <p
              data-reveal
              className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold sm:text-[11px]"
            >
              The Barber
            </p>
            <h2
              data-reveal
              className="mb-5 text-3xl font-bold leading-[1.02] tracking-[-0.025em] text-white sm:text-4xl md:text-[2.9rem]"
            >
              One barber. One chair.
              <br />
              <span className="text-gold-300">Full attention.</span>
            </h2>
            <p
              data-reveal
              className="mb-9 max-w-md text-sm leading-relaxed text-white/60 sm:text-base"
            >
              {BUSINESS.owner} runs MB Barbershop out of suite 5 on {BUSINESS.address.street}, open
              six days a week. Cuts for grown men, beards taken seriously, and kids from two years
              old.
            </p>

            <ul className="mb-9 flex flex-col gap-6">
              {POINTS.map((point) => (
                <li key={point.title} data-reveal className="flex gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold">
                    <point.icon size={15} />
                  </span>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-white sm:text-[15px]">
                      {point.title}
                    </h3>
                    <p className="max-w-sm text-[13px] leading-relaxed text-white/50 sm:text-sm">
                      {point.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div data-reveal className="flex flex-wrap items-center gap-4">
              <a
                href={BUSINESS.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-gold hover:text-neutral-950"
              >
                Book with {BUSINESS.owner}
                <MoveRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <a
                href={BUSINESS.barberInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs font-medium text-white/60 transition-colors hover:text-white sm:text-sm"
              >
                <Instagram size={15} className="transition-colors group-hover:text-gold" />
                {BUSINESS.barberHandle}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
