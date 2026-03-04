'use client';

import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * AuthProvider - Checks authentication status on app mount
 * 
 * This component verifies the httpOnly cookie by calling the /users/profile endpoint
 * on initial app load. This ensures users stay logged in across page refreshes.
 * 
 * Security: Uses httpOnly cookies (not localStorage) to prevent XSS attacks
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  // Guard against React StrictMode double-invoking the effect in development,
  // which would fire two /users/profile calls on every page load.
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const initAuth = async () => {
      try {
        await useAuthStore.getState().checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
