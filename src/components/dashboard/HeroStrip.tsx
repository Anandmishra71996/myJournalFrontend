"use client";

import Link from "next/link";
import { PencilSquareIcon, FireIcon } from "@heroicons/react/24/outline";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuthStore } from "@/store/authStore";
import type { ActivityDay } from "@/types/dashboard.types";

interface Props {
  activity: ActivityDay[];
}

function computeStreak(activity: ActivityDay[]): number {
  if (!activity.length) return 0;
  const dateSet = new Set(activity.map((a) => a.date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (dateSet.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export default function HeroStrip({ activity }: Props) {
  const { user } = useAuthStore();
  const { featureLimits, usage, tier } = useSubscriptionStore();
  const streak = computeStreak(activity);

  const journalLimit = featureLimits.maxJournalsPerMonth;
  const journalUsed = usage?.journalsThisMonth ?? 0;
  const goalLimit = featureLimits.maxActiveGoals;
  const goalUsed = usage?.activeGoals ?? 0;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[var(--color-surface-low)] p-5 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] sm:p-6">
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]">{greeting}</p>
        <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
          {user?.name?.split(" ")[0] ?? "there"} ✦
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-high)] px-4 py-2.5 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)]">
          <FireIcon className="h-5 w-5 text-orange-400" />
          <div>
            <p className="text-lg font-bold leading-none text-[var(--color-text-primary)]">{streak}</p>
            <p className="text-[10px] text-[var(--color-text-tertiary)]">day streak</p>
          </div>
        </div>

        {/* Journals this month */}
        <div className="rounded-xl bg-[var(--color-surface-high)] px-4 py-2.5 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)]">
          <p className="text-lg font-bold leading-none text-[var(--color-text-primary)]">
            {journalUsed}
            <span className="text-sm font-medium text-[var(--color-text-tertiary)]">
              {journalLimit === null ? "" : ` / ${journalLimit}`}
            </span>
          </p>
          <p className="text-[10px] text-[var(--color-text-tertiary)]">journals this month</p>
          {journalLimit !== null && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface-highest)]">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${Math.min(100, (journalUsed / journalLimit) * 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Active goals */}
        <div className="rounded-xl bg-[var(--color-surface-high)] px-4 py-2.5 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)]">
          <p className="text-lg font-bold leading-none text-[var(--color-text-primary)]">
            {goalUsed}
            <span className="text-sm font-medium text-[var(--color-text-tertiary)]">
              {goalLimit === null ? "" : ` / ${goalLimit}`}
            </span>
          </p>
          <p className="text-[10px] text-[var(--color-text-tertiary)]">active goals</p>
          {goalLimit !== null && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface-highest)]">
              <div
                className="h-full rounded-full bg-[var(--color-secondary)] transition-all"
                style={{ width: `${Math.min(100, (goalUsed / goalLimit) * 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Quick write */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-goal-cta-text)] shadow-[0_6px_18px_color-mix(in_srgb,var(--color-primary-dark)_30%,transparent)] transition-all hover:opacity-90"
        >
          <PencilSquareIcon className="h-4 w-4" />
          Write
        </Link>
      </div>
    </div>
  );
}
