import axios from 'axios';

const CLIENT_AUTH_COOKIE = 'aigoalreflect_session_client';

const getCookieValue = (name: string): string | null => {
    if (typeof document === 'undefined') {
        return null;
    }

    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]+)`));
    if (!match) {
        return null;
    }

    try {
        return decodeURIComponent(match[1]);
    } catch {
        return match[1];
    }
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies with requests (for httpOnly cookies)
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // TODO: Temporary fallback for production issue. Remove Authorization header path
        // once cookie-only auth is stable end-to-end.
        const token = getCookieValue(CLIENT_AUTH_COOKIE);
        if (token) {
            config.headers?.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const requestUrl = error.config?.url || '';

            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    // Skip 401 handling for auth endpoints — let the form handle these directly
                    if (requestUrl.includes('/login') || requestUrl.includes('/register')) {
                        break;
                    }

                    // Don't redirect if the browser is already on a public page.
                    // This prevents an infinite reload loop: AuthProvider calls
                    // /users/profile on every mount (including on /login), which
                    // returns 401 for unauthenticated users, which would otherwise
                    // trigger window.location.href = '/login' → full reload → repeat.
                    if (typeof window !== 'undefined') {
                        const publicPaths = ['/login', '/signup', '/forgot-password', '/preview', '/auth/'];
                        const onPublicPage = publicPaths.some((p) =>
                            window.location.pathname.startsWith(p)
                        );

                        const onOAuthCallbackPage =
                            window.location.pathname === '/auth/google/callback' ||
                            window.location.pathname === '/auth/facebook/callback';

                        if (!onPublicPage && !onOAuthCallbackPage) {
                            window.location.href = '/login';
                        }
                    }
                    break;
                case 403:
                    console.error('Forbidden');
                    break;
                case 404:
                    console.error('Not found');
                    break;
                case 500:
                    console.error('Server error');
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
