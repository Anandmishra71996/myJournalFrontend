'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';

export default function PushNotificationSettings() {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    error,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <BellSlashIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Push Notifications Not Supported
            </h3>
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
              Your browser doesn't support push notifications. Try using Chrome, Edge, or Firefox.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <BellIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Push Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Get notified about journal reminders, goal milestones, and weekly insights
              </p>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    isSubscribed
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : permission === 'denied'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {isSubscribed ? 'Enabled' : permission === 'denied' ? 'Blocked' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={isLoading || permission === 'denied'}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isSubscribed
                ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Processing...' : isSubscribed ? 'Disable' : 'Enable'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {permission === 'denied' && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}

        {isSubscribed && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={sendTestNotification}
              disabled={isLoading}
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium disabled:opacity-50"
            >
              Send Test Notification
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          What you'll receive:
        </h4>
        <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Daily journal reminders</li>
          <li>• Goal progress updates and milestones</li>
          <li>• Weekly insights and reflections</li>
          <li>• Motivational messages and tips</li>
        </ul>
      </div>
    </div>
  );
}
