const ITEMS = [
  'Skin Fades',
  'Scissor Work',
  'Beard Therapy',
  'Razor Line-ups',
  'Kids Cuts',
  'Caxton Street',
];

/**
 * Barber-pole rule over a running strip of what the shop actually does.
 * Duplicated once and translated -50%, so the loop is seamless.
 */
export function Marquee() {
  const run = [...ITEMS, ...ITEMS];

  return (
    <div
      data-surface="dark"
      className="relative overflow-hidden border-y border-white/10 bg-neutral-950"
    >
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, #800000 0 14px, #f5f2ed 14px 28px, #0a0a0a 28px 42px)',
        }}
      />
      <div className="flex overflow-hidden py-5">
        <div
          className="flex w-max shrink-0 motion-safe:animate-marquee"
          aria-hidden="true"
        >
          {run.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45 sm:px-9 sm:text-xs"
            >
              {item}
              <span className="ml-6 h-1 w-1 rounded-full bg-maroon sm:ml-9" />
            </span>
          ))}
        </div>
      </div>
      <span className="sr-only">
        Services: {ITEMS.join(', ')}
      </span>
    </div>
  );
}
