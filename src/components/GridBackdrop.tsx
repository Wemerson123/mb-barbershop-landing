import { GRID_CELL } from '../lib/constants';

type GridBackdropProps = {
  /** Parallax offset in px, applied to the pattern origin. */
  offsetX: number;
  offsetY: number;
  stroke?: string;
  opacity?: number;
  id?: string;
};

/**
 * The drafting-paper grid behind the hero. Drifts a few pixels against the
 * cursor, which is enough to make the panel feel like it has depth without
 * anyone noticing why.
 */
export function GridBackdrop({
  offsetX,
  offsetY,
  stroke = '#64748b',
  opacity = 0.1,
  id = 'grid',
}: GridBackdropProps) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={id}
          width={GRID_CELL}
          height={GRID_CELL}
          x={offsetX}
          y={offsetY}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${GRID_CELL} 0 L 0 0 0 ${GRID_CELL}`}
            fill="none"
            stroke={stroke}
            strokeWidth="0.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
