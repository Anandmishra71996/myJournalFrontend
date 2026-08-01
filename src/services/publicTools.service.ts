import api from '@/lib/api';

export type BigFiveTrait =
    | 'openness'
    | 'conscientiousness'
    | 'extraversion'
    | 'agreeableness'
    | 'neuroticism';

export interface PersonalityTraitResult {
    trait: BigFiveTrait;
    score: number;
    insight: string;
    quote: string;
}

export interface PersonalityAnalysisResult {
    headline: string;
    traits: PersonalityTraitResult[];
    blindSpot: string;
}

export type BehaviorMetric =
    | 'actionRatio'
    | 'mindset'
    | 'locusOfControl'
    | 'procrastinationSignal';

export interface BehaviorMetricResult {
    metric: BehaviorMetric;
    score: number;
    label: string;
    insight: string;
    quote: string;
}

export interface BehaviorSnapshotResult {
    headline: string;
    metrics: BehaviorMetricResult[];
}

export type BurnoutRiskLevel = 'low' | 'moderate' | 'high';

export interface BurnoutStressorResult {
    label: string;
    insight: string;
    quote: string;
}

export interface BurnoutCheckResult {
    burnoutRisk: {
        level: BurnoutRiskLevel;
        score: number;
        summary: string;
    };
    resilienceScore: number;
    resilienceInsight: string;
    stressors: BurnoutStressorResult[];
    microActions: string[];
}

export interface BurnoutCheckPayload {
    energy: number;
    sleep: number;
    motivation: number;
    overwhelm: number;
    exhaustion: number;
    control: number;
    drainText: string;
}

class PublicToolsService {
    /**
     * POST /public/tools/personality-from-writing/analyze
     * No auth required. Returns a Big Five personality read from pasted text.
     */
    async analyzePersonality(
        text: string
    ): Promise<{ success: boolean; data: PersonalityAnalysisResult }> {
        const response = await api.post('/public/tools/personality-from-writing/analyze', { text });
        return response.data;
    }

    /**
     * POST /public/tools/behavior-check/analyze
     * No auth required. Returns Action Ratio, Mindset, Locus of Control, and
     * Procrastination Signal from a 3-question self-report of the last 7 days.
     */
    async analyzeBehaviorSnapshot(
        activities: string,
        avoided: string,
        feelings: string
    ): Promise<{ success: boolean; data: BehaviorSnapshotResult }> {
        const response = await api.post('/public/tools/behavior-check/analyze', {
            activities,
            avoided,
            feelings,
        });
        return response.data;
    }

    /**
     * POST /public/tools/burnout-check/analyze
     * No auth required. Returns burnout risk, resilience score, top stressors,
     * and 3 micro-actions from 6 quick ratings plus a free-text answer.
     */
    async analyzeBurnoutCheck(
        payload: BurnoutCheckPayload
    ): Promise<{ success: boolean; data: BurnoutCheckResult }> {
        const response = await api.post('/public/tools/burnout-check/analyze', payload);
        return response.data;
    }
}

export const publicToolsService = new PublicToolsService();
export default publicToolsService;
