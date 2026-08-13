/**
 * Every value in this file was taken from MB Barbershop's own live site
 * (mbbarbershop.com.au, a Square Online store) and their Instagram bio.
 * Nothing here is invented — if a claim isn't in this file, it isn't on the page.
 */

export const BUSINESS = {
  name: 'MB Barbershop',
  tagline: 'Brisbane Barber',
  /** Owner. Display name per the owner himself; the handle keeps its spelling. */
  owner: 'Manolo',
  ownerRole: 'Owner & Barber',
  barberHandle: '@manollo_barber',
  instagramHandle: '@mbbarbershop2025',
  instagramUrl: 'https://instagram.com/mbbarbershop2025',
  barberInstagramUrl: 'https://instagram.com/manollo_barber',
  bookingUrl: 'https://www.mbbarbershop.com.au/s/appointments',
  siteUrl: 'https://www.mbbarbershop.com.au/',
  phone: '0481 722 499',
  phoneHref: 'tel:+61481722499',
  email: 'mbbarbershop2025@gmail.com',
  address: {
    line1: '5/149 Caxton St',
    line2: 'Paddington, Queensland 4064',
    suburb: 'Paddington',
    city: 'Brisbane',
    street: 'Caxton Street',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=5/149+Caxton+St+Paddington+QLD+4064',
    lat: -27.462254,
    lng: 153.009323,
  },
  payments: ['Apple Pay', 'Google Pay', 'Visa', 'Mastercard', 'Amex', 'Afterpay'],
} as const;

export type Service = {
  name: string;
  price: number;
  minutes: number;
  /** Short, factual description of the service. */
  note: string;
};

export type ServiceGroup = {
  id: string;
  label: string;
  services: Service[];
};

/** Exact menu, prices (AUD) and durations as listed on the booking page. */
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: 'haircuts',
    label: 'Haircuts',
    services: [
      {
        name: 'Scissor Cut',
        price: 65,
        minutes: 30,
        note: 'Shape and texture worked entirely by hand, no clippers.',
      },
      {
        name: 'Zero / Skin Fade',
        price: 60,
        minutes: 30,
        note: 'Blended down to bare skin, finished with a razor line-up.',
      },
      {
        name: 'Simple Fade',
        price: 50,
        minutes: 30,
        note: 'Clean tapered sides, soft blend, sharp neckline.',
      },
      {
        name: 'Kids Cuts',
        price: 46,
        minutes: 30,
        note: 'Ages 2 to 12. Unhurried, and no drama in the chair.',
      },
    ],
  },
  {
    id: 'beard',
    label: 'Beard',
    services: [
      {
        name: 'Beard Therapy',
        price: 60,
        minutes: 30,
        note: 'Hot towel, shape, razor finish — the full ritual.',
      },
      {
        name: 'Beard Design',
        price: 50,
        minutes: 30,
        note: 'Lines set to your jaw, trimmed to the length you want.',
      },
    ],
  },
  {
    id: 'detail',
    label: 'Detail',
    services: [
      {
        name: 'Colouring — Black All Over',
        price: 40,
        minutes: 30,
        note: 'Single-process black, evenly through.',
      },
      {
        name: 'Eyebrows with Tweezers',
        price: 30,
        minutes: 20,
        note: 'Shaped hair by hair for a softer edge.',
      },
      {
        name: 'Eyebrows with Razor',
        price: 15,
        minutes: 10,
        note: 'Quick, precise clean-up.',
      },
      {
        name: 'Nostril Wax',
        price: 15,
        minutes: 15,
        note: 'Fifteen seconds of regret, four weeks of tidy.',
      },
      { name: 'Ear Waxing', price: 15, minutes: 15, note: 'Same deal, different hole.' },
    ],
  },
];

/**
 * Entry price for an actual haircut. Deliberately not the minimum across all
 * services — the cheapest line on the menu is a $15 nostril wax, and quoting
 * "cuts from $15" off the back of that would be a lie.
 */
export const HAIRCUT_FROM = Math.min(
  ...(SERVICE_GROUPS.find((g) => g.id === 'haircuts')?.services ?? []).map((s) => s.price),
);

export const NAV_LINKS = [
  { label: 'The Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Manolo', href: '#manolo' },
  { label: 'Visit', href: '#visit' },
] as const;
