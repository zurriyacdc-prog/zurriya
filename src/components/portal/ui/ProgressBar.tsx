export function ProgressBar({ pct, color = 'bg-teal', height = 'h-2' }: {
  pct: number;
  color?: string;
  height?: string;
}) {
  return (
    <div className={`w-full ${height} bg-border/50 rounded-full overflow-hidden`}>
      <div
        className={`${height} ${color} rounded-full transition-all duration-700`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}
