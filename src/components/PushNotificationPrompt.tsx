'use client';

import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PushNotificationPromptProps {
  onClose?: () => void;
}

export default function PushNotificationPrompt({ onClose }: PushNotificationPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isSupported, isSubscribed, permission, subscribe, isLoading } = usePushNotifications();

  useEffect(() => {
    // Show prompt only if:
    // - Notifications are supported
    // - User is not already subscribed
    // - Permission is not denied
    if (isSupported && !isSubscribed && permission !== 'denied') {
      setIsVisible(true);
    }
  }, [isSupported, isSubscribed, permission]);

  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // Store in localStorage to not show again for a while
    localStorage.setItem('pushNotificationPromptDismissed', Date.now().toString());
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <BellIcon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Stay Connected
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enable notifications to receive daily journal reminders, goal updates, and personalized insights to help you stay on track with your journaling journey.
          </p>

          <div className="space-y-3 w-full mb-6">
            <div className="flex items-start text-left">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold">✓</span>
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Daily journaling reminders
              </p>
            </div>

            <div className="flex items-start text-left">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold">✓</span>
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Goal milestone celebrations
              </p>
            </div>

            <div className="flex items-start text-left">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold">✓</span>
              </div>
              <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Weekly insights and reflections
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleEnable}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enabling...' : 'Enable Notifications'}
            </button>

            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            You can always change this in settings
          </p>
        </div>
      </div>
    </div>
  );
}
