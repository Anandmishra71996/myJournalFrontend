import api from '@/lib/api';
import { Journal, JournalData } from '@/types/journal.types';
import { WeeklyInsight } from '@/constants/insight.constants';
import { AiFeedback, ContentType, SectionFeedback } from '@/constants/aiFeedback.constants';

export const journalService = {
    buildJournalFormData: (data: JournalData, audioFiles: Blob[]) => {
        const formData = new FormData();

        audioFiles.forEach((audioBlob, index) => {
            formData.append('audioFiles', audioBlob, `recording-${index}.webm`);
        });

        Object.entries(data).forEach(([key, value]) => {
            if (value === undefined || value === null) {
                return;
            }

            if (value instanceof Date) {
                formData.append(key, value.toISOString());
                return;
            }

            if (typeof value === 'object') {
                formData.append(key, JSON.stringify(value));
                return;
            }

            formData.append(key, String(value));
        });

        return formData;
    },

    createJournal: async (data: JournalData, audioFiles?: Blob[]) => {
        // If audio files are provided, use FormData
        if (audioFiles && audioFiles.length > 0) {
            const formData = journalService.buildJournalFormData(data, audioFiles);

            const response = await api.post('/journals', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }

        // No audio files, send as regular JSON
        const response = await api.post('/journals', data);
        return response.data;
    },

    getJournalByDate: async (date: Date, templateId?: string) => {
        const params: any = { date: date.toISOString() };

        // Include templateId in query if provided (including empty string for no template)
        if (templateId !== undefined) {
            params.templateId = templateId;
        }

        const response = await api.get('/journals/by-date', { params });
        return response.data;
    },

    getTodayJournal: async () => {
        const response = await api.get('/journals/today');
        return response.data;
    },

    updateJournal: async (id: string, data: Partial<JournalData>, audioFiles?: Blob[]) => {
        // If audio files are provided, use FormData
        if (audioFiles && audioFiles.length > 0) {
            const formData = journalService.buildJournalFormData(data as JournalData, audioFiles);

            const response = await api.put(`/journals/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        }

        // No audio files, send as regular JSON
        const response = await api.put(`/journals/${id}`, data);
        return response.data;
    },

    deleteJournal: async (id: string) => {
        const response = await api.delete(`/journals/${id}`);
        return response.data;
    },

    refreshAudioUrls: async (id: string) => {
        const response = await api.post(`/journals/${id}/refresh-audio-urls`);
        return response.data;
    },

    getWeeklyJournals: async (startDate: Date, endDate: Date) => {
        const response = await api.get('/journals/weekly', {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
        });
        return response.data;
    },

    getMonthlyJournals: async (startDate: Date, endDate: Date) => {
        const response = await api.get('/journals/monthly', {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
        });
        return response.data;
    },

    getWeeklyInsight: async (weekStart: string): Promise<{ success: boolean; data: WeeklyInsight }> => {
        const response = await api.get(`/insights?weekStart=${weekStart}`);
        return response.data;
    },

    generateWeeklyInsight: async (weekStart: string): Promise<{ success: boolean; data: WeeklyInsight }> => {
        const response = await api.post('/insights/generate', { weekStart });
        return response.data;
    },

    getAiFeedback: async (contentType: ContentType, contentId: string): Promise<{ success: boolean; data: AiFeedback | null }> => {
        const response = await api.get(`/feedback/${contentType}/${contentId}`);
        return response.data;
    },

    submitAiFeedback: async (
        contentType: ContentType,
        contentId: string,
        payload: { quickRating?: number; sections?: SectionFeedback[]; contextDate?: string },
    ): Promise<{ success: boolean; data: AiFeedback }> => {
        const response = await api.post(`/feedback/${contentType}/${contentId}`, payload);
        return response.data;
    },
};
