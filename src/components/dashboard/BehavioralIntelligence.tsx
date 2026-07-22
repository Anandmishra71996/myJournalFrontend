"use client";

import Link from "next/link";
import { LockClosedIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/outline";
import BehavioralTrends from "./BehavioralTrends";
import type {
  BehavioralMetrics,
  BehavioralHistoryPoint,
  MemoryPattern,
  MetricExplanation,
} from "@/types/dashboard.types";

interface Props {
  data: BehavioralMetrics | null;
  memories: MemoryPattern[];
  history: BehavioralHistoryPoint[];
  maxWeeks: number;
  hasAccess: boolean;
}

function TrendIcon({ trend }: { trend: "improving" | "declining" | "stable" }) {
  if (trend === "improving") return <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-400" />;
  if (trend === "declining") return <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />;
  return <MinusIcon className="h-4 w-4 text-[var(--color-text-tertiary)]" />;
}

function ScoreTile({
  label,
  value,
  max = 100,
  suffix = "",
  trend,
}: {
  label: string;
  value?: number;
  max?: number;
  suffix?: string;
  trend?: "improving" | "declining" | "stable";
}) {
  const pct = value !== undefined ? Math.min(100, Math.max(0, ((value + max) / (2 * max)) * 100)) : null;
  return (
    <div className="rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">{label}</p>
        {trend && <TrendIcon trend={trend} />}
      </div>
      <p className="mt-1 text-2xl font-extrabold text-[var(--color-text-primary)]">
        {value !== undefined ? `${Math.round(value)}${suffix}` : "—"}
      </p>
      {pct !== null && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-surface-highest)]">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function FreqMeter({
  label,
  value,
  explanation,
}: {
  label: string;
  value: number;
  explanation?: MetricExplanation;
}) {
  const level = value < 0.3 ? "Low" : value < 0.6 ? "Moderate" : "High";
  const color = level === "High" ? "bg-red-400" : level === "Moderate" ? "bg-amber-400" : "bg-emerald-400";
  const row = (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
        {label}
        {explanation && (
          <span className="text-[10px] font-semibold text-[var(--color-primary)] group-open:hidden">why?</span>
        )}
      </span>
      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-background)] ${color}`}>
        {level}
      </span>
    </div>
  );

  if (!explanation) {
    return <div className="rounded-lg bg-[var(--color-surface-high)] px-3 py-2">{row}</div>;
  }

  return (
    <details className="group rounded-lg bg-[var(--color-surface-high)] px-3 py-2">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">{row}</summary>
      <div className="mt-2 space-y-1.5 border-t border-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] pt-2">
        <p className="text-xs text-[var(--color-text-secondary)]">{explanation.why}</p>
        {explanation.representativeQuote && (
          <blockquote className="border-l-2 border-[var(--color-primary)] pl-2 text-xs italic text-[var(--color-text-tertiary)]">
            &ldquo;{explanation.representativeQuote}&rdquo;
          </blockquote>
        )}
        {explanation.sourceJournalCount !== undefined && (
          <p className="text-[10px] text-[var(--color-text-tertiary)]">
            Based on {explanation.sourceJournalCount} journal entries
          </p>
        )}
      </div>
    </details>
  );
}

const PATTERN_TYPE_LABELS: Record<string, string> = {
  behavioral_pattern: "Pattern",
  contextual_trigger: "Trigger",
  environmental_dependency: "Environment",
  personal_strategy: "Strategy",
  life_event: "Life Event",
  recurring_theme: "Theme",
};

function MindsetBar({ metrics }: { metrics: NonNullable<BehavioralMetrics["metrics"]> }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
        Mindset Distribution
      </p>
      <div className="flex h-3 overflow-hidden rounded-full">
        <div
          className="bg-emerald-500 transition-all"
          style={{ width: `${metrics.growthMindsetRatio * 100}%` }}
          title={`Growth: ${Math.round(metrics.growthMindsetRatio * 100)}%`}
        />
        <div
          className="bg-amber-400 transition-all"
          style={{ width: `${metrics.mixedMindsetRatio * 100}%` }}
          title={`Mixed: ${Math.round(metrics.mixedMindsetRatio * 100)}%`}
        />
        <div
          className="bg-red-400 transition-all"
          style={{ width: `${metrics.fixedMindsetRatio * 100}%` }}
          title={`Fixed: ${Math.round(metrics.fixedMindsetRatio * 100)}%`}
        />
      </div>
      <div className="mt-1.5 flex gap-4 text-[10px] text-[var(--color-text-tertiary)]">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />Growth {Math.round(metrics.growthMindsetRatio * 100)}%</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-400" />Mixed {Math.round(metrics.mixedMindsetRatio * 100)}%</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-400" />Fixed {Math.round(metrics.fixedMindsetRatio * 100)}%</span>
      </div>
    </div>
  );
}

function PatternCard({ pattern }: { pattern: MemoryPattern }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface-low)] p-3 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-[var(--color-text-secondary)]">{pattern.content}</p>
        <span className="shrink-0 rounded-full bg-[var(--color-surface-high)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
          {PATTERN_TYPE_LABELS[pattern.patternType] ?? pattern.patternType}
        </span>
      </div>
      <p className="mt-1 text-[10px] text-[var(--color-text-tertiary)]">
        Seen {pattern.evidenceCount}× · {Math.round(pattern.confidence * 100)}% confidence
      </p>
    </div>
  );
}

export default function BehavioralIntelligence({ data, memories, history, maxWeeks, hasAccess }: Props) {
  const { metrics, aiProfile } = data ?? { metrics: null, aiProfile: null };
  const trend = metrics?.trend;
  const explanations = metrics?.metricExplanations;

  // Free tier: show a real taste (mindset + top pattern), lock the depth.
  if (!hasAccess) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Behavioral Intelligence</h2>

        {metrics && <MindsetBar metrics={metrics} />}
        {memories.length > 0 && <PatternCard pattern={memories[0]} />}

        {!metrics && memories.length === 0 && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Keep journaling — your AI-detected mindset and behavioral patterns will appear here.
          </p>
        )}

        <div className="relative overflow-hidden rounded-xl bg-[var(--color-surface-low)] p-6 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
          <div className="pointer-events-none absolute inset-0 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center gap-3 text-center">
            <LockClosedIcon className="h-8 w-8 text-[var(--color-text-tertiary)]" />
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {metrics || memories.length > 0
                ? "This is a preview of what the AI sees"
                : "Unlock Behavioral Intelligence"}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Score tiles, trend charts, evidence from your own entries, and your full pattern
              library are available on Reflect and Thrive plans.
            </p>
            <Link
              href="/subscription"
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-[var(--color-goal-cta-text)]"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Behavioral Intelligence</h2>

      {/* AI Profile scores */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ScoreTile
          label="Execution"
          value={aiProfile?.executionConsistencyScore}
          trend={trend?.actionTrend}
        />
        <ScoreTile
          label="Resilience"
          value={aiProfile?.resilienceIndex}
          max={100}
          trend={trend?.emotionTrend}
        />
        <ScoreTile
          label="Agency"
          value={aiProfile?.agencyScore}
          trend={trend?.motivationTrend}
        />
        <ScoreTile
          label="Volatility"
          value={aiProfile?.volatilityIndex}
          suffix=""
        />
      </div>

      {/* Trend charts + week-over-week diff */}
      <BehavioralTrends history={history} maxWeeks={maxWeeks} />

      {metrics && (
        <>
          <MindsetBar metrics={metrics} />

          {/* Behavioral flags with evidence */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
              Behavioral Signals
            </p>
            <FreqMeter
              label="Procrastination"
              value={metrics.procrastinationFrequency}
              explanation={explanations?.procrastinationFrequency}
            />
            <FreqMeter
              label="Burnout signals"
              value={metrics.burnoutFrequency}
              explanation={explanations?.burnoutFrequency}
            />
            <FreqMeter
              label="Resilience moments"
              value={metrics.resilienceFrequency}
              explanation={explanations?.resilienceFrequency}
            />
          </div>
        </>
      )}

      {/* Memory patterns */}
      {memories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
              Long-term Patterns
            </p>
            <Link href="/profile" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
              View all
            </Link>
          </div>
          {memories.map((m) => (
            <PatternCard key={m._id} pattern={m} />
          ))}
        </div>
      )}

      {!metrics && !aiProfile && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Behavioral metrics are computed weekly. Keep journaling and they will appear here.
        </p>
      )}
    </div>
  );
}
