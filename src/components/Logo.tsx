type LogoProps = {
  className?: string;
  /** Tailwind text colour class for the mark. */
  tone?: string;
};

/**
 * Typographic MB lockup, echoing the shop's own mark: heavy MB with
 * BARBERSHOP ruled through it. Set in type rather than shipped as a PNG so it
 * stays sharp at any size and inherits colour from the section it sits in.
 */
export function Logo({ className = '', tone = 'text-neutral-950' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${tone} ${className}`}>
      <span className="text-[22px] font-bold leading-none tracking-[-0.06em]">MB</span>
      <span className="flex flex-col gap-[3px] pt-[1px]">
        <span className="h-[1.5px] w-9 bg-current opacity-90" />
        <span className="text-[7px] font-semibold uppercase leading-none tracking-[0.24em] opacity-80">
          Barbershop
        </span>
      </span>
    </span>
  );
}
