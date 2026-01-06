'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface PushNotificationState {
    isSupported: boolean;
    isSubscribed: boolean;
    isLoading: boolean;
    permission: NotificationPermission;
    error: string | null;
}

export function usePushNotifications() {
    const [state, setState] = useState<PushNotificationState>({
        isSupported: false,
        isSubscribed: false,
        isLoading: false,
        permission: 'default',
        error: null,
    });

    const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null);

    // Check browser support and permission status
    useEffect(() => {
        const checkSupport = async () => {
            if (typeof window === 'undefined') return;

            const isSupported =
                'serviceWorker' in navigator &&
                'PushManager' in window &&
                'Notification' in window;

            console.log('Push notification support check:', {
                serviceWorker: 'serviceWorker' in navigator,
                pushManager: 'PushManager' in window,
                notification: 'Notification' in window,
                isSupported,
            });

            setState((prev) => ({
                ...prev,
                isSupported,
                permission: isSupported ? Notification.permission : 'denied',
            }));

            if (isSupported) {
                // Fetch VAPID public key with retry
                try {
                    console.log('Fetching VAPID public key...');
                    const response = await api.get('/push/public-key');
                    const publicKey = response.data.data.publicKey;
                    console.log('VAPID public key received:', publicKey ? `${publicKey.substring(0, 20)}...` : 'null');
                    setVapidPublicKey(publicKey);
                } catch (error) {
                    console.error('Failed to fetch VAPID public key:', error);
                    // Retry after 2 seconds
                    setTimeout(async () => {
                        try {
                            const response = await api.get('/push/public-key');
                            setVapidPublicKey(response.data.data.publicKey);
                            console.log('VAPID public key fetched on retry');
                        } catch (retryError) {
                            console.error('Failed to fetch VAPID public key on retry:', retryError);
                        }
                    }, 2000);
                }

                // Check if already subscribed
                checkSubscription();
            }
        };

        checkSupport();
    }, []);

    // Check if user is already subscribed
    const checkSubscription = useCallback(async () => {
        try {
            // First check if service worker is even registered
            const registration = await navigator.serviceWorker.getRegistration('/');

            if (!registration) {
                console.warn('No service worker registration found');
                setState((prev) => ({
                    ...prev,
                    isSubscribed: false,
                }));
                return;
            }

            console.log('Service worker registration found:', {
                active: registration.active?.state,
                waiting: registration.waiting?.state,
                installing: registration.installing?.state,
            });

            // If SW is waiting, try to activate it
            if (registration.waiting) {
                console.log('Service worker is waiting, attempting to activate...');
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }

            // Check subscription only if SW is active
            if (registration.active) {
                const subscription = await registration.pushManager.getSubscription();
                setState((prev) => ({
                    ...prev,
                    isSubscribed: !!subscription,
                }));
            } else {
                console.warn('Service worker is not active yet');
                setState((prev) => ({
                    ...prev,
                    isSubscribed: false,
                }));
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    }, []);

    // Convert VAPID key from base64 to Uint8Array
    const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    };

    // Subscribe to push notifications
    const subscribe = useCallback(async () => {
        if (!state.isSupported) {
            setState((prev) => ({
                ...prev,
                error: 'Push notifications are not supported in this browser',
            }));
            return false;
        }

        if (!vapidPublicKey) {
            setState((prev) => ({
                ...prev,
                error: 'VAPID public key not available',
            }));
            return false;
        }

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            // Wait for service worker to be ready with timeout
            console.log('Waiting for service worker...');

            // Create a timeout promise
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Service worker registration timeout. The service worker is not becoming active.'));
                }, 10000); // 10 second timeout
            });

            // Race between service worker ready and timeout
            const registration = await Promise.race([
                navigator.serviceWorker.ready,
                timeoutPromise
            ]);

            console.log('Service worker ready:', {
                active: registration.active?.state,
                installing: registration.installing?.state,
                waiting: registration.waiting?.state,
                scope: registration.scope,
            });

            // Verify service worker is actually active
            if (!registration.active) {
                throw new Error('Service worker is not active. Please refresh the page and try again.');
            }

            // Verify push manager is available
            if (!registration.pushManager) {
                throw new Error('Push manager not available in service worker');
            }

            // Request notification permission
            console.log('Requesting notification permission...');
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);

            if (permission !== 'granted') {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    permission,
                    error: 'Notification permission denied',
                }));
                return false;
            }

            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();
            console.log('Existing subscription:', subscription);

            if (subscription) {
                console.log('Already subscribed, unsubscribing first...');
                await subscription.unsubscribe();
                subscription = null;
            }

            // Convert VAPID key to Uint8Array
            const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
            console.log('VAPID key converted, length:', applicationServerKey.length);

            // Subscribe to push notifications with explicit options
            console.log('Subscribing to push manager...');
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey as BufferSource,
            });
            console.log('Subscription created:', subscription);

            // Send subscription to backend
            const subscriptionData = subscription.toJSON();
            console.log('Sending subscription to backend:', {
                endpoint: subscriptionData.endpoint,
                hasKeys: !!subscriptionData.keys,
            });

            await api.post('/push/subscribe', {
                endpoint: subscriptionData.endpoint,
                keys: subscriptionData.keys,
            });

            console.log('Subscription saved to backend successfully');

            setState((prev) => ({
                ...prev,
                isSubscribed: true,
                isLoading: false,
                permission: 'granted',
            }));

            return true;
        } catch (error: any) {
            console.error('Error subscribing to push notifications:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            let errorMessage = 'Failed to subscribe to push notifications';

            if (error.name === 'NotAllowedError') {
                errorMessage = 'Notification permission was denied';
            } else if (error.name === 'NotSupportedError') {
                errorMessage = 'Push notifications are not supported';
            } else if (error.name === 'AbortError') {
                errorMessage = 'Subscription was aborted. Please try again.';
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }

            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));

            return false;
        }
    }, [state.isSupported, vapidPublicKey]);

    // Unsubscribe from push notifications
    const unsubscribe = useCallback(async () => {
        if (!state.isSupported) return false;

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                const subscriptionData = subscription.toJSON();

                // Unsubscribe from push manager
                await subscription.unsubscribe();

                // Notify backend
                await api.post('/push/unsubscribe', {
                    endpoint: subscriptionData.endpoint,
                });
            }

            setState((prev) => ({
                ...prev,
                isSubscribed: false,
                isLoading: false,
            }));

            return true;
        } catch (error) {
            console.error('Error unsubscribing from push notifications:', error);
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Failed to unsubscribe from push notifications',
            }));
            return false;
        }
    }, [state.isSupported]);

    // Send a test notification
    const sendTestNotification = useCallback(async () => {
        try {
            await api.post('/push/send-test', {
                title: 'Test Notification',
                body: 'This is a test notification from your Journaling App!',
                url: '/journal',
            });
            return true;
        } catch (error) {
            console.error('Error sending test notification:', error);
            setState((prev) => ({
                ...prev,
                error: 'Failed to send test notification',
            }));
            return false;
        }
    }, []);

    return {
        ...state,
        subscribe,
        unsubscribe,
        sendTestNotification,
        checkSubscription,
    };
}
