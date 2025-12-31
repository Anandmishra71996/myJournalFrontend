'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
    Goal,
    GOAL_TYPES_OPTIONS,
    MAX_GOALS,
    GoalStats,
} from '@/constants/goal.constants';

export default function GoalsPage() {
    const router = useRouter();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [stats, setStats] = useState<GoalStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchGoals();
        fetchStats();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await api.get('/goals');
            if (response.data.success) {
                setGoals(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/goals/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleStatusChange = async (goalId: string, newStatus: string) => {
        setActionLoading(goalId);
        try {
            const response = await api.patch(`/goals/${goalId}/status`, {
                status: newStatus,
            });
            if (response.data.success) {
                setGoals(
                    goals.map((g) =>
                        g._id === goalId ? { ...g, status: newStatus as any } : g
                    )
                );
                fetchStats();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to update goal status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (goalId: string) => {
        if (!confirm('Are you sure you want to archive this goal?')) return;

        setActionLoading(goalId);
        try {
            const response = await api.delete(`/goals/${goalId}`);
            if (response.data.success) {
                setGoals(goals.filter((g) => g._id !== goalId));
                fetchStats();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to archive goal');
        } finally {
            setActionLoading(null);
        }
    };

    const canCreateGoal = (type: string) => {
        if (!stats) return true;
        const typeStats = stats[type as keyof GoalStats];
        if (!typeStats) return true;
        const maxForType = MAX_GOALS[type as keyof typeof MAX_GOALS];
        return typeStats.active < maxForType;
    };

    const getGoalsByType = (type: string) => {
        return goals.filter((g) => g.type === type && g.status !== 'archived');
    };

    const renderGoalCard = (goal: Goal) => {
        const isLoading = actionLoading === goal._id;

        return (
            <div
                key={goal._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {goal.title}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {goal.category}
                            </span>
                            {goal.status === 'completed' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Completed
                                </span>
                            )}
                            {goal.status === 'paused' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Paused
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {goal.why && (
                    <p className="text-sm text-gray-600 mb-4">{goal.why}</p>
                )}

                {goal.trackingMethods.length > 0 && (
                    <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                            Tracking via:
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {goal.trackingMethods.map((method) => (
                                <span
                                    key={method}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                                >
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => router.push(`/goals/${goal._id}/edit`)}
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
                    >
                        Edit
                    </button>

                    {goal.status === 'active' && (
                        <>
                            <button
                                onClick={() => handleStatusChange(goal._id, 'paused')}
                                disabled={isLoading}
                                className="flex-1 px-3 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 disabled:opacity-50"
                            >
                                Pause
                            </button>
                            <button
                                onClick={() => handleStatusChange(goal._id, 'completed')}
                                disabled={isLoading}
                                className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50"
                            >
                                Complete
                            </button>
                        </>
                    )}

                    {goal.status === 'paused' && (
                        <button
                            onClick={() => handleStatusChange(goal._id, 'active')}
                            disabled={isLoading}
                            className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50"
                        >
                            Resume
                        </button>
                    )}

                    {goal.status === 'completed' && (
                        <button
                            onClick={() => handleDelete(goal._id)}
                            disabled={isLoading}
                            className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
                        >
                            Archive
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderGoalSection = (type: string, label: string) => {
        const typeGoals = getGoalsByType(type);
        const canCreate = canCreateGoal(type);
        const maxForType = MAX_GOALS[type as keyof typeof MAX_GOALS];
        const activeCount = stats?.[type as keyof GoalStats]?.active || 0;

        return (
            <div key={type} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
                        <p className="text-sm text-gray-500">
                            {activeCount} of {maxForType} active goals
                        </p>
                    </div>
                    <button
                        onClick={() => router.push(`/goals/create?type=${type}`)}
                        disabled={!canCreate}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {canCreate ? `Add ${label}` : `Limit Reached`}
                    </button>
                </div>

                {typeGoals.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <p className="text-gray-500 mb-2">
                            No {label.toLowerCase()} yet
                        </p>
                        <p className="text-sm text-gray-400">
                            Create your first {label.toLowerCase()} to get started
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {typeGoals.map(renderGoalCard)}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="space-y-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i}>
                                    <div className="h-6 bg-gray-200 rounded w-1/6 mb-4"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1, 2].map((j) => (
                                            <div
                                                key={j}
                                                className="h-48 bg-gray-200 rounded-xl"
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Goals</h1>
                    <p className="text-gray-600">
                        Track your weekly, monthly, and yearly goals
                    </p>
                </div>

                {GOAL_TYPES_OPTIONS.map((type) =>
                    renderGoalSection(type.value, type.label)
                )}
            </div>
        </div>
    );
}
