'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import {
    WHY_USING_APP_OPTIONS,
    FOCUS_AREAS_OPTIONS,
    LIFE_PHASE_OPTIONS,
    BIGGEST_CONSTRAINT_OPTIONS,
    INSIGHT_STYLE_OPTIONS,
    INSIGHT_FREQUENCY_OPTIONS,
    type ProfileFormData,
} from '@/constants/profile.constants';

export default function ProfileForm() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        current_role: '',
        whyUsingApp: 'Improve consistency',
        focusAreas: [],
        lifePhase: undefined,
        biggestConstraint: undefined,
        insightStyle: 'gentle',
        insightFrequency: 'weekly',
        aiEnabled: true,
    });

    // Pre-populate form with existing profile data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                current_role: (user as any).current_role || '',
                whyUsingApp: (user as any).whyUsingApp || 'Improve consistency',
                focusAreas: (user as any).focusAreas || [],
                lifePhase: (user as any).lifePhase,
                biggestConstraint: (user as any).biggestConstraint,
                insightStyle: (user as any).insightStyle || 'gentle',
                insightFrequency: (user as any).insightFrequency || 'weekly',
                aiEnabled: (user as any).aiEnabled !== undefined ? (user as any).aiEnabled : true,
            });
        }
    }, [user]);

    const handleInputChange = (field: keyof ProfileFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFocusAreaToggle = (area: string) => {
        setFormData((prev) => {
            const currentAreas = prev.focusAreas;
            if (currentAreas.includes(area as any)) {
                // Remove if already selected
                return {
                    ...prev,
                    focusAreas: currentAreas.filter((a) => a !== area) as any,
                };
            } else if (currentAreas.length < 3) {
                // Add if less than 3
                return {
                    ...prev,
                    focusAreas: [...currentAreas, area] as any,
                };
            }
            // Don't add if already at max
            return prev;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (formData.focusAreas.length === 0) {
            toast.error('Please select at least one focus area');
            return;
        }

        if (formData.focusAreas.length > 3) {
            toast.error('You can select a maximum of 3 focus areas');
            return;
        }

        setLoading(true);
        try {
            const response = await api.put('/users/profile', {
                ...formData,
                isProfileCompleted: true,
            });

            if (response.data.success) {
                setUser(response.data.data);
                toast.success('Profile saved successfully!');
                router.push('/journal');
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                'Failed to save profile';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.name.trim() && formData.focusAreas.length > 0 && formData.focusAreas.length <= 3;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Your full name"
                    required
                />
            </div>

            {/* Current Role */}
            <div>
                <label htmlFor="current_role" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Role (Optional)
                </label>
                <input
                    id="current_role"
                    type="text"
                    value={formData.current_role}
                    onChange={(e) => handleInputChange('current_role', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g., Software Engineer, Student, Founder"
                />
            </div>

            {/* Why Using App */}
            <div>
                <label htmlFor="whyUsingApp" className="block text-sm font-semibold text-gray-700 mb-2">
                    Why are you using this app? <span className="text-red-500">*</span>
                </label>
                <select
                    id="whyUsingApp"
                    value={formData.whyUsingApp}
                    onChange={(e) => handleInputChange('whyUsingApp', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                >
                    {WHY_USING_APP_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Focus Areas (Multi-select) */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What are your main focus areas? <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(Select 1-3)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FOCUS_AREAS_OPTIONS.map((option) => {
                        const isSelected = formData.focusAreas.includes(option.value as any);
                        const isDisabled = !isSelected && formData.focusAreas.length >= 3;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleFocusAreaToggle(option.value)}
                                disabled={isDisabled}
                                className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                                    isSelected
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : isDisabled
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {formData.focusAreas.length}/3 selected
                </p>
            </div>

            {/* Life Phase */}
            <div>
                <label htmlFor="lifePhase" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Life Phase (Optional)
                </label>
                <select
                    id="lifePhase"
                    value={formData.lifePhase || ''}
                    onChange={(e) => handleInputChange('lifePhase', e.target.value || undefined)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                    <option value="">Select a life phase</option>
                    {LIFE_PHASE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Biggest Constraint */}
            <div>
                <label htmlFor="biggestConstraint" className="block text-sm font-semibold text-gray-700 mb-2">
                    What's your biggest constraint? (Optional)
                </label>
                <select
                    id="biggestConstraint"
                    value={formData.biggestConstraint || ''}
                    onChange={(e) => handleInputChange('biggestConstraint', e.target.value || undefined)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                    <option value="">Select a constraint</option>
                    {BIGGEST_CONSTRAINT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Insight Style */}
            <div>
                <label htmlFor="insightStyle" className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Insight Style <span className="text-red-500">*</span>
                </label>
                <select
                    id="insightStyle"
                    value={formData.insightStyle}
                    onChange={(e) => handleInputChange('insightStyle', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                >
                    {INSIGHT_STYLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Insight Frequency */}
            <div>
                <label htmlFor="insightFrequency" className="block text-sm font-semibold text-gray-700 mb-2">
                    How often would you like insights? <span className="text-red-500">*</span>
                </label>
                <select
                    id="insightFrequency"
                    value={formData.insightFrequency}
                    onChange={(e) => handleInputChange('insightFrequency', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                >
                    {INSIGHT_FREQUENCY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* AI Enabled Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                    <p className="font-semibold text-gray-900">Enable AI Insights</p>
                    <p className="text-sm text-gray-600">
                        Get personalized insights based on your journal entries
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => handleInputChange('aiEnabled', !formData.aiEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.aiEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.aiEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? 'Saving...' : user?.isProfileCompleted ? 'Update Profile' : 'Complete Profile'}
                </button>
            </div>
        </form>
    );
}
