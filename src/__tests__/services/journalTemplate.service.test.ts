/**
 * Tests for journalTemplate.service.ts
 */

import { journalTemplateService } from '@/services/journalTemplate.service'
import { mockApiResponse, mockApiError, TestDataBuilder } from '../utils/testHelpers'

// Mock axios
jest.mock('@/lib/api', () => ({
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}))

import api from '@/lib/api'

describe('JournalTemplateService', () => {
    const mockApi = api as jest.Mocked<typeof api>

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getTemplates', () => {
        it('should fetch all templates', async () => {
            const mockTemplates = [
                TestDataBuilder.createTemplate({ name: 'Template 1' }),
                TestDataBuilder.createTemplate({ name: 'Template 2' }),
            ]

            mockApi.get.mockResolvedValue(
                mockApiResponse({ templates: mockTemplates })
            )

            const result = await journalTemplateService.getTemplates()

            expect(mockApi.get).toHaveBeenCalledWith('/journal-templates')
            expect(result).toEqual(mockTemplates)
        })

        it('should handle pagination params', async () => {
            const mockTemplates = [TestDataBuilder.createTemplate()]

            mockApi.get.mockResolvedValue(
                mockApiResponse({ templates: mockTemplates })
            )

            await journalTemplateService.getTemplates(2, 10)

            expect(mockApi.get).toHaveBeenCalledWith('/journal-templates', {
                params: { page: 2, limit: 10 },
            })
        })

        it('should throw error on API failure', async () => {
            mockApi.get.mockRejectedValue(mockApiError('Failed to fetch'))

            await expect(journalTemplateService.getTemplates()).rejects.toThrow()
        })
    })

    describe('getTemplate', () => {
        it('should fetch single template by id', async () => {
            const mockTemplate = TestDataBuilder.createTemplate()

            mockApi.get.mockResolvedValue(mockApiResponse(mockTemplate))

            const result = await journalTemplateService.getTemplate(mockTemplate._id)

            expect(mockApi.get).toHaveBeenCalledWith(
                `/journal-templates/${mockTemplate._id}`
            )
            expect(result).toEqual(mockTemplate)
        })

        it('should handle template not found', async () => {
            mockApi.get.mockRejectedValue(
                mockApiError('Template not found', 404)
            )

            await expect(
                journalTemplateService.getTemplate('invalid-id')
            ).rejects.toThrow()
        })
    })

    describe('createTemplate', () => {
        it('should create new template', async () => {
            const templateData = {
                name: 'New Template',
                fields: [
                    { id: 'field1', label: 'Field 1', type: 'text' as const, order: 1 },
                ],
            }

            const mockTemplate = TestDataBuilder.createTemplate(templateData)

            mockApi.post.mockResolvedValue(mockApiResponse(mockTemplate))

            const result = await journalTemplateService.createTemplate(templateData)

            expect(mockApi.post).toHaveBeenCalledWith('/journal-templates', templateData)
            expect(result).toEqual(mockTemplate)
        })

        it('should validate required fields', async () => {
            const invalidData = { name: 'Template' } // missing fields

            mockApi.post.mockRejectedValue(
                mockApiError('Validation error', 400)
            )

            await expect(
                journalTemplateService.createTemplate(invalidData as any)
            ).rejects.toThrow()
        })
    })

    describe('updateTemplate', () => {
        it('should update existing template', async () => {
            const templateId = 'template-123'
            const updates = { name: 'Updated Template' }

            const mockTemplate = TestDataBuilder.createTemplate(updates)

            mockApi.put.mockResolvedValue(mockApiResponse(mockTemplate))

            const result = await journalTemplateService.updateTemplate(
                templateId,
                updates
            )

            expect(mockApi.put).toHaveBeenCalledWith(
                `/journal-templates/${templateId}`,
                updates
            )
            expect(result).toEqual(mockTemplate)
        })
    })

    describe('deleteTemplate', () => {
        it('should delete template', async () => {
            const templateId = 'template-123'

            mockApi.delete.mockResolvedValue(mockApiResponse({ success: true }))

            await journalTemplateService.deleteTemplate(templateId)

            expect(mockApi.delete).toHaveBeenCalledWith(
                `/journal-templates/${templateId}`
            )
        })
    })

    describe('cloneTemplate', () => {
        it('should clone existing template', async () => {
            const sourceId = 'source-template'
            const cloneName = 'Cloned Template'

            const mockClone = TestDataBuilder.createTemplate({
                name: cloneName,
            })

            mockApi.post.mockResolvedValue(mockApiResponse(mockClone))

            const result = await journalTemplateService.cloneTemplate(sourceId, {
                name: cloneName,
            })

            expect(mockApi.post).toHaveBeenCalledWith(
                `/journal-templates/${sourceId}/clone`,
                { name: cloneName }
            )
            expect(result).toEqual(mockClone)
        })
    })

    describe('setDefaultTemplate', () => {
        it('should set template as default', async () => {
            const templateId = 'template-123'

            mockApi.patch.mockResolvedValue(
                mockApiResponse({ success: true })
            )

            await journalTemplateService.setDefaultTemplate(templateId)

            expect(mockApi.patch).toHaveBeenCalledWith(
                `/journal-templates/${templateId}/set-default`
            )
        })
    })

    describe('getDefaultTemplate', () => {
        it('should fetch default template', async () => {
            const mockTemplate = TestDataBuilder.createTemplate({ isDefault: true })

            mockApi.get.mockResolvedValue(mockApiResponse(mockTemplate))

            const result = await journalTemplateService.getDefaultTemplate()

            expect(mockApi.get).toHaveBeenCalledWith(
                '/journal-templates/default'
            )
            expect(result).toEqual(mockTemplate)
        })
    })
})
