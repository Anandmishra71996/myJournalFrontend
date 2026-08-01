"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import MetricGauge from "@/components/tools/MetricGauge";
import { ToolsBackLink } from "@/components/tools/ToolsChrome";
import {
  publicToolsService,
  type BehaviorSnapshotResult,
  type BehaviorMetric,
} from "@/services/publicTools.service";
import { BRAND_NAME } from "@/constants/brand.constants";

const MIN_CHARS = 15;
const MAX_CHARS = 900;

const METRIC_META: Record<
  BehaviorMetric,
  { title: string; lowPole: string; highPole: string }
> = {
  actionRatio: { title: "Action Ratio", lowPole: "Talk", highPole: "Action" },
  mindset: { title: "Mindset", lowPole: "Fixed", highPole: "Growth" },
  locusOfControl: {
    title: "Locus of Control",
    lowPole: "External",
    highPole: "Internal",
  },
  procrastinationSignal: {
    title: "Procrastination Signal",
    lowPole: "Low Risk",
    highPole: "High Risk",
  },
};

const QUESTIONS: Array<{
  key: "activities" | "avoided" | "feelings";
  question: string;
  placeholder: string;
}> = [
  {
    key: "activities",
    question: "What did you actually do over the last 7 days?",
    placeholder: "e.g. Finished the client report, went to the gym 3 times, started reading a new book...",
  },
  {
    key: "avoided",
    question: "What did you avoid or keep putting off?",
    placeholder: "e.g. I kept telling myself I'd start the tax paperwork tomorrow, never got to it...",
  },
  {
    key: "feelings",
    question: "How did you feel about how the week went?",
    placeholder: "e.g. Proud of the workouts, but frustrated that I keep dodging the boring admin stuff...",
  },
];

export default function BehaviorCheckClient() {
  const [answers, setAnswers] = useState({
    activities: "",
    avoided: "",
    feelings: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BehaviorSnapshotResult | null>(null);

  const canSubmit =
    !loading &&
    Object.values(answers).every(
      (a) => a.trim().length >= MIN_CHARS && a.length <= MAX_CHARS
    );

  const handleChange = (key: keyof typeof answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value.slice(0, MAX_CHARS) }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const response = await publicToolsService.analyzeBehaviorSnapshot(
        answers.activities.trim(),
        answers.avoided.trim(),
        answers.feelings.trim()
      );
      setResult(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Something went wrong analyzing your week. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <ToolsBackLink />

        <div className="mt-8 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_6%,var(--color-surface-elevated)))] p-6 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
            Your Behavioral Snapshot
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {result.headline}
          </h1>
        </div>

        <div className="mt-6 space-y-4">
          {result.metrics.map((m) => (
            <article
              key={m.metric}
              className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-6"
            >
              <MetricGauge
                title={METRIC_META[m.metric].title}
                score={m.score}
                label={m.label}
                lowPole={METRIC_META[m.metric].lowPole}
                highPole={METRIC_META[m.metric].highPole}
              />
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {m.insight}
              </p>
              {m.quote && (
                <div className="mt-3 rounded-xl border-l-2 border-[color:var(--color-primary)] bg-background p-3.5">
                  <p className="text-xs italic leading-relaxed text-[color:var(--color-text-secondary)]">
                    "{m.quote}"
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                    From your answer
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-[color:var(--color-primary)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_14%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_12%,var(--color-surface-elevated)))] p-6 text-center sm:p-8">
          <h3 className="text-xl font-black tracking-tight">
            These 4 scores came from one paragraph.
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[color:var(--color-text-secondary)]">
            {BRAND_NAME} members get them computed weekly from real journal
            entries, with trends over time — not a one-off snapshot.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto"
            >
              <SparklesIcon className="h-4 w-4" />
              Track This Weekly — Free
            </Link>
            <button
              onClick={handleReset}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--color-border)] px-7 py-3.5 text-sm font-semibold transition hover:bg-surface sm:w-auto"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <ToolsBackLink />

      <div className="mt-6 text-center">
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Behavioral Metrics Snapshot
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[color:var(--color-text-secondary)]">
          Answer 3 quick questions about your last 7 days and get your Action
          Ratio, Mindset, Locus of Control, and Procrastination Signal — the
          same metrics {BRAND_NAME} computes weekly for members.
        </p>
      </div>

      <div className="mt-8 space-y-5 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-5 sm:p-7">
        {QUESTIONS.map(({ key, question, placeholder }) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="mb-2 block text-sm font-semibold"
            >
              {question}
            </label>
            <textarea
              id={key}
              value={answers[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              rows={3}
              placeholder={placeholder}
              className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-background px-4 py-3 text-sm leading-relaxed transition focus:border-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
            />
            <div className="mt-1 text-right text-xs text-[color:var(--color-text-tertiary)]">
              {answers[key].length}/{MAX_CHARS}
            </div>
          </div>
        ))}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3.5 text-sm text-red-500">
            <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Analyzing your week...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              See My Behavioral Snapshot
            </>
          )}
        </button>

        <p className="text-center text-xs text-[color:var(--color-text-tertiary)]">
          Free, no login. Your answers aren't stored beyond generating this
          result. Limited to 5 tries per hour.
        </p>
      </div>
    </div>
  );
}
