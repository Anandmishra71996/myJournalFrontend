import api from '@/lib/api';
import type { FieldType, TemplateField } from '@/types/journalTemplate.types';

export type GoalTemplateMode = 'unified' | 'separate';
export type CoverageType = 'full' | 'partial' | 'none';

export interface TemplateSummary {
    id: string;
    name: string;
    createdBy: 'system' | 'user';
    fieldLabels: string[];
}

export interface SuggestedFieldDraft {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
    min?: number;
    max?: number;
}

export interface CoverageAnalysis {
    goalIds: string[];
    goalTitles: string[];
    signals: string[];
    coverageType: CoverageType;
    coveragePercent: number;
    coveredSignals: string[];
    missingSignals: string[];
    suggestedAction: 'use_existing' | 'update_or_create' | 'create_new';
    bestTemplate: TemplateSummary | null;
    candidateTemplates: TemplateSummary[];
    suggestedFields: SuggestedFieldDraft[];
}

export interface TemplateCoverageResult {
    mode: GoalTemplateMode;
    analyses: CoverageAnalysis[];
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface MergeFieldsResult {
    template: any;
    addedFields: TemplateField[];
    skippedLabels: string[];
    truncated: boolean;
}

class GoalTemplateService {
    async analyzeCoverage(payload: {
        goalIds?: string[];
        mode?: GoalTemplateMode;
    }): Promise<ApiResponse<TemplateCoverageResult>> {
        const response = await api.post('/goals/template-coverage', payload);
        return response.data;
    }

    async mergeFields(
        templateId: string,
        fields: SuggestedFieldDraft[]
    ): Promise<ApiResponse<MergeFieldsResult>> {
        const response = await api.patch(`/journal-templates/${templateId}/merge-fields`, {
            fields,
        });
        return response.data;
    }
}

export const goalTemplateService = new GoalTemplateService();
