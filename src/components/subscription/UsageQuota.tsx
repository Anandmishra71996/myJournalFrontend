"use client";

import { useEffect } from "react";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { UpgradePrompt } from "./UpgradePrompt";

interface UsageQuotaProps {
  featureType: "journals" | "goals";
  className?: string;
  showUpgradePrompt?: boolean;
}

/**
 * Display current usage quota with visual progress bar
 * Shows upgrade prompt when nearing or at limit
 */
export function UsageQuota({
  featureType,
  className = "",
  showUpgradePrompt = true,
}: UsageQuotaProps) {
  const { usage, featureLimits, tier, getRemainingQuota, fetchSubscription } =
    useSubscriptionStore();

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isJournals = featureType === "journals";
  const limit = isJournals
    ? featureLimits.maxJournalsPerMonth
    : featureLimits.maxActiveGoals;
  const current = isJournals
    ? (usage?.journalsThisMonth ?? 0)
    : (usage?.activeGoals ?? 0);
  const remaining = getRemainingQuota(featureType);

  // If unlimited
  if (limit === null) {
    return null;
  }

  const percentage = Math.min((current / limit) * 100, 100);
  const isWarning = remaining !== null && remaining <= 2;
  const isAtLimit = remaining !== null && remaining <= 0;

  const getProgressColor = () => {
    if (isAtLimit) return "from-error-dim to-error";
    if (isWarning) return "from-tertiary-dim to-tertiary";
    return "from-primary-dim to-primary";
  };

  const featureLabel = isJournals ? "journal entries" : "active goals";
  const upgradeTier = tier === "free" ? "Reflect" : "Thrive";

  return (
    <div className={className}>
      {/* Quota Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-sm text-on-surface-variant/70">
            {isJournals ? "Journal Entries This Month" : "Active Goals"}
          </span>
          <span className="text-label-sm font-medium text-on-surface">
            {current} / {limit}
          </span>
        </div>

        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isWarning && !isAtLimit && (
          <div className="flex items-center gap-2 mt-2">
            <AlertCircle className="h-4 w-4 text-tertiary" />
            <span className="text-label-xs text-on-surface-variant/70">
              {remaining} {featureLabel} remaining
            </span>
          </div>
        )}
      </div>

      {/* Upgrade Prompt when at/near limit */}
      {showUpgradePrompt && isAtLimit && (
        <UpgradePrompt
          feature={`Unlimited ${featureLabel}`}
          message={`You've reached your ${tier} tier limit for ${featureLabel}.`}
          upgradeTier={upgradeTier}
          variant="inline"
          className="mt-4"
        />
      )}
    </div>
  );
}
