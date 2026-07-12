export function ProgressRing({ pct, size = 96, stroke = 8, color = '#1B5E6E' }: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r       = (size - stroke) / 2;
  const circum  = 2 * Math.PI * r;
  const offset  = circum - (pct / 100) * circum;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E0D9CF" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circum}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
    </svg>
  );
}
