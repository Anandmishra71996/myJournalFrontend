'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
    getCurrentWeek,
    getPreviousWeek,
    getNextWeek,
    formatWeekRange,
    isCurrentWeek,
    isFutureWeek,
} from '@/utils/weekUtils';
import {
    WeeklyInsight,
    GOAL_STATUS_LABELS,
    GOAL_STATUS_COLORS,
} from '@/constants/insight.constants';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export default function InsightsPage() {
    const router = useRouter();
    const [weekStart, setWeekStart] = useState<string>('');
    const [weekEnd, setWeekEnd] = useState<string>('');
    const [insight, setInsight] = useState<WeeklyInsight | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const { weekStart: currentWeekStart, weekEnd: currentWeekEnd } = getCurrentWeek();
        setWeekStart(currentWeekStart);
        setWeekEnd(currentWeekEnd);
    }, []);

    useEffect(() => {
        if (weekStart) {
            fetchInsight();
        }
    }, [weekStart]);

    const fetchInsight = async () => {
        setLoading(true);
        setInsight(null);

        try {
            const response = await api.get(`/insights?weekStart=${weekStart}`);
            setInsight(response.data.data);
        } catch (error: any) {
            if (error.response?.status !== 404) {
                console.error('Error fetching insight:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateInsight = async () => {
        if (isFutureWeek(weekStart)) {
            toast.error('Cannot generate insights for future weeks');
            return;
        }

        setGenerating(true);

        try {
            const response = await api.post('/insights/generate', { weekStart });
            setInsight(response.data.data);
            toast.success('Weekly insights generated!');
        } catch (error: any) {
            console.error('Error generating insight:', error);
            toast.error(error.response?.data?.error || 'Failed to generate insights');
        } finally {
            setGenerating(false);
        }
    };

    const handlePreviousWeek = () => {
        const prevWeek = getPreviousWeek(weekStart);
        setWeekStart(prevWeek);
        const prevWeekEnd = new Date(prevWeek);
        prevWeekEnd.setDate(prevWeekEnd.getDate() + 6);
        setWeekEnd(prevWeekEnd.toISOString().split('T')[0]);
    };

    const handleNextWeek = () => {
        if (isFutureWeek(weekStart)) {
            return;
        }

        const nextWeek = getNextWeek(weekStart);
        if (isFutureWeek(nextWeek)) {
            return;
        }

        setWeekStart(nextWeek);
        const nextWeekEnd = new Date(nextWeek);
        nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);
        setWeekEnd(nextWeekEnd.toISOString().split('T')[0]);
    };

    const canGoNext = weekStart && !isFutureWeek(getNextWeek(weekStart));

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Weekly Insights
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        AI-powered reflections on your journaling patterns and goal progress
                    </p>
                </div>

                {/* Week Selector */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePreviousWeek}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronLeftIcon className="h-6 w-6" />
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                {isCurrentWeek(weekStart) ? 'Current Week' : 'Past Week'}
                            </p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {weekStart && weekEnd ? formatWeekRange(weekStart, weekEnd) : 'Loading...'}
                            </p>
                        </div>

                        <button
                            onClick={handleNextWeek}
                            disabled={!canGoNext}
                            className={`p-2 rounded-lg transition-colors ${
                                canGoNext
                                    ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !insight && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                        <SparklesIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No insights yet for this week
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Generate AI-powered insights based on your journal entries and goals.
                        </p>
                        <button
                            onClick={handleGenerateInsight}
                            disabled={generating || isFutureWeek(weekStart)}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {generating ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="h-5 w-5 mr-2" />
                                    Generate Weekly Insights
                                </>
                            )}
                        </button>
                        {isFutureWeek(weekStart) && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                                Cannot generate insights for future weeks
                            </p>
                        )}
                    </div>
                )}

                {/* Insight Display */}
                {!loading && insight && (
                    <div className="space-y-6">
                        {/* Meta Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>📝 {insight.journalCount} journal entries</span>
                                <span>•</span>
                                <span>Generated {new Date(insight.generatedAt).toLocaleDateString()}</span>
                            </div>
                            <button
                                onClick={handleGenerateInsight}
                                disabled={generating}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium disabled:opacity-50"
                            >
                                {generating ? 'Regenerating...' : 'Regenerate'}
                            </button>
                        </div>

                        {/* Reflection */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                <SparklesIcon className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                Weekly Reflection
                            </h2>
                            <ul className="space-y-3">
                                {insight.reflection.map((point, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Goal Summaries */}
                        {insight.goalSummaries.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Goal Alignment
                                </h2>
                                <div className="space-y-4">
                                    {insight.goalSummaries.map((goalSummary, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {goalSummary.goalTitle}
                                                </h3>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        GOAL_STATUS_COLORS[goalSummary.status]
                                                    }`}
                                                >
                                                    {GOAL_STATUS_LABELS[goalSummary.status]}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {goalSummary.explanation}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestion */}
                        {insight.suggestion && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-sm p-6 border border-indigo-100 dark:border-indigo-900/30">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                    <LightBulbIcon className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
                                    Suggestion for Next Week
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300">{insight.suggestion}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
