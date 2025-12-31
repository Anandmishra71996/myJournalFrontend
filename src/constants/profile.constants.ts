// Profile form dropdown options - single source of truth

export const WHY_USING_APP_OPTIONS = [
    { value: 'Improve consistency', label: 'Improve consistency' },
    { value: 'Mental clarity', label: 'Mental clarity' },
    { value: 'Goal tracking', label: 'Goal tracking' },
    { value: 'Self awareness', label: 'Self awareness' },
    { value: 'Reduce stress', label: 'Reduce stress' },
    { value: 'Personal growth', label: 'Personal growth' },
] as const;

export const FOCUS_AREAS_OPTIONS = [
    { value: 'Focus', label: 'Focus' },
    { value: 'Discipline', label: 'Discipline' },
    { value: 'Health', label: 'Health' },
    { value: 'Career', label: 'Career' },
    { value: 'Learning', label: 'Learning' },
    { value: 'Mindset', label: 'Mindset' },
    { value: 'Relationships', label: 'Relationships' },
] as const;

export const LIFE_PHASE_OPTIONS = [
    { value: 'Student', label: 'Student' },
    { value: 'Working professional', label: 'Working professional' },
    { value: 'Founder', label: 'Founder' },
    { value: 'Career transition', label: 'Career transition' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Other', label: 'Other' },
] as const;

export const BIGGEST_CONSTRAINT_OPTIONS = [
    { value: 'Time', label: 'Time' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Motivation', label: 'Motivation' },
    { value: 'Stress', label: 'Stress' },
    { value: 'Clarity', label: 'Clarity' },
] as const;

export const INSIGHT_STYLE_OPTIONS = [
    { value: 'gentle', label: 'Gentle & Supportive' },
    { value: 'practical', label: 'Practical & Actionable' },
    { value: 'analytical', label: 'Analytical & Direct' },
] as const;

export const INSIGHT_FREQUENCY_OPTIONS = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'on-demand', label: 'On-Demand Only' },
] as const;

// Type exports for TypeScript
export type WhyUsingApp = typeof WHY_USING_APP_OPTIONS[number]['value'];
export type FocusArea = typeof FOCUS_AREAS_OPTIONS[number]['value'];
export type LifePhase = typeof LIFE_PHASE_OPTIONS[number]['value'];
export type BiggestConstraint = typeof BIGGEST_CONSTRAINT_OPTIONS[number]['value'];
export type InsightStyle = typeof INSIGHT_STYLE_OPTIONS[number]['value'];
export type InsightFrequency = typeof INSIGHT_FREQUENCY_OPTIONS[number]['value'];

export interface ProfileFormData {
    name: string;
    current_role?: string;
    whyUsingApp: WhyUsingApp;
    focusAreas: FocusArea[];
    lifePhase?: LifePhase;
    biggestConstraint?: BiggestConstraint;
    insightStyle: InsightStyle;
    insightFrequency: InsightFrequency;
    aiEnabled: boolean;
}
