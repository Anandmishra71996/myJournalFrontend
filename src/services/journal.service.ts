import api from '@/lib/api';

export interface JournalData {
    date: Date;
    reflection?: string;
    templateId?: string;
    customFieldValues?: { [fieldId: string]: any };
}

export const journalService = {
    createJournal: async (data: JournalData) => {
        const response = await api.post('/journals', data);
        return response.data;
    },

    getJournalByDate: async (date: Date) => {
        const response = await api.get('/journals/by-date', {
            params: { date: date.toISOString() },
        });
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
