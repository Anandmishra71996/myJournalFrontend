'use client';

import { useState, useEffect } from 'react';

export default function ServiceWorkerDebug() {
  const [swState, setSwState] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      setError('Service Workers not supported');
      return;
    }

    const checkServiceWorker = async () => {
      try {
        // Get registration
        const registration = await navigator.serviceWorker.getRegistration('/');
        
        const state = {
          hasRegistration: !!registration,
          active: registration?.active?.state,
          waiting: registration?.waiting?.state,
          installing: registration?.installing?.state,
          scope: registration?.scope,
          updateViaCache: registration?.updateViaCache,
          activeScriptURL: registration?.active?.scriptURL,
          controllerState: navigator.serviceWorker.controller?.state,
          controllerScriptURL: navigator.serviceWorker.controller?.scriptURL,
          readyState: 'pending',
        };

        // Test if ready promise resolves
        const readyTimeout = setTimeout(() => {
          setSwState((prev: any) => ({ ...prev, readyState: 'timeout (never became ready)' }));
        }, 5000);

        navigator.serviceWorker.ready.then(() => {
          clearTimeout(readyTimeout);
          setSwState((prev: any) => ({ ...prev, readyState: 'ready' }));
        }).catch((err) => {
          clearTimeout(readyTimeout);
          setSwState((prev: any) => ({ ...prev, readyState: `error: ${err.message}` }));
        });

        setSwState(state);
      } catch (err: any) {
        setError(err.message);
      }
    };

    checkServiceWorker();

    // Listen for state changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Controller changed!');
      checkServiceWorker();
    });
  }, []);

  const forceUpdate = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration('/');
      if (registration) {
        console.log('Forcing service worker update...');
        await registration.update();
        // Force activate waiting worker
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const unregisterAll = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      alert('All service workers unregistered. Please refresh the page.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-lg max-w-md z-50">
        <h3 className="font-bold text-red-800 dark:text-red-200">SW Error</h3>
        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!swState) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50">
        <p className="text-sm">Checking service worker...</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-lg max-w-md z-50 text-xs">
      <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Service Worker Debug</h3>
      <div className="space-y-1 text-blue-700 dark:text-blue-300">
        <p><strong>Registration:</strong> {swState.hasRegistration ? '✅' : '❌'}</p>
        <p><strong>Active:</strong> {swState.active || 'none'}</p>
        <p><strong>Waiting:</strong> {swState.waiting || 'none'}</p>
        <p><strong>Installing:</strong> {swState.installing || 'none'}</p>
        <p><strong>Ready State:</strong> {swState.readyState}</p>
        <p><strong>Controller:</strong> {swState.controllerState || 'none'}</p>
        <p className="break-all"><strong>Script:</strong> {swState.activeScriptURL?.split('/').pop() || 'none'}</p>
      </div>
      <div className="mt-3 space-x-2">
        <button
          onClick={forceUpdate}
          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          Force Update
        </button>
        <button
          onClick={unregisterAll}
          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
        >
          Unregister
        </button>
      </div>
    </div>
  );
}
