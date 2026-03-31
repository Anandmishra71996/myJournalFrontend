/**
 * Tests for aiTemplate.service.ts
 */

import { aiTemplateService } from '@/services/aiTemplate.service'
import { mockApiResponse, mockApiError, TestDataBuilder } from '../utils/testHelpers'

jest.mock('@/lib/api', () => ({
    default: {
        post: jest.fn(),
    },
}))

import api from '@/lib/api'

describe('AiTemplateService', () => {
    const mockApi = api as jest.Mocked<typeof api>

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('generateTemplate', () => {
        it('should generate template from goal text', async () => {
            const goalText =
                'Learn TypeScript and improve code quality through daily practice'

            const mockTemplate = TestDataBuilder.createTemplate({
                name: 'TypeScript Learning Template',
            })

            const mockResponse = {
                type: 'generated' as const,
                template: mockTemplate,
                message: 'Template generated based on your goal',
            }

            mockApi.post.mockResolvedValue(
                mockApiResponse(mockResponse)
            )

            const result = await aiTemplateService.generateTemplate(goalText)

            expect(mockApi.post).toHaveBeenCalledWith('/ai/templates/generate', {
                goal: goalText,
            })
            expect(result.data).toEqual(mockResponse)
            expect(result.data.type).toBe('generated')
            expect(result.data.template).toBeDefined()
        })

        it('should return existing template when found', async () => {
            const goalText = 'Track daily fitness progress'

            const mockTemplate = TestDataBuilder.createTemplate({
                name: 'Fitness Tracker',
            })

            const mockResponse = {
                type: 'existing' as const,
                template: mockTemplate,
                message: 'Found matching template for your goal',
            }

            mockApi.post.mockResolvedValue(
                mockApiResponse(mockResponse)
            )

            const result = await aiTemplateService.generateTemplate(goalText)

            expect(result.data.type).toBe('existing')
            expect(result.data.template).toBeDefined()
        })

        it('should handle empty goal text', async () => {
            mockApi.post.mockRejectedValue(
                mockApiError('goal is required and must be a non-empty string', 400)
            )

            await expect(aiTemplateService.generateTemplate('')).rejects.toThrow()
        })

        it('should handle goal text exceeding length limit', async () => {
            const longGoal = 'x'.repeat(5001)

            mockApi.post.mockRejectedValue(
                mockApiError('goal must be 5000 characters or less', 400)
            )

            await expect(aiTemplateService.generateTemplate(longGoal)).rejects.toThrow()
        })

        it('should include message in response', async () => {
            const goalText = 'Improve productivity'

            const mockTemplate = TestDataBuilder.createTemplate()

            const mockResponse = {
                type: 'generated' as const,
                template: mockTemplate,
                message: 'Successfully generated a custom template',
            }

            mockApi.post.mockResolvedValue(
                mockApiResponse(mockResponse)
            )

            const result = await aiTemplateService.generateTemplate(goalText)

            expect(result.data.message).toBeDefined()
            expect(typeof result.data.message).toBe('string')
        })

        it('should handle API errors gracefully', async () => {
            const goalText = 'Some goal'

            mockApi.post.mockRejectedValue(
                mockApiError('Internal server error', 500)
            )

            await expect(aiTemplateService.generateTemplate(goalText)).rejects.toThrow()
        })

        it('should work with long combined goal narratives', async () => {
            const longGoal = `Goal 1: Learn TypeScript
This is about learning TypeScript to improve code quality.
Success: Complete advanced course
Tracking: Weekly quizzes

Goal 2: Fitness
Want to stay healthy and fit.
Success: Run 10k
Tracking: Daily steps`

            const mockTemplate = TestDataBuilder.createTemplate()

            const mockResponse = {
                type: 'generated' as const,
                template: mockTemplate,
                message: 'Combined goals template created',
            }

            mockApi.post.mockResolvedValue(
                mockApiResponse(mockResponse)
            )

            const result = await aiTemplateService.generateTemplate(longGoal)

            expect(mockApi.post).toHaveBeenCalledWith('/ai/templates/generate', {
                goal: longGoal,
            })
            expect(result.data.type).toBe('generated')
        })
    })
})
