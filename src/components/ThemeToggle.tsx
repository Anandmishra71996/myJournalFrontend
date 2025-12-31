'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 rounded-xl transition-colors group"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <span className="flex items-center">
                {theme === 'light' ? (
                    <MoonIcon className="w-5 h-5 mr-3 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                ) : (
                    <SunIcon className="w-5 h-5 mr-3 text-gray-600 group-hover:text-yellow-500 transition-colors" />
                )}
                <span>
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
            </span>
            
            {/* Visual toggle indicator */}
            <div className="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors">
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                        theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        {theme === 'light' ? (
                            <SunIcon className="w-3 h-3 text-yellow-500" />
                        ) : (
                            <MoonIcon className="w-3 h-3 text-indigo-500" />
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}
