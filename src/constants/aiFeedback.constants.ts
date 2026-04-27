export type ContentType =
    | 'weekly_insight'
    | 'goal'
    | 'memory_pattern'
    | 'template'
    | 'chat_message';

export interface SectionFeedback {
    key: string;
    rating?: number;
    comment?: string;
}

export interface AiFeedback {
    _id: string;
    userId: string;
    contentType: ContentType;
    contentId: string;
    contextDate?: string;
    quickRating?: number;
    sections: SectionFeedback[];
    usedInPrompt: boolean;
    submittedAt: string;
}

export interface FeedbackSectionConfig {
    key: string;
    label: string;
    placeholder: string;
}

export const FEEDBACK_SECTIONS_UI: Record<ContentType, FeedbackSectionConfig[]> = {
    weekly_insight: [
        { key: 'overall', label: 'Overall Insight', placeholder: 'What would make this insight more useful?' },
        { key: 'reflection', label: 'Weekly Reflection', placeholder: 'Were any bullets inaccurate? What was missing?' },
        { key: 'goal_alignment', label: 'Goal Alignment', placeholder: 'Did any goal analysis feel wrong?' },
        { key: 'ai_guidance', label: 'AI Guidance', placeholder: 'Was the suggestion relevant? How could it be better?' },
        { key: 'challenges', label: 'Challenges Faced', placeholder: 'Did any challenge feel incorrect or missed?' },
    ],
    goal: [
        { key: 'overall', label: 'Overall Goal', placeholder: 'How accurate was the goal suggestion?' },
        { key: 'goal_relevance', label: 'Relevance', placeholder: 'Was this goal relevant to your journals?' },
        { key: 'milestones', label: 'Milestones', placeholder: 'Were the milestones realistic?' },
        { key: 'action_steps', label: 'Action Steps', placeholder: 'Did the action steps feel actionable?' },
    ],
    memory_pattern: [
        { key: 'pattern_accuracy', label: 'Pattern Accuracy', placeholder: 'Is this pattern accurate to your experience?' },
        { key: 'evidence_quality', label: 'Evidence Quality', placeholder: 'Was the evidence cited relevant?' },
    ],
    template: [
        { key: 'overall', label: 'Overall Template', placeholder: 'How useful was this template?' },
        { key: 'field_relevance', label: 'Field Relevance', placeholder: 'Were the fields relevant to your needs?' },
    ],
    chat_message: [
        { key: 'overall', label: 'Overall Response', placeholder: 'Was this response helpful?' },
        { key: 'helpfulness', label: 'Helpfulness', placeholder: 'How could the response be more helpful?' },
        { key: 'accuracy', label: 'Accuracy', placeholder: 'Was anything factually incorrect?' },
    ],
};
