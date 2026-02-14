import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isProfileCompleted?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    googleAuth: (googleId: string, email: string, name: string, avatar?: string) => Promise<void>;
    facebookAuth: (facebookId: string, email: string, name: string, avatar?: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                try {
                    const response = await api.post('/users/login', { email, password });
                    const { user, token } = response.data.data;

                    set({ user, token, isAuthenticated: true });
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } catch (error: any) {
                    // Re-throw the error with a user-friendly message
                    const errorMessage = error.response?.data?.error || error.message || 'Login failed';
                    throw new Error(errorMessage);
                }
            },

            register: async (email: string, password: string, name: string) => {
                try {
                    const response = await api.post('/users/register', {
                        email,
                        password,
                        name,
                    });
                    const { user, token } = response.data.data;

                    set({ user, token, isAuthenticated: true });
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } catch (error: any) {
                    // Re-throw the error with a user-friendly message
                    const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
                    throw new Error(errorMessage);
                }
            },

            googleAuth: async (googleId: string, email: string, name: string, avatar?: string) => {
                try {
                    const response = await api.post('/users/auth/google', {
                        googleId,
                        email,
                        name,
                        avatar,
                    });
                    const { user, token } = response.data.data;

                    set({ user, token, isAuthenticated: true });
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } catch (error: any) {
                    const errorMessage = error.response?.data?.error || error.message || 'Google authentication failed';
                    throw new Error(errorMessage);
                }
            },

            facebookAuth: async (facebookId: string, email: string, name: string, avatar?: string) => {
                try {
                    const response = await api.post('/users/auth/facebook', {
                        facebookId,
                        email,
                        name,
                        avatar,
                    });
                    const { user, token } = response.data.data;

                    set({ user, token, isAuthenticated: true });
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } catch (error: any) {
                    const errorMessage = error.response?.data?.error || error.message || 'Facebook authentication failed';
                    throw new Error(errorMessage);
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                delete api.defaults.headers.common['Authorization'];
            },

            setUser: (user: User) => {
                set({ user });
            },

            refreshProfile: async () => {
                try {
                    const response = await api.get('/users/profile');
                    const user = response.data.data;
                    set({ user });
                } catch (error) {
                    console.error('Failed to refresh profile:', error);
                }
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                if (state?.token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
                }
            },
        }
    )
);
