"use client";

import Link from "next/link";
import { SparklesIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import type { LatestInsight } from "@/types/dashboard.types";

interface Props {
  insight: LatestInsight | null;
  hasAccess: boolean;
}

const CHALLENGE_COLORS: Record<string, string> = {
  procrastination: "bg-orange-500/15 text-orange-400",
  time_management: "bg-blue-500/15 text-blue-400",
  emotional_regulation: "bg-purple-500/15 text-purple-400",
  focus: "bg-indigo-500/15 text-indigo-400",
  consistency: "bg-teal-500/15 text-teal-400",
  stress: "bg-red-500/15 text-red-400",
  other: "bg-[var(--color-surface-high)] text-[var(--color-text-secondary)]",
};

export default function InsightSnapshot({ insight, hasAccess }: Props) {
  if (!hasAccess) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Weekly Insight</h2>
        <div className="rounded-xl bg-[var(--color-surface-low)] p-5 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
          <div className="flex flex-col items-center gap-2 text-center">
            <LockClosedIcon className="h-6 w-6 text-[var(--color-text-tertiary)]" />
            <p className="text-sm text-[var(--color-text-secondary)]">
              Weekly insights are available on Reflect and Thrive plans.
            </p>
            <Link href="/subscription" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
              Upgrade →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Weekly Insight</h2>
        <div className="rounded-xl bg-[var(--color-surface-low)] p-5 text-center outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
          <SparklesIcon className="mx-auto h-8 w-8 text-[var(--color-text-tertiary)]" />
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">No insights generated yet.</p>
          <Link href="/insights" className="mt-1 inline-block text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Generate your first insight →
          </Link>
        </div>
      </div>
    );
  }

  const weekLabel = new Date(insight.weekStart).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const weekEndLabel = new Date(insight.weekEnd).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Weekly Insight</h2>
        <Link href="/insights" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
          Full insight →
        </Link>
      </div>

      <div className="rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-[var(--color-primary)]" />
          <p className="text-xs font-semibold text-[var(--color-text-tertiary)]">
            {weekLabel} – {weekEndLabel} · {insight.journalCount} entries
          </p>
        </div>

        <ul className="space-y-2">
          {insight.reflection.slice(0, 3).map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{point}</span>
            </li>
          ))}
        </ul>

        {insight.challengesFaced.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {insight.challengesFaced.map((c, i) => (
              <span
                key={i}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${CHALLENGE_COLORS[c.challengeType] ?? CHALLENGE_COLORS.other}`}
              >
                {c.challengeType.replace("_", " ")}
              </span>
            ))}
          </div>
        )}

        {insight.suggestion && (
          <p className="mt-3 rounded-lg bg-[color:color-mix(in_srgb,var(--color-secondary-dark)_12%,transparent)] p-3 text-xs leading-relaxed text-[var(--color-text-secondary)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)]">
            {insight.suggestion}
          </p>
        )}
      </div>
    </div>
  );
}
