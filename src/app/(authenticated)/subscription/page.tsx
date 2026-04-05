"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  Check,
  Loader2,
  Sparkles,
  BarChart3,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuthStore } from "@/store/authStore";
import { BillingCycle } from "@/types/subscription.types";

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    tier,
    status,
    billingCycle,
    featureLimits,
    usage,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    tiers,
    isLoading,
    fetchSubscription,
    fetchTiers,
    cancelSubscription,
    reactivateSubscription,
  } = useSubscriptionStore();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  useEffect(() => {
    fetchSubscription();
    fetchTiers();
  }, [fetchSubscription, fetchTiers]);

  const currentTierConfig = tiers.find((t) => t.name === tier);

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      await cancelSubscription();
      toast.success(
        "Subscription will be canceled at the end of billing period",
      );
      setShowCancelModal(false);
    } catch (error) {
      console.error("Cancellation failed:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      await reactivateSubscription();
      toast.success("Subscription reactivated successfully");
    } catch (error) {
      console.error("Reactivation failed:", error);
    } finally {
      setIsReactivating(false);
    }
  };

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getUsagePercentage = (
    used: number | undefined,
    limit: number | null,
  ) => {
    if (limit === null || limit === 0) return 0; // Unlimited
    if (!used) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getTierBadge = () => {
    if (tier === "thrive") {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-secondary-dim to-secondary text-on-secondary">
          <Crown className="h-4 w-4" />
          <span className="text-label-sm font-semibold">Thrive</span>
        </div>
      );
    }
    if (tier === "reflect") {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-primary-dim to-primary text-on-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-label-sm font-semibold">Reflect</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-on-surface">
        <Check className="h-4 w-4" />
        <span className="text-label-sm font-semibold">Free</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-manrope text-display-sm font-bold text-on-surface mb-2">
            Subscription
          </h1>
          <p className="text-body-md text-on-surface-variant/80">
            Manage your plan and usage
          </p>
        </div>

        {/* Cancellation Notice */}
        {cancelAtPeriodEnd && (
          <div className="mb-6 p-4 rounded-md bg-error-container/20 border border-error/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-label-md font-semibold text-on-error-container mb-1">
                  Subscription Ending
                </h3>
                <p className="text-body-sm text-on-error-container/80 mb-3">
                  Your subscription will end on {formatDate(currentPeriodEnd)}.
                  You'll be downgraded to the Free tier.
                </p>
                <button
                  onClick={handleReactivate}
                  disabled={isReactivating}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-error text-on-error text-label-sm font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isReactivating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Reactivating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Reactivate Subscription
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Plan Card */}
        <div className="mb-6 overflow-hidden rounded-lg bg-surface-container-low/80 backdrop-blur-sm border border-outline-variant/15">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-headline-sm font-bold text-on-surface mb-2">
                  Current Plan
                </h2>
                {getTierBadge()}
              </div>
              {tier !== "free" && !cancelAtPeriodEnd && (
                <button
                  onClick={handleUpgrade}
                  className="px-4 py-2 rounded-md bg-surface-container-high text-on-surface text-label-md font-medium hover:bg-surface-bright transition-colors"
                >
                  Change Plan
                </button>
              )}
              {tier === "free" && (
                <button
                  onClick={handleUpgrade}
                  className="px-6 py-2.5 rounded-md bg-gradient-to-br from-primary-dim to-primary text-on-primary text-label-md font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
                >
                  Upgrade Now
                </button>
              )}
            </div>

            {currentTierConfig && (
              <p className="text-body-md text-on-surface-variant/80 mb-6">
                {currentTierConfig.description}
              </p>
            )}

            {/* Plan Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {tier !== "free" && (
                <>
                  <div className="flex items-start gap-3 p-4 rounded-md bg-surface-container/50">
                    <div className="shrink-0 mt-0.5">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-label-sm text-on-surface-variant/70 mb-1">
                        Billing Cycle
                      </p>
                      <p className="text-body-md font-medium text-on-surface capitalize">
                        {billingCycle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-md bg-surface-container/50">
                    <div className="shrink-0 mt-0.5">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-label-sm text-on-surface-variant/70 mb-1">
                        Next Billing Date
                      </p>
                      <p className="text-body-md font-medium text-on-surface">
                        {formatDate(currentPeriodEnd)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-start gap-3 p-4 rounded-md bg-surface-container/50">
                <div className="shrink-0 mt-0.5">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant/70 mb-1">
                    Status
                  </p>
                  <p className="text-body-md font-medium text-on-surface capitalize">
                    {status || "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mb-6 overflow-hidden rounded-lg bg-surface-container-low/80 backdrop-blur-sm border border-outline-variant/15">
          <div className="p-6">
            <h2 className="text-headline-sm font-bold text-on-surface mb-6">
              Usage This Month
            </h2>

            <div className="space-y-6">
              {/* Journals Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span className="text-body-md font-medium text-on-surface">
                      Journal Entries
                    </span>
                  </div>
                  <span className="text-body-md text-on-surface-variant">
                    {usage?.journalsThisMonth ?? 0}
                    {featureLimits.maxJournalsPerMonth !== null
                      ? ` / ${featureLimits.maxJournalsPerMonth}`
                      : " / Unlimited"}
                  </span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-dim to-primary transition-all duration-300"
                    style={{
                      width: `${getUsagePercentage(usage?.journalsThisMonth, featureLimits.maxJournalsPerMonth)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Goals Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-secondary" />
                    <span className="text-body-md font-medium text-on-surface">
                      Active Goals
                    </span>
                  </div>
                  <span className="text-body-md text-on-surface-variant">
                    {usage?.activeGoals ?? 0}
                    {featureLimits.maxActiveGoals !== null
                      ? ` / ${featureLimits.maxActiveGoals}`
                      : " / Unlimited"}
                  </span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary-dim to-secondary transition-all duration-300"
                    style={{
                      width: `${getUsagePercentage(usage?.activeGoals, featureLimits.maxActiveGoals)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        {currentTierConfig && (
          <div className="mb-6 overflow-hidden rounded-lg bg-surface-container-low/80 backdrop-blur-sm border border-outline-variant/15">
            <div className="p-6">
              <h2 className="text-headline-sm font-bold text-on-surface mb-6">
                Your Features
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {currentTierConfig.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-body-sm text-on-surface-variant">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        {tier !== "free" && !cancelAtPeriodEnd && (
          <div className="overflow-hidden rounded-lg bg-surface-container-low/80 backdrop-blur-sm border border-error/30">
            <div className="p-6">
              <h2 className="text-headline-sm font-bold text-on-surface mb-2">
                Danger Zone
              </h2>
              <p className="text-body-sm text-on-surface-variant/80 mb-4">
                Cancel your subscription. You'll continue to have access until
                the end of your billing period.
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 rounded-md bg-error/10 text-error text-label-md font-medium hover:bg-error/20 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-scrim/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container rounded-lg max-w-md w-full p-6 border border-outline-variant/15">
            <h3 className="text-headline-md font-bold text-on-surface mb-4">
              Cancel Subscription?
            </h3>
            <p className="text-body-md text-on-surface-variant/80 mb-6">
              Are you sure you want to cancel your subscription? You'll lose
              access to premium features at the end of your current billing
              period ({formatDate(currentPeriodEnd)}).
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCanceling}
                className="px-4 py-2 rounded-md bg-surface-container-high text-on-surface text-label-md font-medium hover:bg-surface-bright transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="px-4 py-2 rounded-md bg-error text-on-error text-label-md font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isCanceling ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Canceling...
                  </span>
                ) : (
                  "Cancel Subscription"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
