"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  getCurrentWeek,
  getPreviousWeek,
  getNextWeek,
  formatWeekRange,
  isCurrentWeek,
  isFutureWeek,
} from "@/utils/weekUtils";
import {
  WeeklyInsight,
  GOAL_STATUS_LABELS,
  GOAL_STATUS_COLORS,
} from "@/constants/insight.constants";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  LightBulbIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

export default function InsightsPage() {
  const [weekStart, setWeekStart] = useState<string>("");
  const [weekEnd, setWeekEnd] = useState<string>("");
  const [insight, setInsight] = useState<WeeklyInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const { weekStart: currentWeekStart, weekEnd: currentWeekEnd } =
      getCurrentWeek();
    setWeekStart(currentWeekStart);
    setWeekEnd(currentWeekEnd);
  }, []);

  useEffect(() => {
    if (weekStart) {
      fetchInsight();
    }
  }, [weekStart]);

  const fetchInsight = async () => {
    setLoading(true);
    setInsight(null);

    try {
      const response = await api.get(`/insights?weekStart=${weekStart}`);
      setInsight(response.data.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Error fetching insight:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    if (isFutureWeek(weekStart)) {
      toast.error("Cannot generate insights for future weeks");
      return;
    }

    setGenerating(true);

    try {
      const response = await api.post("/insights/generate", { weekStart });
      setInsight(response.data.data);
      toast.success("Weekly insights generated!");
    } catch (error: any) {
      console.error("Error generating insight:", error);
      toast.error(error.response?.data?.error || "Failed to generate insights");
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviousWeek = () => {
    const prevWeek = getPreviousWeek(weekStart);
    setWeekStart(prevWeek);
    const prevWeekEnd = new Date(prevWeek);
    prevWeekEnd.setDate(prevWeekEnd.getDate() + 6);
    setWeekEnd(prevWeekEnd.toISOString().split("T")[0]);
  };

  const handleNextWeek = () => {
    if (isFutureWeek(weekStart)) {
      return;
    }

    const nextWeek = getNextWeek(weekStart);
    if (isFutureWeek(nextWeek)) {
      return;
    }

    setWeekStart(nextWeek);
    const nextWeekEnd = new Date(nextWeek);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);
    setWeekEnd(nextWeekEnd.toISOString().split("T")[0]);
  };

  const canGoNext = weekStart && !isFutureWeek(getNextWeek(weekStart));
  const isFuture = weekStart ? isFutureWeek(weekStart) : false;

  const surfaceCardClass =
    "rounded-xl bg-[var(--color-surface-low)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]";

  const nonFunctionalButtonClass =
    "cursor-not-allowed opacity-55 grayscale transition-none";

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6 lg:space-y-8">
        <header className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-4xl">
                Weekly Insights
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)] sm:text-base">
                AI-powered reflections on your journaling rhythm and goal
                momentum
              </p>
            </div>
            {!loading && insight && (
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Export report is coming soon"
                className={`inline-flex items-center gap-2 rounded-xl bg-[var(--color-surface-high)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] ${nonFunctionalButtonClass}`}
              >
                <ArrowUpTrayIcon className="h-4 w-4" />
                Export Report
              </button>
            )}
          </div>

          <div className={`${surfaceCardClass} p-4 sm:p-5`}>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <button
                onClick={handlePreviousWeek}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface-high)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-bright)]"
                aria-label="Previous week"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] sm:text-xs">
                  {isCurrentWeek(weekStart) ? "Current View" : "Past View"}
                </p>
                <p className="mt-1 text-base font-bold text-[var(--color-text-primary)] sm:text-xl">
                  {weekStart && weekEnd
                    ? formatWeekRange(weekStart, weekEnd)
                    : "Loading..."}
                </p>
              </div>

              <button
                onClick={handleNextWeek}
                disabled={!canGoNext}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  canGoNext
                    ? "bg-[var(--color-surface-high)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-bright)]"
                    : "bg-[var(--color-surface-high)]/40 text-[var(--color-text-tertiary)] cursor-not-allowed"
                }`}
                aria-label="Next week"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {loading && (
          <section className="space-y-4">
            <div className={`${surfaceCardClass} animate-pulse p-6 sm:p-8`}>
              <div className="h-4 w-28 rounded bg-[var(--color-surface-highest)]"></div>
              <div className="mt-4 h-8 w-2/3 rounded bg-[var(--color-surface-highest)]"></div>
              <div className="mt-6 space-y-2">
                <div className="h-4 rounded bg-[var(--color-surface-highest)]"></div>
                <div className="h-4 rounded bg-[var(--color-surface-highest)]"></div>
                <div className="h-4 w-4/5 rounded bg-[var(--color-surface-highest)]"></div>
              </div>
            </div>
          </section>
        )}

        {!loading && !insight && (
          <section className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface-low)] p-6 text-center outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_14%,transparent)] sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_16%,transparent)] blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_14%,transparent)] blur-3xl" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)] sm:h-24 sm:w-24">
                <SparklesIcon className="h-10 w-10 text-[var(--color-primary)] sm:h-12 sm:w-12" />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                Your Week in Starlight
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-text-secondary)] sm:text-lg">
                {isFuture
                  ? "This week is in the future. Insights unlock once journaling begins."
                  : "Generate your weekly insight to reveal patterns, themes, and AI guidance."}
              </p>

              <button
                onClick={handleGenerateInsight}
                disabled={generating || isFuture}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] px-6 py-3 text-sm font-bold text-[var(--color-goal-cta-text)] shadow-[0_10px_24px_color-mix(in_srgb,var(--color-primary-dark)_30%,transparent)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-4 sm:text-base"
              >
                {generating ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Generating Insight...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Generate Weekly Insight
                  </>
                )}
              </button>

              {isFuture && (
                <p className="mt-4 text-xs font-medium text-[var(--color-error)] sm:text-sm">
                  Cannot generate insights for future weeks
                </p>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Past summaries are coming soon"
                className={`rounded-full bg-[var(--color-surface-high)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] ${nonFunctionalButtonClass}`}
              >
                Past Summaries
              </button>
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Preferences are coming soon"
                className={`rounded-full bg-[var(--color-surface-high)] px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] ${nonFunctionalButtonClass}`}
              >
                Preferences
              </button>
            </div>
          </section>
        )}

        {!loading && insight && (
          <div className="space-y-6 lg:space-y-8">
            <section className="relative overflow-hidden rounded-2xl bg-[var(--color-surface-low)] p-5 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color:color-mix(in_srgb,var(--color-secondary-dark)_28%,transparent)] via-transparent to-[color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]" />

              <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_20%,transparent)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
                    Weekly Performance
                  </span>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                    Weekly Insight Generated
                  </h2>
                  <p className="max-w-2xl text-sm text-[var(--color-text-secondary)] sm:text-base">
                    {insight.journalCount} journal entries analyzed. Your
                    reflection and goal momentum are summarized below.
                  </p>
                </div>

                <button
                  onClick={handleGenerateInsight}
                  disabled={generating}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-surface-high)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] transition-colors hover:bg-[var(--color-surface-bright)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowPathIcon
                    className={`h-4 w-4 ${generating ? "animate-spin" : ""}`}
                  />
                  {generating ? "Regenerating..." : "Regenerate Insight"}
                </button>
              </div>
            </section>

            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              <section className="col-span-12 space-y-4 lg:col-span-8">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--color-text-primary)] sm:text-xl">
                    <SparklesIcon className="h-5 w-5 text-[var(--color-primary)]" />
                    Weekly Reflection
                  </h3>
                  <span className="rounded-full bg-[var(--color-surface-high)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                    AI Analysis
                  </span>
                </div>

                <div className={`${surfaceCardClass} space-y-4 p-5 sm:p-7`}>
                  <ul className="space-y-4">
                    {insight.reflection.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-2 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-primary)]" />
                        <span className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] pt-4 text-xs text-[var(--color-text-tertiary)] sm:text-sm">
                    Generated from {insight.journalCount} journal entries.
                  </div>
                </div>
              </section>

              <aside className="col-span-12 space-y-4 lg:col-span-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--color-text-primary)] sm:text-xl">
                  <LightBulbIcon className="h-5 w-5 text-[var(--color-secondary)]" />
                  AI Guidance
                </h3>

                <div className="relative overflow-hidden rounded-xl bg-[color:color-mix(in_srgb,var(--color-secondary-dark)_12%,transparent)] p-5 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-secondary)_22%,transparent)]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_18%,transparent)] blur-3xl" />
                  <div className="relative z-10 space-y-4">
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {insight.suggestion ||
                        "More suggestions will appear as your weekly patterns become richer."}
                    </p>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title="Calendar integration is coming soon"
                      className={`w-full rounded-lg border border-[color:color-mix(in_srgb,var(--color-secondary)_40%,transparent)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)] ${nonFunctionalButtonClass}`}
                    >
                      Add To Calendar
                    </button>
                  </div>
                </div>
              </aside>

              <section className="col-span-12 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] sm:text-xl">
                    Goal Alignment
                  </h3>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Detailed goal view is coming soon"
                    className={`text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] ${nonFunctionalButtonClass}`}
                  >
                    View All
                  </button>
                </div>

                {insight.goalSummaries.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {insight.goalSummaries.map((goalSummary, index) => (
                      <article
                        key={index}
                        className={`${surfaceCardClass} p-5 transition-colors hover:bg-[var(--color-surface-high)]`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h4 className="text-base font-semibold text-[var(--color-text-primary)]">
                            {goalSummary.goalTitle}
                          </h4>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${GOAL_STATUS_COLORS[goalSummary.status]}`}
                          >
                            {GOAL_STATUS_LABELS[goalSummary.status]}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                          {goalSummary.explanation}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`${surfaceCardClass} p-5 text-sm text-[var(--color-text-secondary)]`}
                  >
                    No linked goals were detected for this week.
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
