import api from '@/lib/api';
import {
    TierConfig,
    SubscriptionSummary,
    SubscriptionTier,
    BillingCycle,
    CheckoutSessionResponse,
    PaymentProvider,
} from '@/types/subscription.types';

export const subscriptionService = {
    /**
     * Get current user's subscription with usage stats
     */
    getMySubscription: async (): Promise<SubscriptionSummary> => {
        const response = await api.get('/subscription/me');
        return response.data.data;
    },

    /**
     * Get all available tiers (for pricing page)
     */
    getTiers: async (): Promise<TierConfig[]> => {
        const response = await api.get('/subscription/tiers');
        return response.data.data;
    },

    /**
     * Get available payment providers and default provider
     */
    getProviders: async (): Promise<{
        defaultProvider: PaymentProvider;
        providers: PaymentProvider[];
    }> => {
        const response = await api.get('/subscription/providers');
        return response.data.data;
    },

    /**
     * Create checkout session for subscription upgrade
     */
    createCheckoutSession: async (
        tier: SubscriptionTier,
        billingCycle: BillingCycle,
        provider?: PaymentProvider
    ): Promise<CheckoutSessionResponse> => {
        const response = await api.post('/subscription/checkout', {
            tier,
            billingCycle,
            provider,
        });
        return response.data.data;
    },

    /**
     * Upgrade/downgrade subscription
     */
    upgradeSubscription: async (
        tier: SubscriptionTier,
        billingCycle: BillingCycle
    ): Promise<void> => {
        await api.post('/subscription/upgrade', {
            tier,
            billingCycle,
        });
    },

    /**
     * Cancel subscription (at end of period)
     */
    cancelSubscription: async (): Promise<{
        cancelAtPeriodEnd: boolean;
        currentPeriodEnd: string;
    }> => {
        const response = await api.post('/subscription/cancel');
        return response.data.data;
    },

    /**
     * Reactivate a canceled subscription
     */
    reactivateSubscription: async (): Promise<void> => {
        await api.post('/subscription/reactivate');
    },
};
