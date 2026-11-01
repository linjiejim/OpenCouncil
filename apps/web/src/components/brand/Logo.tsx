interface LogoProps {
  size?: number;
  className?: string;
  /** color of the seats + table ring; defaults to currentColor */
  stroke?: string;
  /** color of the central "question" dot */
  accent?: string;
}

/**
 * The OpenCouncil mark: a round table seen from above.
 * Seven seats are taken by the thinkers; the seat at bottom-center
 * is left open — that one is yours. The gold dot at the center is
 * the question on the table.
 */
export function Logo({ size = 24, className = '', stroke = 'currentColor', accent = 'var(--color-gold)' }: LogoProps) {
  // Seats placed around the ring, with a deliberate gap at the bottom (the open seat).
  const cx = 16;
  const cy = 16;
  const r = 10.5;
  // seat angles in degrees (0 = right, clockwise); the gap at +90° (bottom) is the open seat
  const angles = [-160, -116, -64, -20, 24, 204, 244];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* table ring */}
      <circle cx={cx} cy={cy} r={r} stroke={stroke} strokeWidth={1.6} opacity={0.9} />
      {/* taken seats */}
      {angles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(rad)}
            cy={cy + r * Math.sin(rad)}
            r={2.05}
            fill={stroke}
          />
        );
      })}
      {/* the open seat (bottom-center) — hollow */}
      <circle
        cx={cx}
        cy={cy + r}
        r={2.05}
        fill="none"
        stroke={stroke}
        strokeWidth={1.3}
        opacity={0.6}
      />
      {/* the question on the table */}
      <circle cx={cx} cy={cy} r={2.7} fill={accent} />
    </svg>
  );
}
