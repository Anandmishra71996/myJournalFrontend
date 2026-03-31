/**
 * Tests for toast.service.ts - UI notification service
 */

import { toastService } from '@/services/toast.service'

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        loading: jest.fn(),
        promise: jest.fn(),
    },
}))

import { toast } from 'sonner'

describe('ToastService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('success', () => {
        it('should show success toast', () => {
            const message = 'Operation successful'

            toastService.success(message)

            expect(toast.success).toHaveBeenCalledWith(message)
        })

        it('should show success with description', () => {
            const message = 'Saved'
            const description = 'Your changes have been saved'

            toastService.success(message, description)

            expect(toast.success).toHaveBeenCalledWith(message, {
                description,
            })
        })
    })

    describe('error', () => {
        it('should show error toast', () => {
            const message = 'Error occurred'

            toastService.error(message)

            expect(toast.error).toHaveBeenCalledWith(message)
        })

        it('should show error with description', () => {
            const message = 'Failed to save'
            const description = 'Please try again'

            toastService.error(message, description)

            expect(toast.error).toHaveBeenCalledWith(message, {
                description,
            })
        })
    })

    describe('info', () => {
        it('should show info toast', () => {
            const message = 'FYI: Something happened'

            toastService.info(message)

            expect(toast.info).toHaveBeenCalledWith(message)
        })
    })

    describe('warning', () => {
        it('should show warning toast', () => {
            const message = 'Be careful'

            toastService.warning(message)

            expect(toast.warning).toHaveBeenCalledWith(message)
        })
    })

    describe('loading', () => {
        it('should show loading toast', () => {
            const message = 'Loading...'

            toastService.loading(message)

            expect(toast.loading).toHaveBeenCalledWith(message)
        })
    })
})
