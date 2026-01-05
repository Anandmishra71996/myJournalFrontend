'use client';

import { useState, useEffect } from 'react';

export default function DebugServiceWorker() {
  const [info, setInfo] = useState<any>({});
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const checkServiceWorker = async () => {
    addLog('Checking service worker status...');

    if (!('serviceWorker' in navigator)) {
      addLog('❌ Service Worker not supported');
      return;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    addLog(`Found ${registrations.length} registration(s)`);

    const reg = await navigator.serviceWorker.getRegistration('/');
    if (!reg) {
      addLog('❌ No service worker registered for scope /');
      return;
    }

    const swInfo = {
      scope: reg.scope,
      updateViaCache: reg.updateViaCache,
      active: reg.active
        ? {
            state: reg.active.state,
            scriptURL: reg.active.scriptURL,
          }
        : null,
      installing: reg.installing ? { state: reg.installing.state } : null,
      waiting: reg.waiting ? { state: reg.waiting.state } : null,
      pushManager: !!reg.pushManager,
    };

    setInfo(swInfo);
    addLog('✓ Service worker info retrieved');

    // Check if push manager works
    if (reg.pushManager) {
      try {
        const subscription = await reg.pushManager.getSubscription();
        addLog(subscription ? '✓ Push subscription found' : 'ℹ No push subscription');
      } catch (error: any) {
        addLog(`❌ Push manager error: ${error.message}`);
      }
    }
  };

  const forceUpdate = async () => {
    addLog('Forcing service worker update...');
    const reg = await navigator.serviceWorker.getRegistration('/');
    if (reg) {
      try {
        await reg.update();
        addLog('✓ Update triggered');
        setTimeout(checkServiceWorker, 1000);
      } catch (error: any) {
        addLog(`❌ Update failed: ${error.message}`);
      }
    }
  };

  const unregisterAll = async () => {
    addLog('Unregistering all service workers...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
      addLog(`✓ Unregistered: ${reg.scope}`);
    }
    addLog('✓ All service workers unregistered. Refresh page to re-register.');
  };

  const skipWaiting = async () => {
    addLog('Sending skip waiting message...');
    const reg = await navigator.serviceWorker.getRegistration('/');
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      addLog('✓ Message sent. Waiting for activation...');
    } else {
      addLog('ℹ No waiting service worker');
    }
  };

  useEffect(() => {
    checkServiceWorker();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Service Worker Debugger</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={checkServiceWorker}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Check Status
        </button>
        <button
          onClick={forceUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Force Update
        </button>
        <button
          onClick={skipWaiting}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Skip Waiting
        </button>
        <button
          onClick={unregisterAll}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Unregister All
        </button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Service Worker Info</h2>
        <pre className="text-sm overflow-auto">{JSON.stringify(info, null, 2)}</pre>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Logs</h2>
        <div className="space-y-1 max-h-96 overflow-auto">
          {logs.map((log, i) => (
            <div key={i} className="text-sm font-mono">
              {log}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
        <h3 className="font-semibold mb-2">How to Fix Service Worker Issues:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Click "Check Status" to see current state</li>
          <li>If "waiting" service worker exists, click "Skip Waiting"</li>
          <li>If issues persist, click "Unregister All" then refresh page</li>
          <li>Check Chrome DevTools → Application → Service Workers</li>
          <li>Enable "Update on reload" checkbox in DevTools</li>
        </ol>
      </div>
    </div>
  );
}
