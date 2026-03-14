import api from '@/lib/api';
import type { JournalTemplate } from '@/types/journalTemplate.types';

export interface TemplateGenerationResult {
    type: 'existing' | 'generated';
    template: JournalTemplate;
    message: string;
}

class AiTemplateService {
    /**
     * POST /ai/templates/generate
     * Sends a user goal to the backend TemplateAgent and returns
     * either an existing template suggestion or a newly generated one.
     */
    async generateTemplate(
        goal: string
    ): Promise<{ success: boolean; data: TemplateGenerationResult; message: string }> {
        const response = await api.post('/ai/templates/generate', { goal });
        return response.data;
    }
}

export const aiTemplateService = new AiTemplateService();
export default aiTemplateService;
