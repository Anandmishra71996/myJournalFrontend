'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import GoalGeneratorChat from '@/components/goals/GoalGeneratorChat';
import api from '@/lib/api';
import {
    Goal,
    GoalFormData,
    GOAL_CATEGORIES_OPTIONS,
    GOAL_TYPES_OPTIONS,
} from '@/constants/goal.constants';
import { Sparkles, ArrowLeft, Bell, Settings, Search, Link2 } from 'lucide-react';

export default function CreateGoalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedType = searchParams.get('type');
    const mode = searchParams.get('mode');
    const [showAIChat, setShowAIChat] = useState(false);
    const [prefilledData, setPrefilledData] = useState<Partial<GoalFormData> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [linkedGoalQuery, setLinkedGoalQuery] = useState('');
    const [existingGoals, setExistingGoals] = useState<Goal[]>([]);
    const [selectedExistingGoalId, setSelectedExistingGoalId] = useState<string>('');
    const [selectedParentGoal, setSelectedParentGoal] = useState('Master Digital Arts');
    const [formData, setFormData] = useState<GoalFormData>({
        title: '',
        type: (preselectedType as GoalFormData['type']) || 'weekly',
        category: 'Personal',
        why: '',
        trackingMethods: [],
        journalSignals: [],
        successDefinition: '',
        isRepetitive: false,
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        // Load AI draft if coming from AI generator
        if (mode === 'ai-edit') {
            const draftStr = localStorage.getItem('aiGoalDraft');
            if (draftStr) {
                try {
                    const draft = JSON.parse(draftStr);
                    setPrefilledData(draft);
                    setFormData((prev) => ({
                        ...prev,
                        ...draft,
                        trackingMethods: draft.trackingMethods || prev.trackingMethods,
                        journalSignals: draft.journalSignals || prev.journalSignals,
                        type: draft.type || prev.type,
                        category: draft.category || prev.category,
                    }));
                    if (draft.existingGoalId) {
                        setSelectedExistingGoalId(draft.existingGoalId);
                    }
                } catch (error) {
                    console.error('Failed to parse AI draft:', error);
                }
            }
        }
    }, [mode]);

    useEffect(() => {
        if (preselectedType) {
            setFormData((prev) => ({ ...prev, type: preselectedType as GoalFormData['type'] }));
        }
    }, [preselectedType]);

    useEffect(() => {
        const loadGoals = async () => {
            try {
                const response = await api.get('/goals');
                if (response.data?.success && Array.isArray(response.data.data)) {
                    const goals = response.data.data as Goal[];
                    const nonArchivedGoals = goals.filter((goal) => goal.status !== 'archived');
                    setExistingGoals(nonArchivedGoals);

                    if (selectedExistingGoalId) {
                        const selectedGoal = nonArchivedGoals.find((goal) => goal._id === selectedExistingGoalId);
                        if (selectedGoal) {
                            setSelectedParentGoal(selectedGoal.title);
                        }
                        return;
                    }

                    const defaultGoal = nonArchivedGoals.find((g) => g.title === selectedParentGoal) || nonArchivedGoals[0];
                    if (defaultGoal) {
                        setSelectedExistingGoalId(defaultGoal._id);
                        setSelectedParentGoal(defaultGoal.title);
                        setLinkedGoalQuery(defaultGoal.title);
                    }
                }
            } catch (loadError) {
                console.error('Failed to load existing goals for linking:', loadError);
            }
        };

        loadGoals();
    }, [selectedExistingGoalId]);

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

    const submitCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError('Goal title is required');
            return;
        }

        setLoading(true);
        try {
            const payload: GoalFormData = {
                ...formData,
                existingGoalId: selectedExistingGoalId || undefined,
                startDate: formData.isRepetitive
                    ? formData.startDate || ''
                    : formData.startDate || new Date().toISOString().slice(0, 10),
            };
            await handleSubmit(payload);
        } finally {
            setLoading(false);
        }
    };

    const saveAsDraft = () => {
        localStorage.setItem(
            'aiGoalDraft',
            JSON.stringify({
                ...formData,
                existingGoalId: selectedExistingGoalId || undefined,
            })
        );
        alert('Draft saved locally. You can continue editing later.');
    };

    const filteredExistingGoals = existingGoals
        .filter((goal) => {
            if (!linkedGoalQuery.trim()) return true;
            return goal.title.toLowerCase().includes(linkedGoalQuery.toLowerCase());
        })
        .slice(0, 6);

    return (
        <div className="min-h-screen bg-[var(--color-surface)] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-bright)]"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="font-headline text-2xl font-bold tracking-tight text-[var(--color-primary)]">
                                Create New Goal
                            </h1>
                            {mode === 'ai-edit' && prefilledData && (
                                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                    AI draft loaded. Refine details, then create your goal.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]">
                            <Bell className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]">
                            <Settings className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setShowAIChat(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-goal-cta-text)] shadow-[0_10px_24px_color-mix(in_srgb,var(--color-primary-dark)_34%,transparent)] transition-all hover:opacity-90"
                        >
                            <Sparkles className="h-4 w-4" />
                            AI Assistant
                        </button>
                    </div>
                </header>

                <form onSubmit={submitCreateGoal} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <section className="space-y-8 lg:col-span-8">
                        <div className="rounded-xl bg-[var(--color-surface-container-low)] p-6 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] sm:p-8">
                            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">Core Identity</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold text-[var(--color-text-secondary)]">GOAL TITLE</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="e.g., Master Digital Arts"
                                        className="w-full rounded-lg border-none bg-[var(--color-surface-container-lowest)] px-4 py-3.5 text-base font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:ring-2 focus:ring-[var(--color-primary)]/40"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-[var(--color-text-secondary)]">CATEGORY</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as GoalFormData['category'] }))}
                                            className="w-full rounded-lg border-none bg-[var(--color-surface-container-lowest)] px-4 py-3.5 text-sm text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/40"
                                        >
                                            {GOAL_CATEGORIES_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-[var(--color-text-secondary)]">PRIORITY</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(['low', 'medium', 'high'] as const).map((value) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() => setPriority(value)}
                                                    className={`rounded-lg px-3 py-3 text-xs font-bold uppercase tracking-wide transition-all ${
                                                        priority === value
                                                            ? 'border border-[var(--color-primary)]/40 bg-[color:color-mix(in_srgb,var(--color-primary-dark)_18%,transparent)] text-[var(--color-primary)]'
                                                            : 'bg-[var(--color-surface-container-lowest)] text-[var(--color-text-tertiary)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_18%,transparent)] hover:text-[var(--color-text-secondary)]'
                                                    }`}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-[var(--color-surface-container-low)] p-6 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] sm:p-8">
                            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">Schedule & Frequency</h3>
                            <div className="space-y-6">
                                <div className="inline-flex rounded-xl bg-[var(--color-surface-container-lowest)] p-1">
                                    <button
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, isRepetitive: false }))}
                                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                                            !formData.isRepetitive
                                                ? 'bg-[var(--color-surface-container-high)] text-[var(--color-primary)]'
                                                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                                        }`}
                                    >
                                        One-off Goal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, isRepetitive: true }))}
                                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                                            formData.isRepetitive
                                                ? 'bg-[var(--color-surface-container-high)] text-[var(--color-primary)]'
                                                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                                        }`}
                                    >
                                        Recurring
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-[var(--color-text-secondary)]">
                                            {formData.isRepetitive ? 'START DATE (OPTIONAL)' : 'DEADLINE / TARGET DATE'}
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.isRepetitive ? (formData.startDate || '') : (formData.endDate || '')}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    startDate: formData.isRepetitive ? e.target.value : prev.startDate,
                                                    endDate: !formData.isRepetitive ? e.target.value : prev.endDate,
                                                }))
                                            }
                                            className="w-full rounded-lg border-none bg-[var(--color-surface-container-lowest)] px-4 py-3.5 text-sm text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/40"
                                        />
                                        <p className="mt-1 text-[10px] italic text-[var(--color-text-tertiary)]">
                                            Optional: Leave blank for open-ended goals.
                                        </p>
                                    </div>
                                    <div className={`rounded-xl bg-[color:color-mix(in_srgb,var(--color-surface-container-high)_60%,transparent)] p-5 ${
                                        !formData.isRepetitive ? 'opacity-40' : ''
                                    }`}>
                                        <p className="text-xs font-bold text-[var(--color-text-secondary)]">Goal Type</p>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as GoalFormData['type'] }))}
                                            className="mt-3 w-full rounded-lg border-none bg-[var(--color-surface-container-lowest)] px-3 py-2.5 text-xs text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/40"
                                        >
                                            {GOAL_TYPES_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-[var(--color-surface-container-low)] p-6 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] sm:p-8">
                            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">Success Metrics</h3>
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-[var(--color-text-secondary)]">DEFINITION OF DONE</label>
                                <textarea
                                    rows={4}
                                    value={formData.successDefinition || ''}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, successDefinition: e.target.value }))}
                                    placeholder="Describe exactly what success looks like for this goal..."
                                    className="w-full resize-none rounded-lg border-none bg-[var(--color-surface-container-lowest)] px-4 py-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:ring-2 focus:ring-[var(--color-primary)]/40"
                                />
                            </div>
                        </div>
                    </section>

                    <aside className="flex flex-col gap-6 lg:col-span-4">
                        <div className="rounded-xl bg-[var(--color-surface-container-high)] p-6 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">Relational Context</h3>
                            <label className="mb-2 block text-xs font-semibold text-[var(--color-text-secondary)]">LINK TO EXISTING GOAL</label>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                                <input
                                    type="text"
                                    value={linkedGoalQuery}
                                    onChange={(e) => setLinkedGoalQuery(e.target.value)}
                                    placeholder="Search goals..."
                                    className="w-full rounded-lg border-none bg-[var(--color-surface-container-lowest)] py-3 pl-10 pr-4 text-sm text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/40"
                                />
                            </div>

                            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">Suggested Parent Goals</p>
                            <div className="mt-2 space-y-2">
                                {filteredExistingGoals.length === 0 && (
                                    <p className="rounded-lg bg-[var(--color-surface-container-lowest)] px-3 py-2 text-xs text-[var(--color-text-tertiary)]">
                                        No matching goals found.
                                    </p>
                                )}
                                {filteredExistingGoals.map((goal) => (
                                    <button
                                        key={goal._id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedParentGoal(goal.title);
                                            setLinkedGoalQuery(goal.title);
                                            setSelectedExistingGoalId(goal._id);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-xs font-medium transition-colors ${
                                            selectedExistingGoalId === goal._id
                                                ? 'bg-[color:color-mix(in_srgb,var(--color-primary-dark)_16%,transparent)] text-[var(--color-primary)]'
                                                : 'bg-[var(--color-surface-container-lowest)] text-[var(--color-text-secondary)] hover:bg-[color:color-mix(in_srgb,var(--color-primary-dark)_12%,transparent)] hover:text-[var(--color-primary)]'
                                        }`}
                                    >
                                        <Link2 className="h-3.5 w-3.5 text-[var(--color-secondary)]" />
                                        {goal.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-xl border border-[var(--color-secondary)]/20 bg-[color:color-mix(in_srgb,var(--color-secondary-container)_12%,transparent)] p-6">
                            <div className="mb-3 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-[var(--color-secondary)]" />
                                <h3 className="text-sm font-bold text-[var(--color-secondary)]">AI Archive Insight</h3>
                            </div>
                            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                                {selectedExistingGoalId
                                    ? <>Linking this to <span className="font-semibold text-[var(--color-secondary)]">{selectedParentGoal}</span> helps AI infer progress patterns from future journal entries.</>
                                    : <>Choose an existing goal to link hierarchy and progress context.</>}
                            </p>
                        </div>

                        <div className="mt-auto space-y-3 pt-2">
                            {error && (
                                <p className="rounded-lg bg-[color:color-mix(in_srgb,var(--color-error)_18%,transparent)] px-3 py-2 text-xs text-[var(--color-error)]">
                                    {error}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] py-4 text-sm font-extrabold uppercase tracking-wide text-[var(--color-goal-cta-text)] shadow-[0_10px_30px_color-mix(in_srgb,var(--color-primary-dark)_32%,transparent)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Goal'}
                            </button>
                            <button
                                type="button"
                                onClick={saveAsDraft}
                                className="w-full rounded-xl bg-[var(--color-surface-container-low)] py-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_18%,transparent)] transition-colors hover:bg-[var(--color-surface-bright)]"
                            >
                                Save As Draft
                            </button>
                        </div>
                    </aside>
                </form>
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
