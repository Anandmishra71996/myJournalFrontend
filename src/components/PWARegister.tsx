'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    // Register service worker if browser supports it
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          // Check if there's an existing registration
          const existingReg = await navigator.serviceWorker.getRegistration('/');
          if (existingReg) {
            await existingReg.update();
          }

          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
          });

          // Check for waiting service worker and activate it immediately
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        } catch (error) {
          // Silent fail
        }
      });
    }
  }, []);

  return null;
}
