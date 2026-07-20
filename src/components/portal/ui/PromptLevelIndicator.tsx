const STEPS = 5;

function formatPromptLevel(level: string) {
  return level
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function PromptLevelIndicator({
  currentPromptLevel,
  independenceScore,
  hierarchyType,
}: {
  currentPromptLevel: string;
  independenceScore: number;
  hierarchyType?: 'motor' | 'vocal';
}) {
  const pct = Math.max(0, Math.min(100, independenceScore));
  const filledSteps = Math.round((pct / 100) * STEPS);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-ink">{formatPromptLevel(currentPromptLevel)}</span>
        <span className="text-xs font-semibold text-teal">{pct}% independent</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-700 ${i < filledSteps ? 'bg-teal' : 'bg-border/50'}`} />
        ))}
      </div>
      {hierarchyType && (
        <span className="mt-1 block text-[10px] uppercase tracking-wide text-ink-2/50">
          {hierarchyType === 'motor' ? 'Motor' : 'Vocal'} prompt ladder
        </span>
      )}
    </div>
  );
}
