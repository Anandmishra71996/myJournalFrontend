'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GoalForm from '@/components/goals/GoalForm';
import api from '@/lib/api';
import { Goal, GoalFormData } from '@/constants/goal.constants';

export default function EditGoalPage() {
    const router = useRouter();
    const params = useParams();
    const goalId = params.id as string;

    const [goal, setGoal] = useState<Goal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGoal();
    }, [goalId]);

    const fetchGoal = async () => {
        try {
            const response = await api.get(`/goals/${goalId}`);
            if (response.data.success) {
                setGoal(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch goal:', error);
            alert('Failed to load goal');
            router.push('/goals');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: GoalFormData) => {
        try {
            const response = await api.put(`/goals/${goalId}`, data);
            if (response.data.success) {
                router.push('/goals');
            }
        } catch (error: any) {
            alert(
                error.response?.data?.error ||
                    'Failed to update goal. Please try again.'
            );
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i}>
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!goal) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center py-16">
                        <p className="text-gray-500">Goal not found</p>
                        <button
                            onClick={() => router.push('/goals')}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Back to Goals
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Goals
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Edit Goal
                    </h1>
                    <p className="text-gray-600">
                        Update your goal details and tracking methods
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <GoalForm
                        initialData={goal}
                        onSubmit={handleSubmit}
                        submitLabel="Update Goal"
                    />
                </div>
            </div>
        </div>
    );
}
