'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import GoalForm from '@/components/goals/GoalForm';
import api from '@/lib/api';
import { GoalFormData } from '@/constants/goal.constants';

export default function CreateGoalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedType = searchParams.get('type');

    const handleSubmit = async (data: GoalFormData) => {
        try {
            const response = await api.post('/goals', data);
            if (response.data.success) {
                router.push('/goals');
            }
        } catch (error: any) {
            alert(
                error.response?.data?.error ||
                    'Failed to create goal. Please try again.'
            );
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mb-4 flex items-center gap-2"
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Create New Goal
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Set a clear goal and define how you'll track it through
                        journaling
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    <GoalForm
                        onSubmit={handleSubmit}
                        submitLabel="Create Goal"
                        preselectedType={preselectedType || undefined}
                    />
                </div>
            </div>
        </div>
    );
}
