type GaugeTone = "primary" | "good" | "warning" | "critical";

interface MetricGaugeProps {
  title: string;
  score: number; // 0-100
  label: string;
  lowPole: string;
  highPole: string;
  tone?: GaugeTone;
}

const TONE_CLASSES: Record<GaugeTone, { fill: string; badge: string }> = {
  primary: {
    fill: "bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)]",
    badge: "bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)] text-[color:var(--color-primary)]",
  },
  good: {
    fill: "bg-emerald-500",
    badge: "bg-emerald-500/14 text-emerald-500",
  },
  warning: {
    fill: "bg-amber-400",
    badge: "bg-amber-400/16 text-amber-500 dark:text-amber-400",
  },
  critical: {
    fill: "bg-red-400",
    badge: "bg-red-400/16 text-red-500 dark:text-red-400",
  },
};

export default function MetricGauge({
  title,
  score,
  label,
  lowPole,
  highPole,
  tone = "primary",
}: MetricGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const toneClasses = TONE_CLASSES[tone];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold tracking-tight">{title}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneClasses.badge}`}>
          {label}
        </span>
      </div>
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--color-border)]"
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title}: ${clamped} out of 100, ${label}`}
      >
        <div
          className={`h-full rounded-full transition-all ${toneClasses.fill}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
        <span>{lowPole}</span>
        <span>{highPole}</span>
      </div>
    </div>
  );
}
