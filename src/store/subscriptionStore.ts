import { create } from 'zustand';
import { subscriptionService } from '@/services/subscription.service';
import {
    SubscriptionTier,
    BillingCycle,
    SubscriptionStatus,
    FeatureLimits,
    TierConfig,
    UsageStats,
    RazorpayCheckoutPayload,
    PaymentProvider,
} from '@/types/subscription.types';

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
    }
}

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    if (window.Razorpay) return true;

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existingScript) {
        return new Promise((resolve) => {
            existingScript.addEventListener('load', () => resolve(true));
            existingScript.addEventListener('error', () => resolve(false));
        });
    }

    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = RAZORPAY_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const openRazorpayCheckout = async (checkout: RazorpayCheckoutPayload): Promise<void> => {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay checkout script');
    }

    const options = {
        key: checkout.key,
        subscription_id: checkout.subscriptionId,
        name: checkout.name,
        description: checkout.description,
        callback_url: checkout.callbackUrl,
        prefill: checkout.prefill,
        notes: checkout.notes,
        theme: {
            color: '#7e51ff',
        },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
};

interface SubscriptionState {
    // Current subscription
    tier: SubscriptionTier;
    displayName: string;
    status: SubscriptionStatus;
    billingCycle?: BillingCycle;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd: boolean;
    featureLimits: FeatureLimits;
    usage: UsageStats | null;

    // Available tiers
    tiers: TierConfig[];
    availableProviders: PaymentProvider[];
    defaultProvider: PaymentProvider;

    // Loading states
    isLoading: boolean;
    isCheckoutLoading: boolean;

    // Actions
    fetchSubscription: () => Promise<void>;
    fetchTiers: () => Promise<void>;
    fetchProviders: () => Promise<void>;
    initiateCheckout: (
        tier: SubscriptionTier,
        billingCycle: BillingCycle,
        provider?: PaymentProvider
    ) => Promise<void>;
    upgradeSubscription: (tier: SubscriptionTier, billingCycle: BillingCycle) => Promise<void>;
    cancelSubscription: () => Promise<void>;
    reactivateSubscription: () => Promise<void>;
    checkFeatureAccess: (featureName: keyof FeatureLimits) => boolean;
    getRemainingQuota: (featureName: 'journals' | 'goals') => number | null;
}

const defaultFeatureLimits: FeatureLimits = {
    maxJournalsPerMonth: 10,
    maxActiveGoals: 3,
    allowVoiceJournaling: false,
    allowAIChat: false,
    allowAdvancedInsights: false,
    allowCustomTemplates: false,
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
    // Initial state
    tier: 'free',
    displayName: 'Free',
    status: 'active',
    cancelAtPeriodEnd: false,
    featureLimits: defaultFeatureLimits,
    usage: null,
    tiers: [],
    availableProviders: ['razorpay', 'stripe'],
    defaultProvider: 'razorpay',
    isLoading: false,
    isCheckoutLoading: false,

    /**
     * Fetch current subscription with usage stats
     */
    fetchSubscription: async () => {
        try {
            set({ isLoading: true });
            const data = await subscriptionService.getMySubscription();
            set({
                tier: data.tier,
                displayName: data.displayName,
                status: data.status,
                billingCycle: data.billingCycle,
                currentPeriodEnd: data.currentPeriodEnd,
                cancelAtPeriodEnd: data.cancelAtPeriodEnd,
                featureLimits: data.featureLimits,
                usage: data.usage,
                isLoading: false,
            });
        } catch (error: any) {
            console.error('Error fetching subscription:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    /**
     * Fetch all available tiers (for pricing page)
     */
    fetchTiers: async () => {
        try {
            const tiers = await subscriptionService.getTiers();
            set({ tiers });
        } catch (error: any) {
            console.error('Error fetching tiers:', error);
            throw error;
        }
    },

    /**
     * Fetch configured payment providers
     */
    fetchProviders: async () => {
        try {
            const data = await subscriptionService.getProviders();
            set({
                availableProviders: data.providers,
                defaultProvider: data.defaultProvider,
            });
        } catch (error: any) {
            console.error('Error fetching providers:', error);
            throw error;
        }
    },

    /**
     * Initiate checkout with the configured payment provider.
     */
    initiateCheckout: async (
        tier: SubscriptionTier,
        billingCycle: BillingCycle,
        provider?: PaymentProvider
    ) => {
        try {
            set({ isCheckoutLoading: true });
            const effectiveProvider = provider || get().defaultProvider;
            const checkoutData = await subscriptionService.createCheckoutSession(
                tier,
                billingCycle,
                effectiveProvider
            );

            if (checkoutData.provider === 'stripe') {
                if (!checkoutData.url) {
                    throw new Error('Stripe checkout URL missing');
                }
                window.location.href = checkoutData.url;
                return;
            }

            if (!checkoutData.checkout) {
                throw new Error('Razorpay checkout payload missing');
            }

            await openRazorpayCheckout(checkoutData.checkout);
            set({ isCheckoutLoading: false });
        } catch (error: any) {
            console.error('Error initiating checkout:', error);
            set({ isCheckoutLoading: false });
            throw error;
        }
    },

    /**
     * Upgrade/downgrade subscription
     */
    upgradeSubscription: async (tier: SubscriptionTier, billingCycle: BillingCycle) => {
        try {
            set({ isLoading: true });
            await subscriptionService.upgradeSubscription(tier, billingCycle);

            // Refresh subscription to get updated data
            await get().fetchSubscription();
        } catch (error: any) {
            console.error('Error upgrading subscription:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    /**
     * Cancel subscription at end of period
     */
    cancelSubscription: async () => {
        try {
            set({ isLoading: true });
            const data = await subscriptionService.cancelSubscription();

            set({
                cancelAtPeriodEnd: data.cancelAtPeriodEnd,
                currentPeriodEnd: data.currentPeriodEnd,
                isLoading: false,
            });
        } catch (error: any) {
            console.error('Error canceling subscription:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    /**
     * Reactivate a canceled subscription
     */
    reactivateSubscription: async () => {
        try {
            set({ isLoading: true });
            await subscriptionService.reactivateSubscription();

            // Refresh subscription to get updated data
            await get().fetchSubscription();
        } catch (error: any) {
            console.error('Error reactivating subscription:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    /**
     * Check if a feature is accessible based on current tier
     */
    checkFeatureAccess: (featureName: keyof FeatureLimits): boolean => {
        const { featureLimits } = get();
        const value = featureLimits[featureName];

        // For boolean features, return the value directly
        if (typeof value === 'boolean') {
            return value;
        }

        // For numeric limits, null means unlimited (allowed)
        return value === null || value > 0;
    },

    /**
     * Get remaining quota for journals or goals
     */
    getRemainingQuota: (featureName: 'journals' | 'goals'): number | null => {
        const { usage, featureLimits } = get();
        if (!usage) return null;

        if (featureName === 'journals') {
            const limit = featureLimits.maxJournalsPerMonth;
            if (limit === null) return null; // unlimited
            return Math.max(0, limit - usage.journalsThisMonth);
        }

        if (featureName === 'goals') {
            const limit = featureLimits.maxActiveGoals;
            if (limit === null) return null; // unlimited
            return Math.max(0, limit - usage.activeGoals);
        }

        return null;
    },
}));
