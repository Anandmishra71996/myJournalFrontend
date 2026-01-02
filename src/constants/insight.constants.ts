export interface GoalSummary {
    goalId: string;
    goalTitle: string;
    status: 'aligned' | 'partially_aligned' | 'needs_adjustment';
    explanation: string;
}

export interface WeeklyInsight {
    _id: string;
    userId: string;
    weekStart: string;
    weekEnd: string;
    journalCount: number;
    reflection: string[];
    goalSummaries: GoalSummary[];
    suggestion?: string;
    generatedAt: string;
    sourceVersion: number;
}

export const GOAL_STATUS_LABELS: Record<GoalSummary['status'], string> = {
    aligned: '✓ On Track',
    partially_aligned: '⚠ Partial Progress',
    needs_adjustment: '⚡ Needs Attention',
};

export const GOAL_STATUS_COLORS: Record<GoalSummary['status'], string> = {
    aligned: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    partially_aligned: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    needs_adjustment: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};
