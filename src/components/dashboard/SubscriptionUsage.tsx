"use client";

import Link from "next/link";
import {
  MicrophoneIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  DocumentTextIcon,
  CheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const TIER_COLORS: Record<string, string> = {
  free: "bg-[var(--color-surface-high)] text-[var(--color-text-secondary)]",
  reflect: "bg-blue-500/15 text-blue-400",
  thrive: "bg-purple-500/15 text-purple-400",
};

interface FeatureRow {
  label: string;
  icon: React.ElementType;
  key: "allowVoiceJournaling" | "allowAIChat" | "allowAdvancedInsights" | "allowCustomTemplates";
}

const FEATURES: FeatureRow[] = [
  { label: "Voice Journaling", icon: MicrophoneIcon, key: "allowVoiceJournaling" },
  { label: "AI Chat", icon: ChatBubbleLeftRightIcon, key: "allowAIChat" },
  { label: "Advanced Insights", icon: SparklesIcon, key: "allowAdvancedInsights" },
  { label: "Custom Templates", icon: DocumentTextIcon, key: "allowCustomTemplates" },
];

export default function SubscriptionUsage() {
  const { tier, displayName, featureLimits, usage } = useSubscriptionStore();

  const journalUsed = usage?.journalsThisMonth ?? 0;
  const journalLimit = featureLimits.maxJournalsPerMonth;
  const goalUsed = usage?.activeGoals ?? 0;
  const goalLimit = featureLimits.maxActiveGoals;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Plan & Usage</h2>
        <Link href="/subscription" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
          Manage →
        </Link>
      </div>

      <div className="rounded-xl bg-[var(--color-surface-low)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={`rounded-full px-3 py-1 text-sm font-bold capitalize ${TIER_COLORS[tier]}`}>
            {displayName}
          </span>
          {tier !== "thrive" && (
            <Link
              href="/subscription"
              className="rounded-lg bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] px-3 py-1.5 text-xs font-bold text-[var(--color-goal-cta-text)]"
            >
              Upgrade Plan
            </Link>
          )}
        </div>

        {/* Usage meters */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-text-secondary)]">Journals this month</span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {journalUsed}{journalLimit !== null ? ` / ${journalLimit}` : ""}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-highest)]">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                style={{
                  width: journalLimit !== null ? `${Math.min(100, (journalUsed / journalLimit) * 100)}%` : "100%",
                  opacity: journalLimit === null ? 0.3 : 1,
                }}
              />
            </div>
            {journalLimit === null && (
              <p className="mt-0.5 text-[10px] text-[var(--color-text-tertiary)]">Unlimited</p>
            )}
          </div>

          <div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-text-secondary)]">Active goals</span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {goalUsed}{goalLimit !== null ? ` / ${goalLimit}` : ""}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-highest)]">
              <div
                className="h-full rounded-full bg-[var(--color-secondary)] transition-all"
                style={{
                  width: goalLimit !== null ? `${Math.min(100, (goalUsed / goalLimit) * 100)}%` : "100%",
                  opacity: goalLimit === null ? 0.3 : 1,
                }}
              />
            </div>
            {goalLimit === null && (
              <p className="mt-0.5 text-[10px] text-[var(--color-text-tertiary)]">Unlimited</p>
            )}
          </div>
        </div>

        {/* Feature checklist */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {FEATURES.map(({ label, icon: Icon, key }) => {
            const allowed = featureLimits[key] === true;
            return (
              <div
                key={key}
                className={`flex items-center gap-2 text-sm ${allowed ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-tertiary)]"}`}
              >
                {allowed ? (
                  <CheckIcon className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <LockClosedIcon className="h-4 w-4 shrink-0" />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
