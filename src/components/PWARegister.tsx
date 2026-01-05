'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    // Register service worker if browser supports it
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          // First, check if there's an existing registration
          const existingReg = await navigator.serviceWorker.getRegistration('/');
          if (existingReg) {
            console.log('Found existing service worker, checking for updates...');
            // Force update check to get latest worker with push support
            await existingReg.update();
          }

          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none', // Always fetch fresh service worker
          });
          
          console.log('Service Worker registered successfully:', registration);
          console.log('Service Worker scope:', registration.scope);
          console.log('Service Worker active:', registration.active?.state);
          console.log('Service Worker installing:', registration.installing?.state);
          console.log('Service Worker waiting:', registration.waiting?.state);

          // Check if push notification handlers are available
          if (registration.active) {
            console.log('Active service worker URL:', registration.active.scriptURL);
          }

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('New Service Worker installing...');
              newWorker.addEventListener('statechange', () => {
                console.log('Service Worker state changed to:', newWorker.state);
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('New Service Worker installed, old one still controlling');
                    console.log('Refresh page to activate new service worker');
                  } else {
                    console.log('Service Worker installed for the first time');
                  }
                }
                if (newWorker.state === 'activated') {
                  console.log('Service Worker activated successfully!');
                }
              });
            }
          });

          // Check for waiting service worker and activate it immediately
          if (registration.waiting) {
            console.log('Service worker waiting, sending skip waiting message...');
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });

      // Listen for controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed - new SW is now active');
      });

    } else {
      console.warn('Service Workers are not supported in this browser');
    }
  }, []);

  return null;
}
