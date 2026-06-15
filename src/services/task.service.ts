import api from '@/lib/api';
import { Task, TaskFormData, TaskStatus, TaskStats } from '@/types/task.types';

const toApiPayload = (form: TaskFormData) => ({
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    priority: form.priority,
    dueDate: form.dueDate || undefined,
    dueTime: form.dueTime || undefined,
    estimatedMinutes: form.estimatedMinutes ? Number(form.estimatedMinutes) : undefined,
    linkedGoalId: form.linkedGoalId || undefined,
    recurrence: form.recurrence || undefined,
    tags: form.tags.length ? form.tags : undefined,
    reminderMinutes: form.reminderMinutes ? Number(form.reminderMinutes) : undefined,
});

export const taskService = {
    async getTasks(params?: {
        status?: string;
        priority?: string;
        linkedGoalId?: string;
        dueFrom?: string;
        dueTo?: string;
        includeRecurring?: boolean;
    }): Promise<Task[]> {
        const response = await api.get('/tasks', { params });
        return response.data.data;
    },

    async getTodayTasks(): Promise<Task[]> {
        const response = await api.get('/tasks/today');
        return response.data.data;
    },

    async getUpcomingTasks(): Promise<Task[]> {
        const response = await api.get('/tasks/upcoming');
        return response.data.data;
    },

    async getStats(): Promise<TaskStats> {
        const response = await api.get('/tasks/stats');
        return response.data.data;
    },

    async getTaskById(id: string): Promise<Task> {
        const response = await api.get(`/tasks/${id}`);
        return response.data.data;
    },

    async createTask(form: TaskFormData): Promise<Task> {
        const response = await api.post('/tasks', toApiPayload(form));
        return response.data.data;
    },

    async updateTask(id: string, form: Partial<TaskFormData>): Promise<Task> {
        const response = await api.put(`/tasks/${id}`, toApiPayload(form as TaskFormData));
        return response.data.data;
    },

    async updateStatus(id: string, status: TaskStatus, completionNote?: string): Promise<Task> {
        const response = await api.patch(`/tasks/${id}/status`, { status, completionNote });
        return response.data.data;
    },

    async deleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },

    async populateRecurring(): Promise<{ populated: number }> {
        const response = await api.post('/tasks/populate-recurring');
        return response.data.data;
    },
};
