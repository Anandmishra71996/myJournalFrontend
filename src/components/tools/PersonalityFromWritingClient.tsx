"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import RadarChart from "@/components/tools/RadarChart";
import { ToolsBackLink } from "@/components/tools/ToolsChrome";
import {
  publicToolsService,
  type PersonalityAnalysisResult,
  type BigFiveTrait,
} from "@/services/publicTools.service";
import { BRAND_NAME } from "@/constants/brand.constants";

const MIN_WORDS = 40;
const MAX_CHARS = 2500;

const TRAIT_LABELS: Record<BigFiveTrait, string> = {
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  neuroticism: "Neuroticism",
};

export default function PersonalityFromWritingClient() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PersonalityAnalysisResult | null>(
    null
  );

  const wordCount = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean).length,
    [text]
  );
  const canSubmit = wordCount >= MIN_WORDS && text.length <= MAX_CHARS && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const response = await publicToolsService.analyzePersonality(text.trim());
      setResult(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Something went wrong analyzing your writing. Please try again."
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
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <ToolsBackLink />

        <div className="mt-8 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_6%,var(--color-surface-elevated)))] p-6 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
            Your Big Five Profile
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {result.headline}
          </h1>

          <div className="mt-8 flex justify-center">
            <RadarChart
              axes={result.traits.map((t) => ({
                label: TRAIT_LABELS[t.trait],
                value: t.score,
              }))}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {result.traits.map((t) => (
            <article
              key={t.trait}
              className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-6"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-base font-bold tracking-tight">
                  {TRAIT_LABELS[t.trait]}
                </h3>
                <span className="rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--color-primary)]">
                  {t.score}
                  <span className="text-[color:var(--color-text-tertiary)]">
                    th percentile
                  </span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {t.insight}
              </p>
              {t.quote && (
                <div className="mt-3 rounded-xl border-l-2 border-[color:var(--color-primary)] bg-background p-3.5">
                  <p className="text-xs italic leading-relaxed text-[color:var(--color-text-secondary)]">
                    "{t.quote}"
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                    From your writing
                  </p>
                </div>
              )}
            </article>
          ))}

          {result.blindSpot && (
            <article className="rounded-2xl border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_8%,transparent)] p-6">
              <h3 className="mb-2 text-base font-bold tracking-tight">
                A possible blind spot
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {result.blindSpot}
              </p>
            </article>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-[color:var(--color-primary)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_14%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_12%,var(--color-surface-elevated)))] p-6 text-center sm:p-8">
          <h3 className="text-xl font-black tracking-tight">
            Your writing revealed 5 traits. Your journal would reveal your
            patterns.
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[color:var(--color-text-secondary)]">
            {BRAND_NAME} tracks how these traits show up in your behavior over
            time — mindset, procrastination, burnout, resilience — each backed
            by evidence from your own entries.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-primary)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto"
            >
              <SparklesIcon className="h-4 w-4" />
              Track This Over Time — Free
            </Link>
            <button
              onClick={handleReset}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--color-border)] px-7 py-3.5 text-sm font-semibold transition hover:bg-surface sm:w-auto"
            >
              Try With Different Text
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
          AI Personality From Your Writing
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[color:var(--color-text-secondary)]">
          Paste 150+ words of anything you've written — a journal entry, an
          email, an essay — and get a Big Five (OCEAN) personality read,
          backed by quotes from your own text.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-5 sm:p-7">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          rows={10}
          placeholder="Paste something you've written — a journal entry, an old email, a reflection, anything at least a few paragraphs long..."
          className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-background px-4 py-3 text-sm leading-relaxed transition focus:border-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--color-text-tertiary)]">
          <span>
            {wordCount} words
            {wordCount < MIN_WORDS && ` (${MIN_WORDS}+ recommended)`}
          </span>
          <span>
            {text.length}/{MAX_CHARS}
          </span>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3.5 text-sm text-red-500">
            <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Analyzing your writing...
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Reveal My Personality
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-[color:var(--color-text-tertiary)]">
          Free, no login. Your text isn't stored beyond generating this
          result. Limited to 5 tries per hour.
        </p>
      </div>
    </div>
  );
}
