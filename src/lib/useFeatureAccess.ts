import { useMemo } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { FeatureLimits } from '@/types/subscription.types';

export interface FeatureAccessResult {
    allowed: boolean;
    message?: string;
    remainingQuota?: number | null;
    upgradeTier?: string;
}

/**
 * Hook to check if user has access to a specific feature based on their subscription tier
 */
export function useFeatureAccess(
    featureName: keyof FeatureLimits
): FeatureAccessResult {
    const { checkFeatureAccess, featureLimits, tier, getRemainingQuota } = useSubscriptionStore();

    return useMemo(() => {
        const allowed = checkFeatureAccess(featureName);
        const featureValue = featureLimits[featureName];

        // For boolean features
        if (typeof featureValue === 'boolean') {
            if (!allowed) {
                let upgradeTier = 'Reflect';

                // Voice journaling requires Thrive tier
                if (featureName === 'allowVoiceJournaling') {
                    upgradeTier = 'Thrive';
                }
                // AI chat requires Reflect or Thrive
                else if (featureName === 'allowAIChat' && tier === 'free') {
                    upgradeTier = 'Reflect';
                }

                return {
                    allowed: false,
                    message: `This feature is available in ${upgradeTier} tier`,
                    upgradeTier,
                };
            }

            return { allowed: true };
        }

        // For numeric limits (journals, goals)
        const remainingQuota = featureName === 'maxJournalsPerMonth'
            ? getRemainingQuota('journals')
            : featureName === 'maxActiveGoals'
                ? getRemainingQuota('goals')
                : null;

        if (featureValue === null) {
            // Unlimited
            return { allowed: true, remainingQuota: null };
        }

        if (!allowed || (remainingQuota !== null && remainingQuota <= 0)) {
            const upgradeTier = tier === 'free' ? 'Reflect' : 'Thrive';
            return {
                allowed: false,
                message: `You've reached your ${tier} tier limit. Upgrade to ${upgradeTier} for more.`,
                remainingQuota: 0,
                upgradeTier,
            };
        }

        return {
            allowed: true,
            remainingQuota,
        };
    }, [featureName, checkFeatureAccess, featureLimits, tier, getRemainingQuota]);
}
