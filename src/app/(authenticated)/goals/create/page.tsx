'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import GoalForm from '@/components/goals/GoalForm';
import GoalGeneratorChat from '@/components/goals/GoalGeneratorChat';
import api from '@/lib/api';
import { GoalFormData } from '@/constants/goal.constants';
import { Sparkles, Edit3 } from 'lucide-react';

export default function CreateGoalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedType = searchParams.get('type');
    const mode = searchParams.get('mode');
    const [showAIChat, setShowAIChat] = useState(false);
    const [prefilledData, setPrefilledData] = useState<Partial<GoalFormData> | null>(null);

    useEffect(() => {
        // Load AI draft if coming from AI generator
        if (mode === 'ai-edit') {
            const draftStr = localStorage.getItem('aiGoalDraft');
            if (draftStr) {
                try {
                    const draft = JSON.parse(draftStr);
                    setPrefilledData(draft);
                } catch (error) {
                    console.error('Failed to parse AI draft:', error);
                }
            }
        }
    }, [mode]);

    const handleSubmit = async (data: GoalFormData) => {
        try {
            const response = await api.post('/goals', data);
            if (response.data.success) {
                // Clear AI draft if exists
                localStorage.removeItem('aiGoalDraft');
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
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
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                {mode === 'ai-edit' ? 'Edit AI-Generated Goal' : 'Create New Goal'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {mode === 'ai-edit'
                                    ? 'Fine-tune your AI-generated goal or use the chat assistant'
                                    : 'Set a clear goal and define how you\'ll track it through journaling'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAIChat(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            <Sparkles className="w-4 h-4" />
                            AI Assistant
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    {mode === 'ai-edit' && prefilledData && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        AI-Generated Goal
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Review and customize all fields below, or click "AI Assistant" to chat more.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <GoalForm
                        onSubmit={handleSubmit}
                        submitLabel="Create Goal"
                        preselectedType={preselectedType || undefined}
                        initialData={prefilledData || undefined}
                    />
                </div>
            </div>

            {/* AI Chat Drawer */}
            {showAIChat && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 transition-opacity"
                            onClick={() => setShowAIChat(false)}
                        />

                        {/* Drawer Panel */}
                        <div className="absolute inset-y-0 right-0 max-w-2xl w-full flex">
                            <div className="relative w-full h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
                                <GoalGeneratorChat
                                    onClose={() => setShowAIChat(false)}
                                    onGoalsCreated={() => {
                                        setShowAIChat(false);
                                        router.push('/goals');
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
