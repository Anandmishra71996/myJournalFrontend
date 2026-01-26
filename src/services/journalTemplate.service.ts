import api from '@/lib/api';
import type {
    JournalTemplate,
    CreateTemplateData,
    UpdateTemplateData,
    CloneTemplateData,
} from '@/types/journalTemplate.types';

class JournalTemplateService {
    private baseUrl = '/journal-templates';

    // Get all system templates
    async getSystemTemplates(): Promise<{ success: boolean; data: JournalTemplate[] }> {
        const response = await api.get(`${this.baseUrl}/system`);
        return response.data;
    }

    // Get user's templates
    async getUserTemplates(): Promise<{ success: boolean; data: JournalTemplate[] }> {
        const response = await api.get(`${this.baseUrl}/my`);
        return response.data;
    }

    // Get default template
    async getDefaultTemplate(): Promise<{ success: boolean; data: JournalTemplate }> {
        const response = await api.get(`${this.baseUrl}/default`);
        return response.data;
    }

    // Get template by ID
    async getTemplateById(id: string): Promise<{ success: boolean; data: JournalTemplate }> {
        const response = await api.get(`${this.baseUrl}/${id}`);
        return response.data;
    }

    // Create new template
    async createTemplate(
        data: CreateTemplateData
    ): Promise<{ success: boolean; data: JournalTemplate; message: string }> {
        const response = await api.post(this.baseUrl, data);
        return response.data;
    }

    // Clone system template
    async cloneTemplate(
        systemTemplateId: string,
        customizations?: CloneTemplateData
    ): Promise<{ success: boolean; data: JournalTemplate; message: string }> {
        const response = await api.post(`${this.baseUrl}/${systemTemplateId}/clone`, customizations || {});
        return response.data;
    }

    // Update template
    async updateTemplate(
        id: string,
        updates: UpdateTemplateData
    ): Promise<{ success: boolean; data: JournalTemplate; message: string }> {
        const response = await api.put(`${this.baseUrl}/${id}`, updates);
        return response.data;
    }

    // Set default template
    async setDefaultTemplate(
        id: string
    ): Promise<{ success: boolean; data: JournalTemplate; message: string }> {
        const response = await api.patch(`${this.baseUrl}/${id}/default`);
        return response.data;
    }

    // Reorder fields
    async reorderFields(
        id: string,
        fieldOrder: { fieldId: string; order: number }[]
    ): Promise<{ success: boolean; data: JournalTemplate; message: string }> {
        const response = await api.patch(`${this.baseUrl}/${id}/reorder`, { fieldOrder });
        return response.data;
    }

    // Delete template
    async deleteTemplate(id: string): Promise<{ success: boolean; message: string }> {
        const response = await api.delete(`${this.baseUrl}/${id}`);
        return response.data;
    }
}

export const journalTemplateService = new JournalTemplateService();
export default journalTemplateService;
