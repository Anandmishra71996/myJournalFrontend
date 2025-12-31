'use client';

import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export default function InstallButton() {
    const { isInstallable, handleInstallClick } = useInstallPrompt();

    // Don't render anything if not installable
    if (!isInstallable) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            Add to Desktop
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                            Install this app for faster access
                        </p>
                        <button
                            onClick={handleInstallClick}
                            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                        >
                            Install App
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            // Just hide the button by returning null from parent
                            // In a real app, you might want to use a state to manage this
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
