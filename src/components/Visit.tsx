import { useEffect, useState } from 'react';
import { Mail, MapPin, MoveRight, Phone } from 'lucide-react';
import { asset } from '../lib/asset';
import { BUSINESS } from '../lib/business';
import { TRADING_HOURS, formatMinutes, getOpenState } from '../lib/hours';

export function Visit() {
  const [status, setStatus] = useState(() => getOpenState());

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenState()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="visit" className="relative bg-bone py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal className="mb-12 sm:mb-16">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-maroon sm:text-[11px]">
            Visit
          </p>
          <h2 className="max-w-xl text-3xl font-bold leading-[1.02] tracking-[-0.025em] text-neutral-950 sm:text-4xl md:text-5xl">
            Suite 5, {BUSINESS.address.street}.
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div className="flex flex-col gap-8">
            <div data-reveal>
              <div className="mb-5 flex items-center gap-2.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    status.isOpen ? 'bg-green-400' : 'bg-neutral-400'
                  }`}
                />
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-950">
                  {status.isOpen ? 'Open now' : 'Closed'}
                </span>
                <span className="text-xs text-neutral-500">— {status.label}</span>
              </div>

              <table className="w-full">
                <caption className="sr-only">Trading hours</caption>
                <tbody>
                  {TRADING_HOURS.map((day) => {
                    const isToday = day.index === status.todayIndex;
                    return (
                      <tr
                        key={day.label}
                        className={`border-b border-neutral-200 ${
                          isToday ? 'text-neutral-950' : 'text-neutral-500'
                        }`}
                      >
                        <th
                          scope="row"
                          className={`py-2.5 text-left text-[13px] sm:text-sm ${
                            isToday ? 'font-semibold' : 'font-normal'
                          }`}
                        >
                          {day.label}
                          {isToday && (
                            <span className="ml-2 rounded-full bg-maroon px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                              Today
                            </span>
                          )}
                        </th>
                        <td
                          className={`py-2.5 text-right text-[13px] tabular-nums sm:text-sm ${
                            isToday ? 'font-semibold' : ''
                          }`}
                        >
                          {day.open === null || day.close === null
                            ? 'Closed'
                            : `${formatMinutes(day.open)} – ${formatMinutes(day.close)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div data-reveal className="flex flex-col gap-3">
              <a
                href={BUSINESS.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 text-sm text-neutral-700 transition-colors hover:text-maroon"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-neutral-400" />
                <span>
                  {BUSINESS.address.line1}
                  <br />
                  {BUSINESS.address.line2}
                  <span className="mt-1 flex items-center gap-1 text-xs font-medium text-maroon opacity-0 transition-opacity group-hover:opacity-100">
                    Get directions <MoveRight size={11} />
                  </span>
                </span>
              </a>
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center gap-3 text-sm text-neutral-700 transition-colors hover:text-maroon"
              >
                <Phone size={16} className="shrink-0 text-neutral-400" />
                {BUSINESS.phone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-3 break-all text-sm text-neutral-700 transition-colors hover:text-maroon"
              >
                <Mail size={16} className="shrink-0 text-neutral-400" />
                {BUSINESS.email}
              </a>
            </div>
          </div>

          <div data-reveal className="relative overflow-hidden rounded-2xl">
            <img
              src={asset('/img/interior.webp')}
              alt="Inside the shop — barber chair, mirror and counter"
              loading="lazy"
              decoding="async"
              className="h-full min-h-[280px] w-full object-cover sm:min-h-[380px]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.15) 45%, transparent 75%)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Suite 5, {BUSINESS.address.street}
                </p>
                <p className="text-lg font-semibold leading-tight text-white sm:text-xl">
                  Open six days.
                  <br />
                  Latest chair, 7pm.
                </p>
              </div>
              <a
                href={BUSINESS.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-neutral-950 transition-colors hover:bg-maroon hover:text-white sm:text-sm"
              >
                Book ahead
                <MoveRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
