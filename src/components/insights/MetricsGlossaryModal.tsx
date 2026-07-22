"use client";

import { XMarkIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { MetricsSnapshot } from "@/constants/insight.constants";

interface MetricsGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics?: MetricsSnapshot;
}

type Band = "low" | "moderate" | "high";

function pctBand(value: number, lowMax = 0.33, highMin = 0.66): Band {
  if (value < lowMax) return "low";
  if (value >= highMin) return "high";
  return "moderate";
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

interface MetricDef {
  key: keyof MetricsSnapshot;
  label: string;
  scaleLabel: string;
  format: (v: number) => string;
  whatItMeasures: string;
  math: string;
  interpret: (v: number) => string;
}

const METRIC_DEFS: MetricDef[] = [
  {
    key: "avgEmotionalIntensity",
    label: "Emotional Intensity Average",
    scaleLabel: "0 (neutral) to 10 (extreme)",
    format: (v) => `${v.toFixed(2)} / 10`,
    whatItMeasures:
      "How strongly felt or emotionally charged your journal entries were, on a scale from 0 to 10.",
    math:
      "0 = pure, neutral reporting (e.g. \"Ate lunch, coded for 2 hours\"). 10 = extreme emotional expressiveness (e.g. \"I am completely exhausted and furious about this delay\"). Your entries are scored individually and averaged for the week.",
    interpret: (v) => {
      if (v < 2)
        return "Your writing this week was highly clinical, matter-of-fact, or detached — closer to reporting than reflecting. Combined with flat language (\"did not do a lot\"), this usually reads as emotional flatness or task aversion — feeling unmotivated or checked out — rather than active distress.";
      if (v < 5)
        return "Your entries carried a moderate emotional register — you mixed plain reporting with some real feeling, without leaning heavily into either.";
      return "Your entries were highly emotionally expressive this week — you wrote with strong, charged language rather than detached reporting.";
    },
  },
  {
    key: "resilienceFrequency",
    label: "Resilience Frequency",
    scaleLabel: "0% to 100%",
    format: pct,
    whatItMeasures:
      "How often you actively face, adapt to, or push through a challenge, out of all your entries.",
    math:
      "Resilience Frequency = (entries showing bounce-back / coping ÷ total entries) × 100.",
    interpret: (v) => {
      const band = pctBand(v);
      if (band === "low")
        return "Setback-and-recovery moments show up in a minority of your entries this week — either you faced fewer obstacles, or you didn't log how you responded to them.";
      if (band === "moderate")
        return "You logged a fair number of moments where you hit an obstacle and noted how you handled it — encountering and naming setbacks is a recurring, but not dominant, theme.";
      return "In most of your entries, you encountered an obstacle (bad weather, pain, a disruption) but noted it down and kept going — facing setbacks head-on is a frequent theme in your journaling.";
    },
  },
  {
    key: "resilienceIndex",
    label: "Resilience Index",
    scaleLabel: "-100 (derailed) to 100 (fully recovered)",
    format: (v) => `${v.toFixed(1)} / 100`,
    whatItMeasures:
      "The depth or quality of your recovery — not how often you face setbacks, but how effectively you actually bounced back from them.",
    math:
      "Resilience Index is derived from Resilience Frequency minus Burnout Frequency, scaled to -100..100. Frequency answers \"how often do I talk about facing problems?\"; Index answers \"how effectively did I recover from them?\"",
    interpret: (v) => {
      if (v < 0)
        return "This is negative, which means setbacks derailed your planned routine or mood more often than you recovered from them this week.";
      if (v < 50)
        return "This is below the midpoint — you're encountering and acknowledging disruptions, but they still succeed in derailing your plans or mood a good chunk of the time.";
      return "This is a strong score — when you hit a setback, you tend to actually recover and get back on track, not just note the problem and stall.";
    },
  },
  {
    key: "avgActionRatio",
    label: "Action Consistency",
    scaleLabel: "0% to 100%",
    format: pct,
    whatItMeasures:
      "How often your journal entries describe you actually following through on planned actions, rather than just intentions or reflections.",
    math:
      "Weighted average, across the week's entries, of the share of each entry that describes completed action versus intention or commentary.",
    interpret: (v) => {
      const band = pctBand(v);
      if (band === "low")
        return "Follow-through was light this week — your entries leaned more toward intentions, plans, or reflection than logged action.";
      if (band === "moderate")
        return "You showed a moderate level of follow-through — a mix of planned action and drift.";
      return "You followed through on planned actions consistently this week — your entries are dominated by logged execution, not just intention.";
    },
  },
  {
    key: "executionConsistencyScore",
    label: "Execution Consistency Score",
    scaleLabel: "0 to 100",
    format: (v) => `${v.toFixed(1)} / 100`,
    whatItMeasures:
      "Your longer-term reliability at following through on plans, smoothed across recent weeks rather than just this one — the persistent version of Action Consistency.",
    math:
      "A percentile score derived from your rolling average Action Consistency across recent weeks, updated only when the change is large enough to be meaningful.",
    interpret: (v) => {
      if (v < 40)
        return "Your track record over recent weeks shows inconsistent follow-through on plans.";
      if (v < 70)
        return "Your track record over recent weeks shows moderate, workable consistency.";
      return "Your track record over recent weeks shows strong, dependable follow-through on plans.";
    },
  },
  {
    key: "growthMindsetRatio",
    label: "Growth Mindset Ratio",
    scaleLabel: "0% to 100%",
    format: pct,
    whatItMeasures:
      "The share of entries where you frame a challenge as something you can learn from or improve at, versus something fixed or out of your control.",
    math:
      "Each entry is classified as growth-framed, fixed-framed, or mixed; this is the share classified as growth-framed.",
    interpret: (v) => {
      const band = pctBand(v);
      if (band === "low")
        return "Growth-oriented framing was rare in your entries this week — challenges were more often described as fixed or unchangeable than as something to work through.";
      if (band === "moderate")
        return "You showed a mix of growth-oriented and fixed framing when writing about challenges.";
      return "You consistently framed challenges as things you can learn from or improve at, rather than as fixed obstacles.";
    },
  },
  {
    key: "internalLocusRatio",
    label: "Internal Locus of Control",
    scaleLabel: "0% to 100%",
    format: pct,
    whatItMeasures:
      "The share of entries where you attribute what happened to your own choices and actions, rather than to external circumstances.",
    math:
      "Each entry is classified by whether its cause-and-effect language points to something you controlled (internal) or something outside you (external); this is the internal share.",
    interpret: (v) => {
      const band = pctBand(v);
      if (band === "low")
        return "You more often attributed this week's outcomes to external circumstances (weather, other people, situations) rather than your own choices.";
      if (band === "moderate")
        return "You attributed outcomes to a mix of your own choices and outside circumstances.";
      return "You consistently framed this week's outcomes as a result of your own choices and actions.";
    },
  },
  {
    key: "agencyScore",
    label: "Agency Score",
    scaleLabel: "0 to 100",
    format: (v) => `${v.toFixed(1)} / 100`,
    whatItMeasures:
      "Your persistent tendency to see yourself as the driver of outcomes rather than at the mercy of circumstances, tracked across recent weeks.",
    math:
      "A percentile score derived from your rolling average Internal Locus of Control ratio across recent weeks.",
    interpret: (v) => {
      if (v < 40)
        return "Over recent weeks, you've more often described outcomes as driven by circumstances outside your control.";
      if (v < 70)
        return "Over recent weeks, you've shown a balanced sense of control over outcomes.";
      return "Over recent weeks, you've consistently framed yourself as the one driving outcomes, not just reacting to them.";
    },
  },
  {
    key: "procrastinationFrequency",
    label: "Procrastination Frequency",
    scaleLabel: "0% to 100%",
    format: pct,
    whatItMeasures:
      "How often your entries mention delaying, avoiding, or putting off something you intended to do.",
    math:
      "Share of this week's entries containing language classified as procrastination or avoidance.",
    interpret: (v) => {
      const band = pctBand(v, 0.2, 0.5);
      if (band === "low")
        return "Delay and avoidance language was rare in your entries this week.";
      if (band === "moderate")
        return "Delay or avoidance came up in a meaningful minority of your entries this week.";
      return "Delay or avoidance language showed up often this week — putting things off looks like a recurring pattern, not a one-off.";
    },
  },
  {
    key: "burnoutFrequency",
    label: "Burnout Frequency",
    scaleLabel: "0% to 100%",
    format: pct,
    whatItMeasures:
      "How often your entries show signs of exhaustion, overwhelm, or depletion.",
    math:
      "Share of this week's entries containing language classified as burnout or exhaustion.",
    interpret: (v) => {
      const band = pctBand(v, 0.2, 0.5);
      if (band === "low")
        return "Signs of exhaustion or overwhelm were rare in your entries this week.";
      if (band === "moderate")
        return "Some entries this week showed signs of exhaustion or feeling overwhelmed.";
      return "Exhaustion or overwhelm showed up often this week — this is a pattern worth paying attention to, not an isolated moment.";
    },
  },
  {
    key: "volatilityIndex",
    label: "Volatility Index",
    scaleLabel: "0 and up (no fixed ceiling)",
    format: (v) => v.toFixed(1),
    whatItMeasures:
      "How much your emotional intensity swings from entry to entry, tracked across recent weeks — not your average feeling, but how erratic it is.",
    math:
      "Your emotional intensity variance across recent weeks, scaled by 100. Low values mean a steady emotional register; high values mean it swings a lot.",
    interpret: (v) => {
      if (v < 15)
        return "Your emotional register has stayed fairly steady across recent weeks — few sharp swings.";
      if (v < 40)
        return "Your emotional register has shown some noticeable swings across recent weeks.";
      return "Your emotional register has been swinging sharply across recent weeks — intense entries followed by flat ones, or vice versa.";
    },
  },
];

export default function MetricsGlossaryModal({
  isOpen,
  onClose,
  metrics,
}: MetricsGlossaryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="metrics-glossary-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-[var(--color-surface-low)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] shadow-2xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] px-5 py-4">
          <div>
            <h2
              id="metrics-glossary-title"
              className="flex items-center gap-2 text-lg font-bold text-[var(--color-text-primary)]"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 text-[var(--color-primary)]" />
              What these numbers mean
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
              Every metric this week&apos;s insight is grounded in, explained with your values
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close glossary"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-high)]"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {!metrics && (
            <div className="rounded-xl bg-[var(--color-surface-high)] p-4 text-sm text-[var(--color-text-secondary)]">
              This insight was generated before we started saving your metric values.
              Regenerate it to see your numbers alongside each explanation below.
            </div>
          )}

          {METRIC_DEFS.map((def) => {
            const raw = metrics?.[def.key];
            const value = typeof raw === "number" ? raw : undefined;

            return (
              <div
                key={def.key}
                className="rounded-xl bg-[var(--color-surface-high)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_12%,transparent)]"
              >
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    {def.label}
                  </h3>
                  {value !== undefined ? (
                    <span className="rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_16%,transparent)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
                      {def.format(value)}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      Scale: {def.scaleLabel}
                    </span>
                  )}
                </div>

                <p className="text-sm text-[var(--color-text-secondary)]">
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    What it measures:{" "}
                  </span>
                  {def.whatItMeasures}
                </p>

                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
                  <span className="font-semibold">The math: </span>
                  {def.math}
                </p>

                {value !== undefined && (
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      What this means for you:{" "}
                    </span>
                    {def.interpret(value)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
