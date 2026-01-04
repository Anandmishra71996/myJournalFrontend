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

            setState((prev) => ({
                ...prev,
                isSupported,
                permission: isSupported ? Notification.permission : 'denied',
            }));

            if (isSupported) {
                // Fetch VAPID public key
                try {
                    const response = await api.get('/push/public-key');
                    setVapidPublicKey(response.data.data.publicKey);
                } catch (error) {
                    console.error('Failed to fetch VAPID public key:', error);
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
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            setState((prev) => ({
                ...prev,
                isSubscribed: !!subscription,
            }));
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
            // Request notification permission
            const permission = await Notification.requestPermission();

            if (permission !== 'granted') {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    permission,
                    error: 'Notification permission denied',
                }));
                return false;
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                // Subscribe to push notifications
                const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey as BufferSource,
                });
            }

            // Send subscription to backend
            const subscriptionData = subscription.toJSON();
            await api.post('/push/subscribe', {
                endpoint: subscriptionData.endpoint,
                keys: subscriptionData.keys,
            });

            setState((prev) => ({
                ...prev,
                isSubscribed: true,
                isLoading: false,
                permission: 'granted',
            }));

            return true;
        } catch (error: any) {
            console.error('Error subscribing to push notifications:', error);

            let errorMessage = 'Failed to subscribe to push notifications';

            if (error.name === 'NotAllowedError') {
                errorMessage = 'Notification permission was denied';
            } else if (error.name === 'NotSupportedError') {
                errorMessage = 'Push notifications are not supported';
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
