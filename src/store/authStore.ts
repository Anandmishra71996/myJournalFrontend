import { create } from 'zustand';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    betaAccess?: boolean;
    isProfileCompleted?: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User) => void;
    refreshProfile: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user } = response.data.data;

            // Token is now set in httpOnly cookie by backend
            set({ user, isAuthenticated: true });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Login failed';
            throw new Error(errorMessage);
        }
    },

    register: async (email: string, password: string, name: string) => {
        try {
            const response = await api.post('/auth/register', {
                email,
                password,
                name,
            });
            const { user } = response.data.data;

            // Token is now set in httpOnly cookie by backend
            set({ user, isAuthenticated: true });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
            throw new Error(errorMessage);
        }
    },

    logout: async () => {
        try {
            // Call backend logout endpoint to clear httpOnly cookie
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Always clear local state, even if API call fails
            set({ user: null, isAuthenticated: false });
        }
    },

    setUser: (user: User) => {
        set({ user, isAuthenticated: true });
    },

    refreshProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            const user = response.data.data;
            set({ user, isAuthenticated: true });
        } catch (error) {
            console.error('Failed to refresh profile:', error);
            // If profile refresh fails (e.g., 401), clear auth state
            set({ user: null, isAuthenticated: false });
        }
    },

    /**
     * Check authentication status by fetching user profile
     * Useful for initial page load to verify httpOnly cookie
     */
    checkAuth: async () => {
        try {
            const response = await api.get('/users/profile');
            const user = response.data.data;
            set({ user, isAuthenticated: true });
        } catch (error) {
            // 401 = not authenticated (expected on public pages) — clear state silently.
            // The axios interceptor in api.ts is responsible for redirecting to /login
            // on protected pages; it intentionally skips the redirect on public routes.
            set({ user: null, isAuthenticated: false });
        }
    },
}));
