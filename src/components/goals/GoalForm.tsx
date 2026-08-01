'use client';

import { useState, useEffect } from 'react';
import {
    GoalFormData,
    GoalMilestone,
    GOAL_TYPES_OPTIONS,
    GOAL_CATEGORIES_OPTIONS,
    TRACKING_METHODS_OPTIONS,
    JOURNAL_SIGNALS_OPTIONS,
} from '@/constants/goal.constants';

const MAX_MILESTONES = 5;

const emptyMilestone = (): GoalMilestone => ({
    title: '',
    description: '',
    targetDate: '',
    status: 'pending',
});

const toDateInputValue = (value?: string) =>
    value ? value.slice(0, 10) : '';

interface GoalFormProps {
    initialData?: Partial<GoalFormData>;
    onSubmit: (data: GoalFormData) => Promise<void>;
    submitLabel?: string;
    preselectedType?: string;
}

export default function GoalForm({
    initialData,
    onSubmit,
    submitLabel = 'Create Goal',
    preselectedType,
}: GoalFormProps) {
    const [formData, setFormData] = useState<GoalFormData>({
        title: initialData?.title || '',
        type: (preselectedType as any) || initialData?.type || 'weekly',
        category: initialData?.category || 'Personal',
        why: initialData?.why || '',
        trackingMethods: initialData?.trackingMethods || [],
        journalSignals: initialData?.journalSignals || [],
        successDefinition: initialData?.successDefinition || '',
        isRepetitive: initialData?.isRepetitive !== undefined ? initialData.isRepetitive : true,
        startDate: toDateInputValue(initialData?.startDate),
        endDate: toDateInputValue(initialData?.endDate),
        milestones: (initialData?.milestones || []).map((m) => ({
            ...m,
            targetDate: toDateInputValue(m.targetDate),
        })),
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (preselectedType) {
            setFormData((prev) => ({ ...prev, type: preselectedType as any }));
        }
    }, [preselectedType]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 80) {
            newErrors.title = 'Title must be 80 characters or less';
        }

        if (formData.why && formData.why.length > 200) {
            newErrors.why = 'Why must be 200 characters or less';
        }

        if (formData.trackingMethods.length > 3) {
            newErrors.trackingMethods =
                'You can select a maximum of 3 tracking methods';
        }

        if (formData.journalSignals.length > 3) {
            newErrors.journalSignals =
                'You can select a maximum of 3 journal signals';
        }

        if (!formData.isRepetitive) {
            if (!formData.startDate) {
                newErrors.startDate = 'Start date is required for non-repetitive goals';
            }
            if (!formData.endDate) {
                newErrors.endDate = 'End date is required for non-repetitive goals';
            }
            if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        const milestones = formData.milestones || [];
        if (milestones.length > MAX_MILESTONES) {
            newErrors.milestones = `You can have a maximum of ${MAX_MILESTONES} milestones`;
        }
        milestones.forEach((milestone, index) => {
            if (!milestone.title.trim()) {
                newErrors[`milestone-${index}-title`] = 'Milestone title is required';
            } else if (milestone.title.length > 120) {
                newErrors[`milestone-${index}-title`] = 'Title must be 120 characters or less';
            }
            if (milestone.description && milestone.description.length > 300) {
                newErrors[`milestone-${index}-description`] = 'Description must be 300 characters or less';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            title: true,
            type: true,
            category: true,
            why: true,
            trackingMethods: true,
            journalSignals: true,
            successDefinition: true,
        });

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            const payload: GoalFormData = {
                ...formData,
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined,
                milestones: (formData.milestones || []).map((milestone) => ({
                    ...milestone,
                    targetDate: milestone.targetDate || undefined,
                })),
            };
            await onSubmit(payload);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
        validate();
    };

    const toggleArrayItem = (
        field: 'trackingMethods' | 'journalSignals',
        value: string
    ) => {
        const currentArray:any = formData[field];
        const newArray = currentArray.includes(value)
            ? currentArray.filter((item:any) => item !== value)
            : [...currentArray, value];

        setFormData({ ...formData, [field]: newArray });
    };

    const addMilestone = () => {
        if ((formData.milestones || []).length >= MAX_MILESTONES) return;
        setFormData({
            ...formData,
            milestones: [...(formData.milestones || []), emptyMilestone()],
        });
    };

    const updateMilestone = (
        index: number,
        updates: Partial<GoalMilestone>
    ) => {
        const milestones = [...(formData.milestones || [])];
        milestones[index] = { ...milestones[index], ...updates };
        setFormData({ ...formData, milestones });
    };

    const removeMilestone = (index: number) => {
        const milestones = (formData.milestones || []).filter(
            (_, i) => i !== index
        );
        setFormData({ ...formData, milestones });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    onBlur={() => handleBlur('title')}
                    placeholder="e.g., Exercise 3 times per week"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="flex justify-between mt-1">
                    {touched.title && errors.title && (
                        <p className="text-sm text-red-600">{errors.title}</p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                        {formData.title.length}/80
                    </p>
                </div>
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Type *
                </label>
                <select
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as any })
                    }
                    disabled={!!preselectedType}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    {GOAL_TYPES_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                    The timeframe for achieving this goal
                </p>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                </label>
                <select
                    value={formData.category}
                    onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as any })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    {GOAL_CATEGORIES_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Why */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why is this important to you?
                </label>
                <textarea
                    value={formData.why}
                    onChange={(e) =>
                        setFormData({ ...formData, why: e.target.value })
                    }
                    onBlur={() => handleBlur('why')}
                    rows={3}
                    placeholder="Understanding your motivation helps you stay committed..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between mt-1">
                    {touched.why && errors.why && (
                        <p className="text-sm text-red-600">{errors.why}</p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                        {formData.why?.length || 0}/200
                    </p>
                </div>
            </div>

            {/* Tracking Methods */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    How will you track this? (Max 3)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {TRACKING_METHODS_OPTIONS.map((option) => {
                        const isSelected = formData.trackingMethods.includes(
                            option.value
                        );
                        const isDisabled =
                            !isSelected && formData.trackingMethods.length >= 3;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    toggleArrayItem('trackingMethods', option.value)
                                }
                                disabled={isDisabled}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } ${
                                    isDisabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
                {touched.trackingMethods && errors.trackingMethods && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.trackingMethods}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                    {formData.trackingMethods.length}/3 selected
                </p>
            </div>

            {/* Journal Signals */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What signs in your journal will show progress? (Max 3)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {JOURNAL_SIGNALS_OPTIONS.map((option) => {
                        const isSelected = formData.journalSignals.includes(
                            option.value
                        );
                        const isDisabled =
                            !isSelected && formData.journalSignals.length >= 3;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    toggleArrayItem('journalSignals', option.value)
                                }
                                disabled={isDisabled}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } ${
                                    isDisabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
                {touched.journalSignals && errors.journalSignals && (
                    <p className="text-sm text-red-600 mt-1">
                        {errors.journalSignals}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                    {formData.journalSignals.length}/3 selected
                </p>
            </div>

            {/* Success Definition */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What does success look like?
                </label>
                <textarea
                    value={formData.successDefinition}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            successDefinition: e.target.value,
                        })
                    }
                    rows={3}
                    placeholder="Describe what achieving this goal will mean to you..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Help yourself visualize the outcome
                </p>
            </div>

            {/* Repetitive Checkbox */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.isRepetitive}
                        onChange={(e) =>
                            setFormData({ ...formData, isRepetitive: e.target.checked })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                        This is a repetitive goal
                    </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                    Uncheck if this goal has specific start and end dates
                </p>
            </div>

            {/* Date Boundary Fields */}
            {!formData.isRepetitive && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                        </label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) =>
                                setFormData({ ...formData, startDate: e.target.value })
                            }
                            onBlur={() => handleBlur('startDate')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {touched.startDate && errors.startDate && (
                            <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date *
                        </label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) =>
                                setFormData({ ...formData, endDate: e.target.value })
                            }
                            onBlur={() => handleBlur('endDate')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {touched.endDate && errors.endDate && (
                            <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Milestones */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Milestones
                    </label>
                    <span className="text-xs text-gray-500">
                        {(formData.milestones || []).length}/{MAX_MILESTONES}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                    Break your goal down into smaller checkpoints
                </p>

                <div className="space-y-3">
                    {(formData.milestones || []).map((milestone, index) => (
                        <div
                            key={milestone._id || index}
                            className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3"
                        >
                            <div className="flex items-start gap-2">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={milestone.title}
                                        onChange={(e) =>
                                            updateMilestone(index, { title: e.target.value })
                                        }
                                        placeholder="Milestone title"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                    {errors[`milestone-${index}-title`] && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors[`milestone-${index}-title`]}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeMilestone(index)}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    aria-label="Remove milestone"
                                >
                                    Remove
                                </button>
                            </div>

                            <div>
                                <textarea
                                    value={milestone.description || ''}
                                    onChange={(e) =>
                                        updateMilestone(index, { description: e.target.value })
                                    }
                                    rows={2}
                                    placeholder="Description (optional)"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                                />
                                {errors[`milestone-${index}-description`] && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors[`milestone-${index}-description`]}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Target Date
                                    </label>
                                    <input
                                        type="date"
                                        value={milestone.targetDate || ''}
                                        onChange={(e) =>
                                            updateMilestone(index, { targetDate: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={milestone.status}
                                        onChange={(e) =>
                                            updateMilestone(index, {
                                                status: e.target.value as 'pending' | 'completed',
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {errors.milestones && (
                    <p className="text-sm text-red-600 mt-2">{errors.milestones}</p>
                )}

                <button
                    type="button"
                    onClick={addMilestone}
                    disabled={(formData.milestones || []).length >= MAX_MILESTONES}
                    className="mt-3 w-full px-4 py-2 rounded-lg text-sm font-medium border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    + Add Milestone
                </button>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading || Object.keys(errors).length > 0}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    );
}
