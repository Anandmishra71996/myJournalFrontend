'use client';

import { useState } from 'react';
import { XMarkIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { aiTemplateService, TemplateGenerationResult } from '@/services/aiTemplate.service';

interface GenerateTemplateModalProps {
    onClose: () => void;
    /** Called when the agent returns a result — parent decides next action */
    onResult: (result: TemplateGenerationResult) => void;
}

type Step = 'input' | 'loading';

export default function GenerateTemplateModal({
    onClose,
    onResult,
}: GenerateTemplateModalProps) {
    const [step, setStep] = useState<Step>('input');
    const [goal, setGoal] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!goal.trim()) return;
        setError(null);
        setStep('loading');

        try {
            const response = await aiTemplateService.generateTemplate(goal.trim());
            if (response.success && response.data) {
                onResult(response.data);
                onClose();
            } else {
                setError('AI generation failed. Please try again or create manually.');
                setStep('input');
            }
        } catch (err: any) {
            const msg =
                err?.response?.data?.error ||
                err?.message ||
                'AI generation failed. Please try again or create manually.';
            setError(msg);
            setStep('input');
        }
    };

    // ── Loading state ────────────────────────────────────────────────────────
    if (step === 'loading') {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <SparklesIcon className="w-12 h-12 text-indigo-500 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Generating your template…
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        The AI is analyzing your goal and crafting the perfect template.
                        This usually takes 5–15 seconds.
                    </p>
                    <div className="mt-6">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    // ── Input state ──────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Generate Template with AI
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                    Describe what you want to track. The AI will search existing templates
                    or create a custom one tailored to your goal.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-700 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            What do you want to track?
                        </label>
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleGenerate();
                                }
                            }}
                            placeholder="e.g. I want to track my gym progress daily — sets, reps, energy level, and notes"
                            rows={3}
                            maxLength={500}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">
                            {goal.length}/500
                        </p>
                    </div>

                    {/* Quick-fill examples */}
                    <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Quick examples:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'Daily gym progress',
                                'Sleep & recovery',
                                'Weekly reflection',
                                'Mood & anxiety tracking',
                                'Study sessions',
                            ].map((example) => (
                                <button
                                    key={example}
                                    type="button"
                                    onClick={() => setGoal(example)}
                                    className="px-3 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={!goal.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            <SparklesIcon className="w-4 h-4" />
                            Generate Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
