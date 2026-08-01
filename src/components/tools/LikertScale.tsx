interface LikertScaleProps {
  question: string;
  lowLabel: string;
  highLabel: string;
  value: number | null;
  onChange: (value: number) => void;
}

export default function LikertScale({
  question,
  lowLabel,
  highLabel,
  value,
  onChange,
}: LikertScaleProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{question}</p>
      <div className="flex items-center gap-2" role="radiogroup" aria-label={question}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={`flex h-10 flex-1 items-center justify-center rounded-xl border text-sm font-semibold transition ${
              value === n
                ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white shadow-md"
                : "border-[color:var(--color-border)] bg-background text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-primary)]/50"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
