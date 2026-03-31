import api from '@/lib/api';
import type { GoalMilestone, GoalWeeklyPlan, GoalActionStep } from '@/constants/goal.constants';

export interface GoalBreakdownPlan {
    mainGoalId: string;
    childGoalIds?: string[];
    title: string;
    milestones: GoalMilestone[];
    weeklyPlan: GoalWeeklyPlan[];
    actionSteps: GoalActionStep[];
}

export interface GoalBreakdownResult {
    clarificationNeeded: boolean;
    clarifyingQuestions?: string[];
    goalPlan?: GoalBreakdownPlan;
    message: string;
}

export interface GoalBreakdownRequest {
    goal: string;
    category: string;
    type: 'weekly' | 'monthly' | 'yearly';
    parentGoalId?: string;
    clarificationAnswers?: Record<string, string>;
    clarificationIteration?: number;
}

class GoalBreakdownService {
    /**
     * POST /ai/goals/breakdown
     *
     * Phase 1: Send goal without clarificationAnswers.
     *   - If goal is ambiguous: returns {clarificationNeeded: true, clarifyingQuestions}
     *   - If goal is clear: returns {clarificationNeeded: false, goalPlan} (already saved)
     *
     * Phase 2: Send same goal WITH clarificationAnswers.
     *   - Always returns {clarificationNeeded: false, goalPlan} (already saved)
     */
    async generateBreakdown(
        request: GoalBreakdownRequest
    ): Promise<{ success: boolean; data: GoalBreakdownResult; message: string }> {
        try {
            const response = await api.post('/ai/goals/breakdown', request, {
                // Goal planning can involve multiple LLM steps and DB writes.
                timeout: 120000,
            });
            return response.data;
        } catch (error: any) {
            if (error?.code === 'ECONNABORTED') {
                throw new Error('Goal generation is taking longer than expected. Please try again.');
            }
            throw error;
        }
    }
}

export const goalBreakdownService = new GoalBreakdownService();
export default goalBreakdownService;
