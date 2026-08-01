"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import LikertScale from "@/components/tools/LikertScale";
import MetricGauge from "@/components/tools/MetricGauge";
import { ToolsBackLink } from "@/components/tools/ToolsChrome";
import {
  publicToolsService,
  type BurnoutCheckResult,
  type BurnoutRiskLevel,
} from "@/services/publicTools.service";
import { BRAND_NAME } from "@/constants/brand.constants";

const MIN_CHARS = 15;
const MAX_CHARS = 900;

const RATING_QUESTIONS: Array<{
  key: "energy" | "sleep" | "motivation" | "overwhelm" | "exhaustion" | "control";
  question: string;
  lowLabel: string;
  highLabel: string;
}> = [
  { key: "energy", question: "How have your energy levels been lately?", lowLabel: "Drained", highLabel: "Energized" },
  { key: "sleep", question: "How's your sleep quality been?", lowLabel: "Poor", highLabel: "Great" },
  { key: "motivation", question: "How motivated do you feel to do things you usually enjoy?", lowLabel: "None", highLabel: "High" },
  { key: "overwhelm", question: "How often do you feel overwhelmed?", lowLabel: "Constantly", highLabel: "Rarely" },
  { key: "exhaustion", question: "How physically or emotionally exhausted do you feel?", lowLabel: "Highly Exhausted", highLabel: "Rarely Exhausted" },
  { key: "control", question: "How much control do you feel over your workload?", lowLabel: "None", highLabel: "Full Control" },
];

const RISK_TONE: Record<BurnoutRiskLevel, "good" | "warning" | "critical"> = {
  low: "good",
  moderate: "warning",
  high: "critical",
};

const RISK_LABEL: Record<BurnoutRiskLevel, string> = {
  low: "Low Risk",
  moderate: "Moderate Risk",
  high: "High Risk",
};

type Ratings = Record<(typeof RATING_QUESTIONS)[number]["key"], number | null>;

export default function BurnoutCheckClient() {
  const [ratings, setRatings] = useState<Ratings>({
    energy: null,
    sleep: null,
    motivation: null,
    overwhelm: null,
    exhaustion: null,
    control: null,
  });
  const [drainText, setDrainText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BurnoutCheckResult | null>(null);

  const allRated = Object.values(ratings).every((v) => v !== null);
  const canSubmit =
    !loading &&
    allRated &&
    drainText.trim().length >= MIN_CHARS &&
    drainText.length <= MAX_CHARS;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const response = await publicToolsService.analyzeBurnoutCheck({
        energy: ratings.energy!,
        sleep: ratings.sleep!,
        motivation: ratings.motivation!,
        overwhelm: ratings.overwhelm!,
        exhaustion: ratings.exhaustion!,
        control: ratings.control!,
        drainText: drainText.trim(),
      });
      setResult(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Something went wrong analyzing your check-in. Please try again."
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

        <div className="mt-8 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_6%,var(--color-surface-elevated)))] p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
            Your Burnout & Resilience Check
          </p>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            {result.burnoutRisk.summary}
          </p>

          <div className="mt-6 space-y-5">
            <MetricGauge
              title="Burnout Risk"
              score={result.burnoutRisk.score}
              label={RISK_LABEL[result.burnoutRisk.level]}
              lowPole="Low Risk"
              highPole="High Risk"
              tone={RISK_TONE[result.burnoutRisk.level]}
            />
            <MetricGauge
              title="Resilience"
              score={result.resilienceScore}
              label={`${result.resilienceScore}/100`}
              lowPole="Fragile"
              highPole="Resilient"
              tone="good"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            {result.resilienceInsight}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
            Top Stressors
          </h3>
          {result.stressors.map((s, i) => (
            <article
              key={i}
              className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-6"
            >
              <h4 className="mb-1.5 text-base font-bold tracking-tight">
                {s.label}
              </h4>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {s.insight}
              </p>
              {s.quote && (
                <div className="mt-3 rounded-xl border-l-2 border-[color:var(--color-primary)] bg-background p-3.5">
                  <p className="text-xs italic leading-relaxed text-[color:var(--color-text-secondary)]">
                    "{s.quote}"
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">
            3 Micro-Actions For This Week
          </h3>
          <ul className="space-y-3">
            {result.microActions.map((action, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-4"
              >
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-primary)]" />
                <span className="text-sm leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-[color:var(--color-text-tertiary)]">
          This is a self-reflection tool, not medical advice or a clinical
          diagnosis. If you're struggling, please talk to a mental health
          professional.
        </p>

        <div className="mt-8 rounded-3xl border border-[color:var(--color-primary)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_14%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_12%,var(--color-surface-elevated)))] p-6 text-center sm:p-8">
          <h3 className="text-xl font-black tracking-tight">
            Catch burnout before it catches you.
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[color:var(--color-text-secondary)]">
            {BRAND_NAME} tracks burnout and resilience signals from your
            actual journal entries every week, so you see the trend — not
            just a one-time snapshot.
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
          Burnout & Resilience Check
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[color:var(--color-text-secondary)]">
          6 quick questions and one honest sentence about what's draining
          you. Get a burnout risk read, a resilience score, and 3 micro-
          actions for this week.
        </p>
      </div>

      <div className="mt-8 space-y-6 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-5 sm:p-7">
        {RATING_QUESTIONS.map(({ key, question, lowLabel, highLabel }) => (
          <LikertScale
            key={key}
            question={question}
            lowLabel={lowLabel}
            highLabel={highLabel}
            value={ratings[key]}
            onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
          />
        ))}

        <div>
          <label htmlFor="drainText" className="mb-2 block text-sm font-semibold">
            What's draining you lately?
          </label>
          <textarea
            id="drainText"
            value={drainText}
            onChange={(e) => setDrainText(e.target.value.slice(0, MAX_CHARS))}
            rows={4}
            placeholder="e.g. Back-to-back meetings all week, barely any time to focus, and I still haven't unpacked from my trip..."
            className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-background px-4 py-3 text-sm leading-relaxed transition focus:border-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
          />
          <div className="mt-1 text-right text-xs text-[color:var(--color-text-tertiary)]">
            {drainText.length}/{MAX_CHARS}
          </div>
        </div>

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
              Analyzing your check-in...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              See My Burnout & Resilience Check
            </>
          )}
        </button>

        <p className="text-center text-xs text-[color:var(--color-text-tertiary)]">
          Free, no login. For self-reflection only — not medical advice.
          Limited to 5 tries per hour.
        </p>
      </div>
    </div>
  );
}
