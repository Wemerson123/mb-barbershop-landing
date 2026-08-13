import { Clock, MoveRight } from 'lucide-react';
import { BUSINESS, SERVICE_GROUPS } from '../lib/business';

export function Services() {
  return (
    <section id="services" className="relative bg-bone py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div
          data-reveal
          className="mb-12 flex flex-col gap-5 sm:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-maroon sm:text-[11px]">
              Services
            </p>
            <h2 className="max-w-xl text-3xl font-bold leading-[1.02] tracking-[-0.025em] text-neutral-950 sm:text-4xl md:text-5xl">
              The whole menu.
              <br />
              Nothing hidden.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
            Every price below is the price you pay at the chair. Book the slot you want and it's
            held for you.
          </p>
        </div>

        <div className="flex flex-col gap-12 sm:gap-16">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.id} data-reveal>
              <div className="mb-5 flex items-baseline gap-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-950">
                  {group.label}
                </h3>
                <span className="h-px flex-1 bg-neutral-300" />
                <span className="text-[11px] font-medium text-neutral-400">
                  {group.services.length}
                </span>
              </div>

              <ul className="flex flex-col">
                {group.services.map((service) => (
                  <li key={service.name}>
                    <a
                      href={BUSINESS.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 border-b border-neutral-200 py-4 transition-colors hover:border-maroon/40 sm:gap-8 sm:py-5"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-semibold tracking-[-0.01em] text-neutral-950 transition-colors group-hover:text-maroon sm:text-lg">
                          {service.name}
                        </h4>
                        <p className="mt-1 truncate text-xs text-neutral-500 sm:text-[13px]">
                          {service.note}
                        </p>
                      </div>

                      <span className="hidden shrink-0 items-center gap-1.5 text-xs text-neutral-400 sm:flex">
                        <Clock size={12} />
                        {service.minutes} min
                      </span>

                      <span className="shrink-0 text-base font-semibold tabular-nums text-neutral-950 sm:text-lg">
                        A${service.price}
                      </span>

                      <MoveRight
                        size={16}
                        className="hidden shrink-0 text-neutral-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-maroon sm:block"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-12 flex flex-wrap items-center gap-4 sm:mt-16">
          <a
            href={BUSINESS.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-maroon"
          >
            Book Appointment
            <MoveRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <p className="text-xs text-neutral-500">
            {BUSINESS.payments.slice(0, 4).join(' · ')} &amp; Afterpay — secured by Square.
          </p>
        </div>
      </div>
    </section>
  );
}
