'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    // Register service worker if browser supports it
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });
          console.log('Service Worker registered successfully:', registration);
          console.log('Service Worker scope:', registration.scope);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('New Service Worker installing...');
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New Service Worker installed and ready to use');
                }
              });
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });
    } else {
      console.warn('Service Workers are not supported in this browser');
    }
  }, []);

  return null;
}
