"use client";

import Link from "next/link";
import type { DashboardGoal, LatestInsight } from "@/types/dashboard.types";

interface Props {
  goals: DashboardGoal[];
  latestInsight: LatestInsight | null;
}

const ALIGNMENT_STYLES: Record<string, string> = {
  aligned: "bg-emerald-500/15 text-emerald-400",
  partially_aligned: "bg-amber-500/15 text-amber-400",
  needs_adjustment: "bg-red-500/15 text-red-400",
};

const ALIGNMENT_LABELS: Record<string, string> = {
  aligned: "Aligned",
  partially_aligned: "Partial",
  needs_adjustment: "Adjust",
};

const CATEGORY_COLORS: Record<string, string> = {
  Health: "bg-green-500/15 text-green-400",
  Career: "bg-blue-500/15 text-blue-400",
  Learning: "bg-purple-500/15 text-purple-400",
  Mindset: "bg-indigo-500/15 text-indigo-400",
  Relationships: "bg-pink-500/15 text-pink-400",
  Personal: "bg-orange-500/15 text-orange-400",
};

export default function GoalSection({ goals, latestInsight }: Props) {
  const alignmentMap = new Map(
    latestInsight?.goalSummaries.map((g) => [g.goalId, g]) ?? []
  );

  if (goals.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Goals</h2>
        <div className="rounded-xl bg-[var(--color-surface-low)] p-5 text-center outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
          <p className="text-sm text-[var(--color-text-secondary)]">No active goals.</p>
          <Link href="/goals/create" className="mt-2 inline-block text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Create your first goal →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Goals</h2>
        <Link href="/goals" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
          All Goals →
        </Link>
      </div>

      <div className="space-y-2">
        {goals.map((goal) => {
          const alignment = alignmentMap.get(goal._id);
          const pct = goal.progress?.completionPercentage ?? 0;
          const hitRate = goal.progress?.signalHitRate;

          return (
            <div
              key={goal._id}
              className="rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CATEGORY_COLORS[goal.category] ?? "bg-[var(--color-surface-high)] text-[var(--color-text-secondary)]"}`}
                  >
                    {goal.category}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
                    {goal.type}
                  </span>
                </div>
                {alignment && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ALIGNMENT_STYLES[alignment.status]}`}
                    title={alignment.explanation}
                  >
                    {ALIGNMENT_LABELS[alignment.status]}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">{goal.title}</p>

              {pct > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-[var(--color-text-tertiary)]">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-highest)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {hitRate !== undefined && hitRate !== null && (
                <p className="mt-1.5 text-[10px] text-[var(--color-text-tertiary)]">
                  Journal signal rate:{" "}
                  <span className="font-semibold text-[var(--color-text-secondary)]">
                    {Math.round(hitRate * 100)}%
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
