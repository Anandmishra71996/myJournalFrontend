/**
 * Tests for journal.service.ts
 */

import { journalService } from '@/services/journal.service'
import { mockApiResponse, mockApiError, TestDataBuilder } from '../utils/testHelpers'

jest.mock('@/lib/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}))

import api from '@/lib/api'

describe('JournalService', () => {
    const mockApi = api as jest.Mocked<typeof api>

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getJournals', () => {
        it('should fetch journals with pagination', async () => {
            const mockJournals = [
                TestDataBuilder.createJournal({ content: 'Day 1' }),
                TestDataBuilder.createJournal({ content: 'Day 2' }),
            ]

            mockApi.get.mockResolvedValue(
                mockApiResponse({ journals: mockJournals, total: 2 })
            )

            const result = await journalService.getJournals()

            expect(mockApi.get).toHaveBeenCalledWith('/journals', {
                params: expect.objectContaining({
                    page: expect.any(Number),
                    limit: expect.any(Number),
                }),
            })
            expect(result).toEqual(mockJournals)
        })

        it('should support filtering by date range', async () => {
            const mockJournals = [TestDataBuilder.createJournal()]
            const startDate = '2024-01-01'
            const endDate = '2024-01-31'

            mockApi.get.mockResolvedValue(
                mockApiResponse({ journals: mockJournals })
            )

            await journalService.getJournals(1, 20, startDate, endDate)

            expect(mockApi.get).toHaveBeenCalledWith('/journals', {
                params: expect.objectContaining({
                    startDate,
                    endDate,
                }),
            })
        })
    })

    describe('getJournal', () => {
        it('should fetch single journal by id', async () => {
            const mockJournal = TestDataBuilder.createJournal()

            mockApi.get.mockResolvedValue(mockApiResponse(mockJournal))

            const result = await journalService.getJournal(mockJournal._id)

            expect(mockApi.get).toHaveBeenCalledWith(`/journals/${mockJournal._id}`)
            expect(result).toEqual(mockJournal)
        })
    })

    describe('createJournal', () => {
        it('should create new journal entry', async () => {
            const journalData = {
                content: 'Today I learned about testing',
                mood: 'happy',
                tags: ['learning', 'testing'],
            }

            const mockJournal = TestDataBuilder.createJournal(journalData)

            mockApi.post.mockResolvedValue(mockApiResponse(mockJournal))

            const result = await journalService.createJournal(journalData)

            expect(mockApi.post).toHaveBeenCalledWith('/journals', journalData)
            expect(result).toEqual(mockJournal)
        })

        it('should require content', async () => {
            const invalidData = { mood: 'happy' }

            mockApi.post.mockRejectedValue(mockApiError('Content is required', 400))

            await expect(
                journalService.createJournal(invalidData as any)
            ).rejects.toThrow()
        })
    })

    describe('updateJournal', () => {
        it('should update journal entry', async () => {
            const journalId = 'journal-123'
            const updates = { content: 'Updated content', mood: 'neutral' }

            const mockJournal = TestDataBuilder.createJournal(updates)

            mockApi.put.mockResolvedValue(mockApiResponse(mockJournal))

            const result = await journalService.updateJournal(journalId, updates)

            expect(mockApi.put).toHaveBeenCalledWith(`/journals/${journalId}`, updates)
            expect(result).toEqual(mockJournal)
        })

        it('should serialize Date values as ISO strings in multipart audio updates', async () => {
            const journalId = 'journal-123'
            const updates = {
                date: new Date('2026-04-19T05:52:17.010Z'),
                reflection: 'Updated content',
                customFieldValues: { mood: 'focused' },
            }

            mockApi.put.mockResolvedValue(mockApiResponse({ success: true }))

            await journalService.updateJournal(journalId, updates as any, [new Blob(['audio'])])

            const [, formData] = mockApi.put.mock.calls[0]
            expect(formData).toBeInstanceOf(FormData)
            expect((formData as FormData).get('date')).toBe('2026-04-19T05:52:17.010Z')
            expect((formData as FormData).get('customFieldValues')).toBe(JSON.stringify({ mood: 'focused' }))
        })
    })

    describe('deleteJournal', () => {
        it('should delete journal entry', async () => {
            const journalId = 'journal-123'

            mockApi.delete.mockResolvedValue(mockApiResponse({ success: true }))

            await journalService.deleteJournal(journalId)

            expect(mockApi.delete).toHaveBeenCalledWith(`/journals/${journalId}`)
        })
    })

    describe('searchJournals', () => {
        it('should search journals by query', async () => {
            const searchQuery = 'learning'
            const mockResults = [TestDataBuilder.createJournal()]

            mockApi.post.mockResolvedValue(
                mockApiResponse({ journals: mockResults })
            )

            const result = await journalService.searchJournals(searchQuery)

            expect(mockApi.post).toHaveBeenCalledWith('/journals/search', {
                query: searchQuery,
            })
            expect(result).toEqual(mockResults)
        })
    })

    describe('getSimilarJournals', () => {
        it('should find similar journal entries', async () => {
            const journalId = 'journal-123'
            const mockSimilar = [TestDataBuilder.createJournal()]

            mockApi.get.mockResolvedValue(
                mockApiResponse({ journals: mockSimilar })
            )

            const result = await journalService.getSimilarJournals(journalId)

            expect(mockApi.get).toHaveBeenCalledWith(
                `/journals/${journalId}/similar`
            )
            expect(result).toEqual(mockSimilar)
        })
    })
})
