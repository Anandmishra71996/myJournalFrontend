'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { aiTemplateService, TemplateGenerationResult } from '@/services/aiTemplate.service';

interface GenerateTemplateModalProps {
    onClose: () => void;
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
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (step !== 'loading') {
            setProgress(0);
            return;
        }

        setProgress(7);
        const progressInterval = window.setInterval(() => {
            setProgress((current) => {
                if (current >= 95) return 95;
                const stepSize = Math.max(1, Math.ceil((95 - current) * 0.12));
                return Math.min(95, current + stepSize);
            });
        }, 280);

        return () => {
            window.clearInterval(progressInterval);
        };
    }, [step]);

    const handleGenerate = async () => {
        if (!goal.trim()) return;

        setError(null);
        setStep('loading');

        try {
            const response = await aiTemplateService.generateTemplate(goal.trim());
            if (response.success && response.data) {
                onResult(response.data);
                onClose();
                return;
            }

            setError('AI generation failed. Please try again or create manually.');
            setStep('input');
        } catch (err: any) {
            const msg =
                err?.response?.data?.error ||
                err?.message ||
                'AI generation failed. Please try again or create manually.';
            setError(msg);
            setStep('input');
        }
    };

    if (step === 'loading') {
        return (
            <div
                className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 text-center backdrop-blur-[30px]"
                style={{
                    backgroundColor: 'rgba(8, 10, 14, 0.62)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                }}
            >
                <div className="relative mb-10 h-40 w-40 flex items-center justify-center">
                    <div
                        className="absolute inset-0 rounded-full animate-pulse"
                        style={{
                            background: 'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 44%, transparent) 0%, transparent 68%)',
                        }}
                    />
                    <div
                        className="relative h-20 w-20 rounded-full flex items-center justify-center"
                        style={{
                            background:
                                'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 92%, transparent), var(--color-primary))',
                            boxShadow: '0 0 45px color-mix(in srgb, var(--color-primary) 55%, transparent)',
                        }}
                    >
                        <SparklesIcon className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '2.8s' }} />
                    </div>
                    <span
                        className="absolute right-4 top-5 h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                    <span
                        className="absolute left-5 bottom-8 h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-light) 82%, white)' }}
                    />
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>
                    Generating your template...
                </h2>
                <p className="max-w-md text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    The AI is analyzing your goal and crafting the perfect template.
                    This usually takes 5-15 seconds.
                </p>

                <div className="mt-10 w-full max-w-xs">
                    <div
                        className="h-1.5 w-full rounded-full overflow-hidden"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 65%, transparent)' }}
                    >
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                width: `${Math.max(progress, 3)}%`,
                                background:
                                    'linear-gradient(90deg, color-mix(in srgb, var(--color-primary-dark) 92%, transparent), var(--color-primary-light))',
                                boxShadow: '0 0 16px color-mix(in srgb, var(--color-primary) 44%, transparent)',
                            }}
                        />
                    </div>
                    <div className="mt-2 flex items-center justify-between px-0.5 text-[11px] uppercase tracking-[0.16em]">
                        <span style={{ color: 'var(--color-text-tertiary)' }}>Processing Nodes</span>
                        <span style={{ color: 'var(--color-primary)' }}>{Math.round(progress)}%</span>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <span
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.14em]"
                        style={{
                            color: 'var(--color-text-secondary)',
                            backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 72%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 28%, transparent)',
                        }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                        Semantic Mapping
                    </span>
                    <span
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.14em]"
                        style={{
                            color: 'var(--color-text-tertiary)',
                            backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 54%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)',
                        }}
                    >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-text-tertiary)' }} />
                        Structuring Flow
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-[28px]"
            style={{
                backgroundColor: 'rgba(8, 10, 14, 0.58)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
            }}
        >
            <div
                className="w-full max-w-2xl overflow-hidden h-[100dvh] sm:h-auto rounded-none sm:rounded-[2rem]"
                style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 72%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.52)',
                }}
            >
                <div className="px-5 sm:px-6 md:px-8 pt-5 sm:pt-6 md:pt-7 pb-2 flex items-start justify-between sticky top-0 z-10"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 88%, transparent)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl flex items-center justify-center"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--color-primary) 22%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--color-primary) 24%, transparent)',
                            }}
                        >
                            <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                                Generate with AI
                            </h2>
                            <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Refine your tracking experience with neural assistance.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-tertiary)' }}
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(100dvh-150px)] sm:max-h-none">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        Describe what you want to track. The AI will search existing templates or create
                        a custom one tailored to your goal.
                    </p>

                    {error && (
                        <div
                            className="p-3 rounded-xl text-sm"
                            style={{
                                color: 'var(--color-error)',
                                backgroundColor: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--color-error) 26%, transparent)',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div className="relative group">
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    e.preventDefault();
                                    handleGenerate();
                                }
                            }}
                            placeholder="e.g. A daily tracker for my hydration levels, 10-step skincare routine, and morning meditation focus..."
                            rows={5}
                            maxLength={500}
                            className="w-full rounded-2xl p-4 sm:p-5 text-base resize-none focus:outline-none"
                            style={{
                                color: 'var(--color-text-primary)',
                                backgroundColor: 'color-mix(in srgb, var(--color-background) 65%, black)',
                                border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
                                boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-border) 10%, transparent)',
                            }}
                        />
                        <div
                            className="absolute bottom-3.5 right-4 text-[10px] sm:text-[11px]"
                            style={{ color: 'color-mix(in srgb, var(--color-text-tertiary) 74%, transparent)' }}
                        >
                            Press Ctrl/Cmd + Enter to generate
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                            Suggestions
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
                                    className="px-3 py-1.5 text-xs rounded-full transition-colors"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 72%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)',
                                    }}
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className="px-5 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center justify-end gap-3 sticky bottom-0 z-10"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-surface) 90%, transparent)',
                        borderTop: '1px solid color-mix(in srgb, var(--color-border) 16%, transparent)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl font-medium hidden sm:inline-flex"
                        style={{ color: 'var(--color-text-secondary)' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!goal.trim()}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background:
                                'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))',
                            boxShadow: '0 10px 24px color-mix(in srgb, var(--color-primary-dark) 36%, transparent)',
                        }}
                    >
                        Generate Template
                    </button>
                </div>
            </div>
        </div>
    );
}
