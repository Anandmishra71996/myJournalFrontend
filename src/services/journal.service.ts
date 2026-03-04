import api from '@/lib/api';
import { Journal, JournalData } from '@/types/journal.types';

export const journalService = {
    createJournal: async (data: JournalData) => {
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

    updateJournal: async (id: string, data: Partial<JournalData>) => {
        const response = await api.put(`/journals/${id}`, data);
        return response.data;
    },

    deleteJournal: async (id: string) => {
        const response = await api.delete(`/journals/${id}`);
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
};
