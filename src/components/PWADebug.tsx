'use client';

import { useEffect, useState } from 'react';

export default function PWADebug() {
  const [swStatus, setSwStatus] = useState<string>('Checking...');
  const [manifestStatus, setManifestStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Check Service Worker
    fetch('/sw.js')
      .then((res) => {
        setSwStatus(`✓ Service Worker found (${res.status})`);
      })
      .catch((err) => {
        setSwStatus(`✗ Service Worker not found: ${err.message}`);
      });

    // Check Manifest
    fetch('/manifest.json')
      .then((res) => {
        setManifestStatus(`✓ Manifest found (${res.status})`);
      })
      .catch((err) => {
        setManifestStatus(`✗ Manifest not found: ${err.message}`);
      });

    // Check Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          console.log('Service Worker Registrations:', registrations);
          registrations.forEach((reg) => {
            console.log('- Scope:', reg.scope);
            console.log('- Active:', reg.active ? 'Yes' : 'No');
            console.log('- Installing:', reg.installing ? 'Yes' : 'No');
            console.log('- Waiting:', reg.waiting ? 'Yes' : 'No');
          });
        });
    }
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 bg-blue-50 border border-blue-200 rounded p-3 text-xs max-w-xs">
      <div className="font-bold mb-2">PWA Debug</div>
      <div>{swStatus}</div>
      <div>{manifestStatus}</div>
    </div>
  );
}
