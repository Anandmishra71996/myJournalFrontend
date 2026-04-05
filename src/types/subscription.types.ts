export type SubscriptionTier = 'free' | 'reflect' | 'thrive';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'canceled' | 'pending' | 'past_due';
export type PaymentProvider = 'razorpay' | 'stripe';

export interface FeatureLimits {
    maxJournalsPerMonth: number | null; // null = unlimited
    maxActiveGoals: number | null; // null = unlimited
    allowVoiceJournaling: boolean;
    allowAIChat: boolean;
    allowAdvancedInsights: boolean;
    allowCustomTemplates: boolean;
}

export interface TierConfig {
    name: SubscriptionTier;
    displayName: string;
    description: string;
    monthlyPriceInCents: number;
    yearlyPriceInCents: number;
    features: string[];
    featureLimits: FeatureLimits;
    upcomingFeatures?: string[];
}

export interface Subscription {
    tier: SubscriptionTier;
    displayName: string;
    status: SubscriptionStatus;
    billingCycle?: BillingCycle;
    currentPeriodEnd?: string; // ISO date
    cancelAtPeriodEnd: boolean;
    featureLimits: FeatureLimits;
}

export interface UsageStats {
    journalsThisMonth: number;
    journalLimit: number | null;
    activeGoals: number;
    goalLimit: number | null;
    tier: string;
}

export interface SubscriptionSummary extends Subscription {
    usage: UsageStats;
}

export interface RazorpayCheckoutPayload {
    key: string;
    subscriptionId: string;
    name: string;
    description: string;
    callbackUrl: string;
    prefill: {
        name: string;
        email: string;
    };
    notes: Record<string, string>;
}

export interface CheckoutSessionResponse {
    provider: PaymentProvider;
    sessionId?: string;
    url?: string;
    checkout?: RazorpayCheckoutPayload;
}
