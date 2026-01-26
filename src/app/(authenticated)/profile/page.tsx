'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import ProfileForm from '@/components/profile/ProfileForm';
import PushNotificationSettings from '@/components/PushNotificationSettings';

export default function ProfilePage() {
    const { user, refreshProfile } = useAuthStore();

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <img src="/logo.svg" alt="Journal Logo" className="w-10 h-10" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {user?.isProfileCompleted ? 'Edit Profile' : 'Complete Your Profile'}
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                        {user?.isProfileCompleted
                            ? 'Update your preferences to personalize your AI insights'
                            : 'Help us personalize your journaling experience with AI-powered insights'}
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Completion Alert */}
                {user?.isProfileCompleted === false && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-yellow-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Please complete your profile to unlock AI-powered insights and start journaling.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Form Card */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personal Information</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Fields marked with <span className="text-red-500">*</span> are required
                        </p>
                    </div>

                    <ProfileForm />
                </section>

                {/* Push Notification Settings */}
                <section className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage your push notification preferences
                        </p>
                    </div>

                    <PushNotificationSettings />
                </section>

                {/* Info Section */}
                <section className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3">
                        Why do we need this information?
                    </h3>
                    <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>
                                <strong>Personalized Insights:</strong> AI will tailor feedback based on your goals and constraints
                            </span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>
                                <strong>Relevant Prompts:</strong> Get journal prompts aligned with your focus areas
                            </span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>
                                <strong>Contextual Analysis:</strong> Insights will reflect your life phase and situation
                            </span>
                        </li>
                        <li className="flex items-start">
                            <svg
                                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>
                                <strong>Privacy First:</strong> Your data is encrypted and only used to enhance your experience
                            </span>
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
