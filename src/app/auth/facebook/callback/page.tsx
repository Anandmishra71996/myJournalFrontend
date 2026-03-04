'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { extractCallbackParams, validateState } from '@/utils/pkce';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function FacebookCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode or re-renders
    if (hasProcessed.current) {
      return;
    }

    const handleCallback = async () => {
      // Mark as processing to prevent duplicate calls
      hasProcessed.current = true;
      
      try {
        // Retrieve stored state parameter FIRST (gets cleared on first retrieval)
        const storedState = typeof window !== 'undefined' 
          ? sessionStorage.getItem('oauth_state')
          : null;

        // If state is null, it means this is a re-render and we already processed
        // Exit silently without error
        if (!storedState) {
          console.log('OAuth callback already processed, skipping duplicate execution');
          return;
        }

        // Clean up stored state immediately after retrieval
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('oauth_state');
        }

        // Extract callback parameters from URL
        const { code, state: receivedState, error, error_description } = extractCallbackParams();

        // Check for OAuth errors
        if (error) {
          throw new Error(error_description || error);
        }

        // Validate authorization code
        if (!code) {
          throw new Error('No authorization code received');
        }

        // Validate state parameter (CSRF protection)
        if (!validateState(receivedState, storedState)) {
          throw new Error('Invalid state parameter. Possible CSRF attack detected.');
        }

        // Exchange authorization code for tokens
        const response = await api.post('/auth/facebook/callback', {
          code,
          state: receivedState,
        });

        if (!response.data.success) {
          throw new Error(response.data.error || 'Authentication failed');
        }

        const { user } = response.data.data;

        // Update auth store
        setUser(user);

        setStatus('success');
        toast.success('Successfully signed in with Facebook!');

        // Redirect based on profile completion status
        setTimeout(() => {
          if (user.isProfileCompleted === false) {
            router.push('/profile');
          } else {
            router.push('/journal');
          }
        }, 1000);

      } catch (error: any) {
        console.error('Facebook OAuth callback error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');
        toast.error(error.message || 'Failed to sign in with Facebook');

        // Redirect to login after showing error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, []); // Empty dependency array - only run once

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Completing Sign In...</h2>
            <p className="text-gray-600">
              Please wait while we verify your Facebook account.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
            <p className="text-gray-600">
              You've been successfully signed in with Facebook.
            </p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Authentication Failed</h2>
            <p className="text-gray-600">{errorMessage}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        )}
      </div>
    </div>
  );
}
