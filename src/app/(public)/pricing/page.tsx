"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Loader2, Crown } from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuthStore } from "@/store/authStore";
import { BillingCycle, PaymentProvider } from "@/types/subscription.types";
import FeatureComparisonTable from "@/components/subscription/FeatureComparisonTable";
import PrivacySection from "@/components/subscription/PrivacySection";

export default function PricingPage() {
  const router = useRouter();
  const {
    tiers,
    fetchTiers,
    fetchProviders,
    availableProviders,
    defaultProvider,
    initiateCheckout,
    isLoading,
    tier: currentTier,
  } = useSubscriptionStore();
  const { isAuthenticated } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider>("razorpay");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTiers();
    fetchProviders();
  }, [fetchTiers, fetchProviders]);

  useEffect(() => {
    setSelectedProvider(defaultProvider);
  }, [defaultProvider]);

  const handleGetStarted = async (tier: any) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }

    if (tier.name === "free") {
      router.push("/journals");
      return;
    }

    // Validate that billingCycle is set
    if (!billingCycle) {
      console.error("Billing cycle not set");
      alert("Please select a billing cycle (Monthly or Yearly)");
      return;
    }

    try {
      setCheckoutLoading(tier.name);
      // Directly initiate checkout - this will open Razorpay's hosted checkout modal
      await initiateCheckout(
        tier.name as "reflect" | "thrive",
        billingCycle,
        selectedProvider,
      );
    } catch (error: any) {
      console.error("Checkout failed:", error);

      // Show user-friendly error message
      const errorMessage =
        error?.response?.data?.error || error?.message || "Checkout failed";

      if (
        errorMessage.includes("Plan ID not configured") ||
        errorMessage.includes("not configured")
      ) {
        alert(
          `The ${tier.name.toUpperCase()} tier is not currently available. ` +
            `Please contact support or try the other tier.`,
        );
      } else {
        alert(`Checkout failed: ${errorMessage}`);
      }
    } finally {
      setCheckoutLoading(null);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const getTierIcon = (tierName: string) => {
    if (tierName === "thrive") return <Crown className="h-7 w-7" />;
    if (tierName === "reflect") return <Sparkles className="h-7 w-7" />;
    return <Check className="h-7 w-7" />;
  };

  const getTierGradient = (tierName: string) => {
    if (tierName === "thrive") return "from-secondary-dim to-secondary";
    if (tierName === "reflect") return "from-primary-dim to-primary";
    return "from-outline-variant/20 to-outline-variant/10";
  };

  const isCurrentTier = (tierName: string) => {
    return currentTier === tierName;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/15">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-label-sm font-medium text-on-surface-variant uppercase tracking-wide">
              Subscription Plans - Choose Your Journey
            </span>
          </div>

          <h1 className="font-manrope text-display-lg md:text-display-xl font-bold text-on-surface leading-tight px-4">
            Invest in your inner world.
          </h1>
          <p className="text-body-lg text-on-surface-variant/80 max-w-2xl mx-auto px-4">
            Choose a sanctuary tier to deepen your reflection. Your data is
            always encrypted, private, and yours.
          </p>

          {/* Billing Cycle Toggle - Mobile First */}
          <div className="flex justify-center pt-4">
            <div className="inline-flex items-center gap-2 bg-surface-container-low rounded-full p-1.5 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`
                  px-5 py-2.5 rounded-full text-label-md font-medium transition-all duration-200
                  ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-br from-primary-dim to-primary text-on-primary shadow-md"
                      : "text-on-surface-variant/70 hover:text-on-surface"
                  }
                `}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`
                  relative px-5 py-2.5 rounded-full text-label-md font-medium transition-all duration-200
                  ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-br from-primary-dim to-primary text-on-primary shadow-md"
                      : "text-on-surface-variant/70 hover:text-on-surface"
                  }
                `}
              >
                Yearly
                {billingCycle !== "yearly" && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-secondary-dim to-secondary text-on-secondary text-label-xs px-2 py-0.5 rounded-full font-semibold shadow-lg">
                    Save 17%
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards - Mobile First Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {tiers.map((tier) => {
            const price =
              billingCycle === "monthly"
                ? tier.monthlyPriceInCents
                : tier.yearlyPriceInCents;
            const displayPrice = formatPrice(price);
            const isPopular = tier.name === "reflect";
            const isCurrent = isCurrentTier(tier.name);
            const isLoadingCheckout = checkoutLoading === tier.name;

            return (
              <div
                key={tier.name}
                className={`
                  relative overflow-hidden rounded-xl
                  bg-surface-container-low/80 backdrop-blur-sm
                  transition-all duration-300
                  ${
                    isPopular
                      ? "border-2 border-primary/30 shadow-xl shadow-primary/10 lg:scale-105"
                      : "border border-outline-variant/15"
                  }
                  ${isCurrent ? "ring-2 ring-primary/50" : ""}
                  hover:shadow-2xl hover:-translate-y-1
                `}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-dim via-primary to-primary-dim"></div>
                )}

                {/* Content */}
                <div className="p-6 md:p-8">
                  {/* Tier Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${getTierGradient(tier.name)} shadow-lg`}
                    >
                      <div className="text-on-primary">
                        {getTierIcon(tier.name)}
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-label-xs font-semibold text-primary uppercase tracking-wide px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="font-manrope text-headline-lg font-bold text-on-surface mb-2">
                    {tier.displayName}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    {tier.name === "free" ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-manrope text-display-md font-bold text-on-surface">
                          $0
                        </span>
                        <span className="text-body-md text-on-surface-variant/70">
                          /month
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="font-manrope text-display-md font-bold text-on-surface">
                            ${displayPrice}
                          </span>
                          <span className="text-body-md text-on-surface-variant/70">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </div>
                        {billingCycle === "yearly" && (
                          <p className="text-label-sm text-on-surface-variant/60 mt-1">
                            ${formatPrice(tier.monthlyPriceInCents)}/month
                            billed annually
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <p className="text-body-sm text-on-surface-variant/70 mb-6 min-h-[2.5rem]">
                    {tier.description}
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleGetStarted(tier)}
                    disabled={isCurrent || isLoadingCheckout}
                    className={`
                      w-full py-3.5 px-6 rounded-lg text-label-lg font-semibold
                      transition-all duration-200 transform
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-container-low
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        isPopular
                          ? "bg-gradient-to-br from-primary-dim to-primary text-on-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:ring-primary active:scale-95"
                          : tier.name === "thrive"
                            ? "bg-gradient-to-br from-secondary-dim to-secondary text-on-secondary shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 focus:ring-secondary active:scale-95"
                            : "bg-surface-container-high text-on-surface hover:bg-surface-bright focus:ring-outline-variant active:scale-95"
                      }
                    `}
                  >
                    {isLoadingCheckout ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </span>
                    ) : isCurrent ? (
                      "Current Plan"
                    ) : tier.name === "free" ? (
                      "Get Started"
                    ) : (
                      "Upgrade Now"
                    )}
                  </button>

                  {/* Features List */}
                  <div className="mt-6 pt-6 border-t border-outline-variant/15 space-y-3">
                    {tier.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                          <Check className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <span className="text-body-sm text-on-surface-variant">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-8 md:mb-12">
          <FeatureComparisonTable />
        </div>

        {/* Privacy Section */}
        <div className="mb-8 md:mb-12">
          <PrivacySection />
        </div>

        {/* Footer Note */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="bg-surface-container-low/50 backdrop-blur-sm rounded-xl border border-outline-variant/15 p-6 md:p-8">
            <h2 className="font-manrope text-headline-sm font-bold text-on-surface mb-4">
              All plans include
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span className="text-body-sm text-on-surface-variant">
                  Secure & private
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span className="text-body-sm text-on-surface-variant">
                  Mobile & web access
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span className="text-body-sm text-on-surface-variant">
                  Cancel anytime
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span className="text-body-sm text-on-surface-variant">
                  Dedicated support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
