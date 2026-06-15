"use client";

import type { DashboardFilters } from "@/types/dashboard.types";

interface Props {
  filters: DashboardFilters;
  onChange: (f: Partial<DashboardFilters>) => void;
}

const TIME_OPTIONS: { label: string; value: DashboardFilters["timeRange"] }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

const TYPE_OPTIONS: { label: string; value: DashboardFilters["journalType"] }[] = [
  { label: "All", value: "all" },
  { label: "Morning", value: "morning" },
  { label: "Evening", value: "evening" },
  { label: "Anytime", value: "anytime" },
];

const CATEGORY_OPTIONS: { label: string; value: DashboardFilters["goalCategory"] }[] = [
  { label: "All", value: "all" },
  { label: "Health", value: "Health" },
  { label: "Career", value: "Career" },
  { label: "Learning", value: "Learning" },
  { label: "Mindset", value: "Mindset" },
  { label: "Relationships", value: "Relationships" },
  { label: "Personal", value: "Personal" },
];

function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {label}
      </span>
      <div className="flex gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              value === o.value
                ? "bg-[var(--color-primary)] text-[var(--color-goal-cta-text)]"
                : "bg-[var(--color-surface-high)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-bright)]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GlobalFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-[var(--color-surface-low)] px-5 py-3 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_12%,transparent)]">
      <FilterPills
        label="Period"
        options={TIME_OPTIONS}
        value={filters.timeRange}
        onChange={(v) => onChange({ timeRange: v })}
      />
      <div className="hidden h-5 w-px bg-[var(--color-outline-variant)] sm:block" />
      <FilterPills
        label="Journal"
        options={TYPE_OPTIONS}
        value={filters.journalType}
        onChange={(v) => onChange({ journalType: v })}
      />
      <div className="hidden h-5 w-px bg-[var(--color-outline-variant)] sm:block" />
      <FilterPills
        label="Category"
        options={CATEGORY_OPTIONS}
        value={filters.goalCategory}
        onChange={(v) => onChange({ goalCategory: v })}
      />
    </div>
  );
}
