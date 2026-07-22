"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { BehavioralHistoryPoint } from "@/types/dashboard.types";

interface Props {
  history: BehavioralHistoryPoint[];
  maxWeeks: number;
}

interface SeriesDef {
  key: keyof Pick<
    BehavioralHistoryPoint,
    | "avgActionRatio"
    | "procrastinationFrequency"
    | "burnoutFrequency"
    | "resilienceFrequency"
    | "growthMindsetRatio"
  >;
  label: string;
  upIsGood: boolean;
}

const SPARK_SERIES: SeriesDef[] = [
  { key: "procrastinationFrequency", label: "Procrastination", upIsGood: false },
  { key: "burnoutFrequency", label: "Burnout signals", upIsGood: false },
  { key: "resilienceFrequency", label: "Resilience", upIsGood: true },
  { key: "growthMindsetRatio", label: "Growth mindset", upIsGood: true },
];

const pct = (v: number) => `${Math.round(v * 100)}%`;

function weekLabel(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Map values (0–1) to SVG points for a given plot box. */
function toPoints(
  values: number[],
  width: number,
  height: number,
  padX: number,
  padY: number
): [number, number][] {
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const n = values.length;
  return values.map((v, i) => [
    padX + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
    padY + (1 - Math.min(1, Math.max(0, v))) * innerH,
  ]);
}

const polyline = (pts: [number, number][]) => pts.map(([x, y]) => `${x},${y}`).join(" ");

function DeltaChip({ delta, upIsGood, label }: { delta: number; upIsGood: boolean; label: string }) {
  const pp = Math.round(delta * 100);
  const good = pp === 0 ? null : pp > 0 === upIsGood;
  const color =
    good === null
      ? "text-[var(--color-text-tertiary)]"
      : good
        ? "text-emerald-400"
        : "text-red-400";
  return (
    <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
      {label}
      <span className={`font-semibold ${color}`}>
        {pp > 0 ? "↑" : pp < 0 ? "↓" : "→"} {pp === 0 ? "stable" : `${Math.abs(pp)}pp`}
      </span>
    </span>
  );
}

/** Primary line chart: action ratio over weeks, with crosshair + tooltip. */
function ActionRatioChart({ history }: { history: BehavioralHistoryPoint[] }) {
  const W = 560;
  const H = 150;
  const PAD_X = 8;
  const PAD_Y = 16;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const values = history.map((h) => h.avgActionRatio);
  const points = useMemo(() => toPoints(values, W, H, PAD_X, PAD_Y), [values]);
  const last = points[points.length - 1];

  const handlePointer = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frac = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(frac * (history.length - 1));
    setHoverIdx(Math.min(history.length - 1, Math.max(0, idx)));
  };

  const hovered = hoverIdx !== null ? history[hoverIdx] : null;
  const hoveredPt = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerMove={handlePointer}
      onPointerLeave={() => setHoverIdx(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full" role="img" aria-label="Action ratio by week">
        {/* recessive hairline gridlines at 0/50/100% */}
        {[0, 0.5, 1].map((g) => {
          const y = PAD_Y + (1 - g) * (H - PAD_Y * 2);
          return (
            <line
              key={g}
              x1={PAD_X}
              x2={W - PAD_X}
              y1={y}
              y2={y}
              stroke="var(--color-surface-highest)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* area wash */}
        <polygon
          points={`${PAD_X},${H - PAD_Y} ${polyline(points)} ${W - PAD_X},${H - PAD_Y}`}
          fill="var(--color-primary)"
          opacity={0.1}
        />

        {/* series line */}
        <polyline
          points={polyline(points)}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* crosshair */}
        {hoveredPt && (
          <line
            x1={hoveredPt[0]}
            x2={hoveredPt[0]}
            y1={PAD_Y}
            y2={H - PAD_Y}
            stroke="var(--color-outline-variant)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* hovered point marker (surface ring + fill) */}
        {hoveredPt && (
          <>
            <circle cx={hoveredPt[0]} cy={hoveredPt[1]} r={6} fill="var(--color-surface-low)" />
            <circle cx={hoveredPt[0]} cy={hoveredPt[1]} r={4} fill="var(--color-primary)" />
          </>
        )}

        {/* end marker */}
        <circle cx={last[0]} cy={last[1]} r={6} fill="var(--color-surface-low)" />
        <circle cx={last[0]} cy={last[1]} r={4} fill="var(--color-primary)" />
      </svg>

      {/* endpoint label — text token, not series color */}
      <span className="absolute right-0 top-0 text-xs font-semibold text-[var(--color-text-primary)]">
        {pct(values[values.length - 1])}
      </span>

      {/* tooltip: value leads, week follows */}
      {hovered && hoveredPt && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-[var(--color-surface-highest)] px-2.5 py-1.5 shadow-lg"
          style={{ left: `${(hoveredPt[0] / W) * 100}%`, top: 0 }}
        >
          <p className="text-sm font-bold text-[var(--color-text-primary)]">{pct(hovered.avgActionRatio)}</p>
          <p className="whitespace-nowrap text-[10px] text-[var(--color-text-tertiary)]">
            Week of {weekLabel(hovered.weekStart)} · {hovered.totalEntriesAnalyzed} entries
          </p>
        </div>
      )}

      <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-tertiary)]">
        <span>{weekLabel(history[0].weekStart)}</span>
        <span>{weekLabel(history[history.length - 1].weekStart)}</span>
      </div>
    </div>
  );
}

function Sparkline({ history, def }: { history: BehavioralHistoryPoint[]; def: SeriesDef }) {
  const W = 120;
  const H = 36;
  const values = history.map((h) => h[def.key]);
  const points = toPoints(values, W, H, 2, 5);
  const last = points[points.length - 1];
  const current = values[values.length - 1];
  const delta = values.length > 1 ? current - values[values.length - 2] : 0;

  return (
    <div className="rounded-xl bg-[var(--color-surface-high)] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {def.label}
      </p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-lg font-extrabold text-[var(--color-text-primary)]">{pct(current)}</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-24 shrink-0" aria-hidden="true">
          <polyline
            points={polyline(points)}
            fill="none"
            stroke="var(--color-outline-variant)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={last[0]} cy={last[1]} r={5} fill="var(--color-surface-high)" />
          <circle cx={last[0]} cy={last[1]} r={3.5} fill="var(--color-primary)" />
        </svg>
      </div>
      <DeltaChip delta={delta} upIsGood={def.upIsGood} label="vs last week" />
    </div>
  );
}

export default function BehavioralTrends({ history, maxWeeks }: Props) {
  if (history.length < 2) {
    return (
      <div className="rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Trends</p>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Trends unlock after two weeks of journaling — keep going and your progress will chart itself here.
        </p>
      </div>
    );
  }

  const latest = history[history.length - 1];
  const prev = history[history.length - 2];

  return (
    <div className="space-y-3 rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          Action Ratio · last {history.length} weeks
        </p>
        {maxWeeks <= 4 && (
          <Link href="/subscription" className="text-[10px] font-semibold text-[var(--color-primary)] hover:underline">
            Unlock 26 weeks with Thrive →
          </Link>
        )}
      </div>

      {/* Week-over-week strip */}
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        <DeltaChip delta={latest.avgActionRatio - prev.avgActionRatio} upIsGood label="Action ratio" />
        <DeltaChip
          delta={latest.procrastinationFrequency - prev.procrastinationFrequency}
          upIsGood={false}
          label="Procrastination"
        />
        <DeltaChip delta={latest.burnoutFrequency - prev.burnoutFrequency} upIsGood={false} label="Burnout" />
      </div>

      <ActionRatioChart history={history} />

      <div className="grid grid-cols-2 gap-2">
        {SPARK_SERIES.map((def) => (
          <Sparkline key={def.key} history={history} def={def} />
        ))}
      </div>
    </div>
  );
}
