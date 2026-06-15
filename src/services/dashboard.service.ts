import api from '@/lib/api';
import type {
  ActivityDay,
  JournalStats,
  TaskStats,
  BehavioralMetrics,
  MemoryPattern,
  DashboardGoal,
  LatestInsight,
} from '@/types/dashboard.types';

function dateRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

export const dashboardService = {
  getActivity: async (days: number, type?: string): Promise<ActivityDay[]> => {
    const { from, to } = dateRange(days);
    const params = new URLSearchParams({ from, to });
    if (type && type !== 'all') params.set('type', type);
    const res = await api.get(`/journals/activity?${params}`);
    return res.data.data;
  },

  getJournalStats: async (days: number): Promise<JournalStats> => {
    const { from, to } = dateRange(days);
    const res = await api.get(`/journals/stats?from=${from}&to=${to}`);
    return res.data.data;
  },

  getGoals: async (category?: string): Promise<DashboardGoal[]> => {
    const params = new URLSearchParams({ status: 'active' });
    if (category && category !== 'all') params.set('category', category);
    const res = await api.get(`/goals?${params}`);
    return res.data.data;
  },

  getLatestInsight: async (): Promise<LatestInsight | null> => {
    try {
      const res = await api.get('/insights/latest');
      return res.data.data;
    } catch {
      return null;
    }
  },

  getBehavioralMetrics: async (): Promise<BehavioralMetrics> => {
    const res = await api.get('/users/me/behavioral-metrics');
    return res.data.data;
  },

  getMemoryPatterns: async (): Promise<MemoryPattern[]> => {
    const res = await api.get('/memories?status=active&limit=3');
    return res.data.data ?? [];
  },

  getTaskStats: async (): Promise<TaskStats> => {
    const res = await api.get('/tasks/stats');
    return res.data.data;
  },

  getTodayTasks: async () => {
    const res = await api.get('/tasks/today');
    return res.data.data ?? [];
  },
};
