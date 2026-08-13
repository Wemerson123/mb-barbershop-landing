import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { BUSINESS, NAV_LINKS } from '../lib/business';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer data-surface="dark" className="bg-neutral-950 pb-8 pt-16 text-white sm:pt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="text-white" className="mb-4" />
            <p className="max-w-xs text-[13px] leading-relaxed text-white/45">
              {BUSINESS.tagline} on {BUSINESS.address.street}, {BUSINESS.address.suburb}. Fades,
              beards and razor detail, six days a week.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Sections
            </h2>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13px] text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Contact
            </h2>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={BUSINESS.address.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  <MapPin size={14} className="mt-0.5 shrink-0 text-white/30" />
                  <span>
                    {BUSINESS.address.line1}, {BUSINESS.address.suburb} QLD 4064
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.phoneHref}
                  className="flex items-center gap-2.5 text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  <Phone size={14} className="shrink-0 text-white/30" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-2.5 break-all text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  <Mail size={14} className="shrink-0 text-white/30" />
                  {BUSINESS.email}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  <Instagram size={14} className="shrink-0 text-white/30" />
                  {BUSINESS.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Booking
            </h2>
            <a
              href={BUSINESS.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-neutral-950 transition-colors hover:bg-maroon hover:text-white"
            >
              Book Appointment
            </a>
            <p className="text-[11px] leading-relaxed text-white/35">
              {BUSINESS.payments.join(' · ')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <p className="text-[11px] text-white/30">
            Bookings and payments secured by Square.
          </p>
        </div>
      </div>
    </footer>
  );
}
