import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from Zustand persist storage
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            try {
                const { state } = JSON.parse(authStorage);
                const token = state?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing auth storage:', error);
            }
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
                    // Skip 401 handling for login and signup endpoints
                    // Let the form handle these errors directly
                    if (requestUrl.includes('/login') || requestUrl.includes('/register')) {
                        break;
                    }

                    // For other 401 errors (expired token, etc.), clear auth and redirect
                    localStorage.removeItem('auth-storage');
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
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
