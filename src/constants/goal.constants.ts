export const GOAL_TYPES_OPTIONS = [
    { value: 'weekly', label: 'Weekly Goal' },
    { value: 'monthly', label: 'Monthly Goal' },
    { value: 'yearly', label: 'Yearly Goal' },
] as const;

export const GOAL_CATEGORIES_OPTIONS = [
    { value: 'Health', label: 'Health & Wellness' },
    { value: 'Career', label: 'Career & Work' },
    { value: 'Learning', label: 'Learning & Growth' },
    { value: 'Mindset', label: 'Mindset & Mental Health' },
    { value: 'Relationships', label: 'Relationships' },
    { value: 'Personal', label: 'Personal Development' },
] as const;

export const GOAL_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'archived', label: 'Archived' },
] as const;

export const TRACKING_METHODS_OPTIONS = [
    { value: 'daily-checkins', label: 'Daily Check-ins' },
    { value: 'weekly-reviews', label: 'Weekly Reviews' },
    { value: 'habit-tracker', label: 'Habit Tracker' },
    { value: 'mood-tracking', label: 'Mood Tracking' },
    { value: 'journaling', label: 'Regular Journaling' },
    { value: 'progress-notes', label: 'Progress Notes' },
    { value: 'reflection-prompts', label: 'Reflection Prompts' },
    { value: 'milestone-marking', label: 'Milestone Marking' },
    { value: 'observation-logs', label: 'Observation Logs' },
] as const;

export const JOURNAL_SIGNALS_OPTIONS = [
    { value: 'emotional-patterns', label: 'Emotional patterns changing' },
    { value: 'increased-energy', label: 'Increased energy levels' },
    { value: 'better-sleep', label: 'Better sleep quality' },
    { value: 'clearer-thinking', label: 'Clearer thinking' },
    { value: 'positive-relationships', label: 'More positive relationships' },
    { value: 'reduced-stress', label: 'Reduced stress levels' },
    { value: 'consistent-habits', label: 'More consistent habits' },
    { value: 'improved-focus', label: 'Improved focus' },
    { value: 'gratitude-increase', label: 'Increase in gratitude' },
    { value: 'confidence-building', label: 'Building confidence' },
    { value: 'overcoming-fears', label: 'Overcoming fears' },
    { value: 'self-awareness', label: 'Greater self-awareness' },
] as const;

export const MAX_GOALS = {
    weekly: 3,
    monthly: 5,
    yearly: 3,
} as const;

// TypeScript types
export type GoalType = typeof GOAL_TYPES_OPTIONS[number]['value'];
export type GoalCategory = typeof GOAL_CATEGORIES_OPTIONS[number]['value'];
export type GoalStatus = typeof GOAL_STATUS_OPTIONS[number]['value'];
export type TrackingMethod = typeof TRACKING_METHODS_OPTIONS[number]['value'];
export type JournalSignal = typeof JOURNAL_SIGNALS_OPTIONS[number]['value'];

export interface GoalFormData {
    title: string;
    type: GoalType;
    category: GoalCategory;
    why?: string;
    trackingMethods: TrackingMethod[];
    journalSignals: JournalSignal[];
    successDefinition?: string;
    isRepetitive?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface Goal extends GoalFormData {
    _id: string;
    userId: string;
    status: GoalStatus;
    isRepetitive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GoalStats {
    weekly: { active: number; completed: number; paused: number };
    monthly: { active: number; completed: number; paused: number };
    yearly: { active: number; completed: number; paused: number };
}
