/**
 * Tests for authStore (Zustand state)
 */

import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '@/store/authStore'
import { TestDataBuilder, mockApiResponse, mockApiError } from '../utils/testHelpers'

jest.mock('@/lib/api', () => ({
    default: {
        post: jest.fn(),
        get: jest.fn(),
    },
}))

import api from '@/lib/api'

describe('AuthStore', () => {
    const mockApi = api as jest.Mocked<typeof api>

    beforeEach(() => {
        // Clear the store to initial state
        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
        })
        jest.clearAllMocks()
    })

    describe('initial state', () => {
        it('should have initial state', () => {
            const { result } = renderHook(() => useAuthStore())

            expect(result.current.user).toBeNull()
            expect(result.current.isAuthenticated).toBe(false)
        })
    })

    describe('login', () => {
        it('should login user successfully', async () => {
            const mockUser = TestDataBuilder.createUser()

            mockApi.post.mockResolvedValue(
                mockApiResponse({ user: mockUser })
            )

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.login('test@example.com', 'password123')
            })

            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.user).toEqual(mockUser)
        })

        it('should handle login error', async () => {
            mockApi.post.mockRejectedValue(mockApiError('Invalid credentials', 401))

            const { result } = renderHook(() => useAuthStore())

            await expect(
                act(async () => {
                    await result.current.login('test@example.com', 'wrongpassword')
                })
            ).rejects.toThrow()

            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.user).toBeNull()
        })

        it('should make correct API call', async () => {
            mockApi.post.mockResolvedValue(
                mockApiResponse({ user: TestDataBuilder.createUser() })
            )

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.login('test@example.com', 'password123')
            })

            expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123',
            })
        })
    })

    describe('register', () => {
        it('should register user successfully', async () => {
            const mockUser = TestDataBuilder.createUser()

            mockApi.post.mockResolvedValue(
                mockApiResponse({ user: mockUser })
            )

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.register(
                    'newuser@example.com',
                    'password123',
                    'New User'
                )
            })

            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.user).toEqual(mockUser)
        })

        it('should handle registration error', async () => {
            mockApi.post.mockRejectedValue(
                mockApiError('Email already exists', 409)
            )

            const { result } = renderHook(() => useAuthStore())

            await expect(
                act(async () => {
                    await result.current.register(
                        'existing@example.com',
                        'password123',
                        'User'
                    )
                })
            ).rejects.toThrow()

            expect(result.current.isAuthenticated).toBe(false)
        })

        it('should make correct API call', async () => {
            mockApi.post.mockResolvedValue(
                mockApiResponse({ user: TestDataBuilder.createUser() })
            )

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.register(
                    'test@example.com',
                    'password123',
                    'Test User'
                )
            })

            expect(mockApi.post).toHaveBeenCalledWith('/auth/register', {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            })
        })
    })

    describe('logout', () => {
        it('should logout user', async () => {
            const mockUser = TestDataBuilder.createUser()

            // Set initial state
            useAuthStore.setState({
                user: mockUser,
                isAuthenticated: true,
            })

            mockApi.post.mockResolvedValue(mockApiResponse({ success: true }))

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.logout()
            })

            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.user).toBeNull()
        })

        it('should clear state even on API error', async () => {
            const mockUser = TestDataBuilder.createUser()

            useAuthStore.setState({
                user: mockUser,
                isAuthenticated: true,
            })

            mockApi.post.mockRejectedValue(mockApiError('Logout failed', 500))

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.logout()
            })

            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.user).toBeNull()
        })
    })

    describe('setUser', () => {
        it('should set user manually', () => {
            const mockUser = TestDataBuilder.createUser()

            const { result } = renderHook(() => useAuthStore())

            act(() => {
                result.current.setUser(mockUser)
            })

            expect(result.current.user).toEqual(mockUser)
            expect(result.current.isAuthenticated).toBe(true)
        })
    })

    describe('refreshProfile', () => {
        it('should refresh user profile', async () => {
            const updatedUser = TestDataBuilder.createUser({
                name: 'Updated Name',
            })

            mockApi.get.mockResolvedValue(mockApiResponse(updatedUser))

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.refreshProfile()
            })

            expect(result.current.user).toEqual(updatedUser)
            expect(result.current.isAuthenticated).toBe(true)
        })

        it('should handle refresh error', async () => {
            mockApi.get.mockRejectedValue(mockApiError('Unauthorized', 401))

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                try {
                    await result.current.refreshProfile()
                } catch {
                    // Error expected
                }
            })

            // State should remain unchanged on error
            expect(result.current.user).toBeNull()
        })

        it('should make correct API call', async () => {
            mockApi.get.mockResolvedValue(
                mockApiResponse(TestDataBuilder.createUser())
            )

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.refreshProfile()
            })

            expect(mockApi.get).toHaveBeenCalledWith('/users/profile')
        })
    })

    describe('checkAuth', () => {
        it('should check authentication status', async () => {
            const mockUser = TestDataBuilder.createUser()

            mockApi.get.mockResolvedValue(mockApiResponse(mockUser))

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                await result.current.checkAuth()
            })

            expect(result.current.isAuthenticated).toBe(true)
            expect(result.current.user).toEqual(mockUser)
        })

        it('should handle unauthenticated state', async () => {
            mockApi.get.mockRejectedValue(mockApiError('Unauthorized', 401))

            const { result } = renderHook(() => useAuthStore())

            await act(async () => {
                try {
                    await result.current.checkAuth()
                } catch {
                    // Error expected
                }
            })

            expect(result.current.isAuthenticated).toBe(false)
            expect(result.current.user).toBeNull()
        })
    })
})
