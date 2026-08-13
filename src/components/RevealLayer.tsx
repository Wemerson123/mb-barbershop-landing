import { useEffect, useMemo, useState } from 'react';
import { SPOTLIGHT_R } from '../lib/constants';

/**
 * Builds the spotlight mask on a canvas — a radial gradient filled into a
 * circle of radius SPOTLIGHT_R — and exports it once as a data URL.
 *
 * The canvas is deliberately sized to the spotlight (2R x 2R) rather than the
 * viewport, so `toDataURL()` runs a single time instead of once per frame.
 * Moving the cursor then only changes `mask-position`, which the compositor
 * handles for free. A viewport-sized canvas re-encoded every frame produces
 * the same pixels but costs 30-80ms per frame, which visibly stutters.
 */
function useSpotlightMask(): string | null {
  const [mask, setMask] = useState<string | null>(null);

  useEffect(() => {
    const size = SPOTLIGHT_R * 2;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    const gradient = ctx.createRadialGradient(
      SPOTLIGHT_R,
      SPOTLIGHT_R,
      0,
      SPOTLIGHT_R,
      SPOTLIGHT_R,
      SPOTLIGHT_R,
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(SPOTLIGHT_R, SPOTLIGHT_R, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    setMask(canvas.toDataURL());
  }, []);

  return mask;
}

type RevealLayerProps = {
  /** Cursor position relative to the hero. */
  x: number;
  y: number;
  active: boolean;
  image: string;
  /** Rendered underneath the mask, revealed inside the spotlight. */
  className?: string;
};

export function RevealLayer({ x, y, active, image, className = '' }: RevealLayerProps) {
  const mask = useSpotlightMask();
  const size = SPOTLIGHT_R * 2;

  const style = useMemo(() => {
    if (!mask) return { opacity: 0 };

    const position = `${Math.round(x - SPOTLIGHT_R)}px ${Math.round(y - SPOTLIGHT_R)}px`;
    const maskSize = `${size}px ${size}px`;

    return {
      backgroundImage: `url('${image}')`,
      maskImage: `url('${mask}')`,
      WebkitMaskImage: `url('${mask}')`,
      maskSize,
      WebkitMaskSize: maskSize,
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: position,
      WebkitMaskPosition: position,
      opacity: active ? 1 : 0,
    } as React.CSSProperties;
  }, [mask, image, x, y, active, size]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-30 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${className}`}
      style={style}
    />
  );
}
