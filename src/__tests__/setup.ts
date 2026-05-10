// Jest setup file for frontend tests
import '@testing-library/jest-dom'

// Polyfill Web APIs not available in jsdom
import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream } from 'stream/web'

Object.assign(global, { TextEncoder, TextDecoder, ReadableStream })

// Mock next/navigation to avoid errors in tests
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    usePathname() {
        return '/'
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    useParams() {
        return {}
    },
}))

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
                return require('react').createElement('img', props)
  },
}))

// Suppress console errors in tests (optional)
const originalError = console.error
beforeAll(() => {
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render')
        ) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})

// Global test timeout
jest.setTimeout(10000)
