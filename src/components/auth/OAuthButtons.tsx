'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google?: any;
    FB?: any;
  }
}

interface GoogleButtonProps {
  onSuccess: (googleId: string, email: string, name: string, avatar?: string) => void;
  onError: (error: string) => void;
  text?: 'signin' | 'signup';
}

export function GoogleButton({ onSuccess, onError, text = 'signin' }: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.error('Google Client ID not configured');
      setIsLoading(false);
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: text === 'signin' ? 'signin_with' : 'signup_with',
            shape: 'rectangular',
          }
        );
        setIsLoading(false);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId]);

  const handleCredentialResponse = (response: any) => {
    try {
      // Decode JWT token to get user info
      const userObject = JSON.parse(atob(response.credential.split('.')[1]));
      
      onSuccess(
        userObject.sub,
        userObject.email,
        userObject.name,
        userObject.picture
      );
    } catch (error) {
      onError('Failed to authenticate with Google');
    }
  };

  if (!clientId) {
    return null;
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full h-[40px] bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      ) : (
        <div id="google-signin-button" className="w-full"></div>
      )}
    </div>
  );
}

interface FacebookButtonProps {
  onSuccess: (facebookId: string, email: string, name: string, avatar?: string) => void;
  onError: (error: string) => void;
  text?: string;
}

export function FacebookButton({ onSuccess, onError, text }: FacebookButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  useEffect(() => {
    if (!appId) {
      console.error('Facebook App ID not configured');
      setIsLoading(false);
      return;
    }

    // Load Facebook SDK
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.FB) {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v18.0',
        });
        setIsLoading(false);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [appId]);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      onError('Facebook SDK not loaded');
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          // Get user info
          window.FB.api('/me', { fields: 'id,name,email,picture' }, (userInfo: any) => {
            if (userInfo.email) {
              onSuccess(
                userInfo.id,
                userInfo.email,
                userInfo.name,
                userInfo.picture?.data?.url
              );
            } else {
              onError('Email permission is required');
            }
          });
        } else {
          onError('Facebook login cancelled');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  if (!appId) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>{text || 'Continue with Facebook'}</span>
        </>
      )}
    </button>
  );
}
