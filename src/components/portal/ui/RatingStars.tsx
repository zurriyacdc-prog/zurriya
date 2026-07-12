export function RatingStars({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(score);
        const half   = !filled && i < score;
        return (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" className={filled || half ? 'text-gold' : 'text-border'} fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      })}
    </span>
  );
}
