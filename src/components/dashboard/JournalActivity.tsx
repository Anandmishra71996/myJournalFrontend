"use client";

import Link from "next/link";
import type { ActivityDay, JournalStats } from "@/types/dashboard.types";

interface Props {
  activity: ActivityDay[];
  stats: JournalStats | null;
  days: number;
}

function formatSeconds(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
}

function Heatmap({ activity, days }: { activity: ActivityDay[]; days: number }) {
  const dateMap = new Map(activity.map((a) => [a.date, a]));

  const cells: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    cells.push({ date: key, count: dateMap.get(key)?.count ?? 0 });
  }

  const max = Math.max(...cells.map((c) => c.count), 1);

  const intensity = (count: number) => {
    if (count === 0) return "bg-[var(--color-surface-high)]";
    const r = count / max;
    if (r < 0.34) return "bg-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)]";
    if (r < 0.67) return "bg-[color:color-mix(in_srgb,var(--color-primary)_60%,transparent)]";
    return "bg-[var(--color-primary)]";
  };

  const cols = Math.ceil(days / 7);

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
      >
        {cells.map((cell) => (
          <div
            key={cell.date}
            title={`${cell.date}: ${cell.count} entr${cell.count === 1 ? "y" : "ies"}`}
            className={`h-3 w-3 rounded-sm transition-colors ${intensity(cell.count)}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function JournalActivity({ activity, stats, days }: Props) {
  const totalEntries = activity.reduce((s, a) => s + a.count, 0);
  const activeDays = activity.filter((a) => a.count > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Journaling Activity</h2>
        <Link
          href="/journal"
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
        >
          Open Journal →
        </Link>
      </div>

      <div className="rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] sm:p-5">
        <div className="mb-3 flex flex-wrap gap-4 text-sm">
          <span className="text-[var(--color-text-secondary)]">
            <span className="font-bold text-[var(--color-text-primary)]">{totalEntries}</span> entries
          </span>
          <span className="text-[var(--color-text-secondary)]">
            <span className="font-bold text-[var(--color-text-primary)]">{activeDays}</span> active days
          </span>
        </div>
        <Heatmap activity={activity} days={days} />
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* By type */}
          {(["morning", "evening", "anytime"] as const).map((t) => (
            <div
              key={t}
              className="rounded-xl bg-[var(--color-surface-low)] p-3 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]"
            >
              <p className="text-lg font-bold text-[var(--color-text-primary)]">{stats.byType[t]}</p>
              <p className="text-xs capitalize text-[var(--color-text-tertiary)]">{t}</p>
            </div>
          ))}

          {/* Voice notes */}
          <div className="rounded-xl bg-[var(--color-surface-low)] p-3 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
            <p className="text-lg font-bold text-[var(--color-text-primary)]">{stats.voiceNoteCount}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              voice notes{stats.totalVoiceSeconds > 0 ? ` · ${formatSeconds(stats.totalVoiceSeconds)}` : ""}
            </p>
          </div>
        </div>
      )}

      {stats && stats.topTags.length > 0 && (
        <div className="rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Top Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.topTags.map(({ tag, count }) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-surface-high)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
              >
                {tag} <span className="text-[var(--color-text-tertiary)]">·{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
