/**
 * Test utilities and helpers for frontend tests
 */

import { ReactNode } from 'react'
import { RenderOptions, render } from '@testing-library/react'

/**
 * Mock API responses
 */
export const mockApiResponse = <T,>(data: T, status = 200) => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
})

/**
 * Mock API error
 */
export const mockApiError = (message: string, status = 500) => ({
    response: {
        data: { error: message },
        status,
    },
    message,
})

/**
 * Mock router
 */
export const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
}

/**
 * Mock router as hook
 */
export const useRouterMock = jest.fn(() => mockRouter)

/**
 * Create mock localStorage
 */
export const createMockLocalStorage = () => {
    let store: Record<string, string> = {}

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString()
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
}

/**
 * Set up localStorage mock
 */
export const setupLocalStorageMock = () => {
    const localStorageMock = createMockLocalStorage()
    Object.defineProperty(Object.getPrototypeOf(localStorage), 'getItem', {
        value: localStorageMock.getItem,
    })
    Object.defineProperty(Object.getPrototypeOf(localStorage), 'setItem', {
        value: localStorageMock.setItem,
    })
    Object.defineProperty(Object.getPrototypeOf(localStorage), 'removeItem', {
        value: localStorageMock.removeItem,
    })
    Object.defineProperty(Object.getPrototypeOf(localStorage), 'clear', {
        value: localStorageMock.clear,
    })
    return localStorageMock
}

/**
 * Render with providers (context, themes, etc.)
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    // Add custom provider options here if needed
}

export const renderWithProviders = (
    ui: ReactNode,
    options?: CustomRenderOptions
) => {
    // Add providers like Theme, Router context, Redux, etc. here
    // For now, just return standard render
    return render(ui, { ...options })
}

/**
 * Wait for and find element helpers
 */
export const waitForElement = async (
    fn: () => HTMLElement | null,
    timeout = 3000
) => {
    const start = Date.now()
    while (Date.now() - start < timeout) {
        const element = fn()
        if (element) return element
        await new Promise((resolve) => setTimeout(resolve, 50))
    }
    throw new Error('Element not found within timeout')
}

/**
 * Type test data builders - using actual types from app
 */
export class TestDataBuilder {
    static createGoal(overrides = {}) {
        return {
            _id: `goal-${Math.random()}`,
            userId: 'user-123',
            title: 'Learn TypeScript',
            description: 'Master TypeScript for better development',
            type: 'learning' as const,
            category: 'education',
            why: 'Want to improve code quality',
            successDefinition: 'Complete advanced course',
            status: 'active' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...overrides,
        }
    }

    static createJournal(overrides = {}) {
        return {
            _id: `journal-${Math.random()}`,
            userId: 'user-123',
            content: 'Today was a productive day',
            mood: 'happy',
            tags: ['productivity', 'learning'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...overrides,
        }
    }

    static createTemplate(overrides = {}) {
        return {
            _id: `template-${Math.random()}`,
            userId: 'user-123',
            name: 'Daily Reflection',
            description: 'Track daily progress and reflections',
            icon: '📝',
            fields: [
                {
                    id: 'today-wins',
                    label: 'Today\'s Wins',
                    type: 'textarea',
                    order: 1,
                    required: true,
                },
                {
                    id: 'mood',
                    label: 'Mood',
                    type: 'select',
                    options: ['happy', 'neutral', 'sad'],
                    order: 2,
                    required: true,
                },
            ],
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...overrides,
        }
    }

    static createUser(overrides = {}) {
        return {
            _id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            picture: 'https://example.com/avatar.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...overrides,
        }
    }
}

/**
 * Common assertions
 */
export class TestAssertions {
    static expectSuccessResponse(response: any) {
        expect(response).toHaveProperty('success', true)
        expect(response).toHaveProperty('data')
    }

    static expectErrorResponse(response: any) {
        expect(response).toHaveProperty('success', false)
        expect(response).toHaveProperty('error')
    }

    static expectValidObjectId(id: string) {
        expect(id).toMatch(/^[0-9a-f]{24}$|^[a-z0-9-]+$/)
    }
}
