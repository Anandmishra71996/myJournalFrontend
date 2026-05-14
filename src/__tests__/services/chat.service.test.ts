import chatService from '@/services/chat.service'

jest.mock('@/lib/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    },
}))

import api from '@/lib/api'

// ─── SSE helpers ──────────────────────────────────────────────────────────────

function encodeLines(lines: string[]): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder()
    return new ReadableStream({
        start(controller) {
            for (const line of lines) {
                controller.enqueue(encoder.encode(line))
            }
            controller.close()
        },
    })
}

function makeSseResponse(events: Array<Record<string, unknown> | '[DONE]'>): Response {
    const lines = events.map((e) =>
        e === '[DONE]' ? 'data: [DONE]\n\n' : `data: ${JSON.stringify(e)}\n\n`
    )
    return {
        ok: true,
        body: encodeLines(lines),
    } as unknown as Response
}

function makeErrorResponse(status = 500): Response {
    return { ok: false, status, body: null } as unknown as Response
}

// ─── test setup ───────────────────────────────────────────────────────────────

describe('ChatService', () => {
    const mockApi = api as jest.Mocked<typeof api>

    beforeEach(() => {
        jest.clearAllMocks()
        ;(global.fetch as jest.Mock) = jest.fn()
    })

    // ── sendMessage ──────────────────────────────────────────────────────────

    describe('sendMessage', () => {
        it('posts to /chat/send and returns the response', async () => {
            const payload = { conversationId: 'c1', message: { role: 'assistant', content: 'Hi' } }
            mockApi.post.mockResolvedValue({ data: { data: payload } })

            const result = await chatService.sendMessage('Hello')

            expect(mockApi.post).toHaveBeenCalledWith('/chat/send', expect.objectContaining({ message: 'Hello' }))
            expect(result).toEqual(payload)
        })

        it('throws on API error', async () => {
            mockApi.post.mockRejectedValue({ response: { data: { error: 'Quota exceeded' } } })
            await expect(chatService.sendMessage('hello')).rejects.toThrow('Quota exceeded')
        })
    })

    // ── getConversations ─────────────────────────────────────────────────────

    describe('getConversations', () => {
        it('fetches paginated conversations', async () => {
            const payload = { conversations: [], total: 0, page: 1, pages: 1 }
            mockApi.get.mockResolvedValue({ data: { data: payload } })

            const result = await chatService.getConversations(1, 10)

            expect(mockApi.get).toHaveBeenCalledWith('/chat/conversations', { params: { page: 1, limit: 10 } })
            expect(result).toEqual(payload)
        })
    })

    // ── deleteConversation ───────────────────────────────────────────────────

    describe('deleteConversation', () => {
        it('calls DELETE on the correct endpoint', async () => {
            mockApi.delete.mockResolvedValue({ data: {} })
            await chatService.deleteConversation('conv-abc')
            expect(mockApi.delete).toHaveBeenCalledWith('/chat/conversations/conv-abc')
        })
    })

    // ── agentStream ──────────────────────────────────────────────────────────

    describe('agentStream', () => {
        it('sends the correct request to /chat/agent/stream', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(makeSseResponse(['[DONE]']))

            await chatService.agentStream('hello', 'thread-1', {
                onToken: jest.fn(),
                onInterrupt: jest.fn(),
                onError: jest.fn(),
            })

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/chat/agent/stream'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ message: 'hello', threadId: 'thread-1' }),
                    credentials: 'include',
                })
            )
        })

        it('calls onToken for each thinking event', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                makeSseResponse([
                    { type: 'thinking', content: 'Hello ' },
                    { type: 'thinking', content: 'world' },
                    '[DONE]',
                ])
            )

            const onToken = jest.fn()
            await chatService.agentStream('hi', 'thread-1', {
                onToken,
                onInterrupt: jest.fn(),
                onError: jest.fn(),
            })

            expect(onToken).toHaveBeenCalledTimes(2)
            expect(onToken).toHaveBeenNthCalledWith(1, 'Hello ')
            expect(onToken).toHaveBeenNthCalledWith(2, 'world')
        })

        it('calls onToken for response events (post-HITL resume tokens)', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                makeSseResponse([{ type: 'response', content: 'Done!' }, '[DONE]'])
            )

            const onToken = jest.fn()
            await chatService.agentStream('hi', 'thread-1', {
                onToken,
                onInterrupt: jest.fn(),
                onError: jest.fn(),
            })

            expect(onToken).toHaveBeenCalledWith('Done!')
        })

        it('calls onInterrupt with toolName and toolArgs for interrupt events', async () => {
            const toolArgs = { title: 'Run 5km', type: 'weekly', category: 'Health' }
            ;(global.fetch as jest.Mock).mockResolvedValue(
                makeSseResponse([
                    { type: 'interrupt', toolName: 'create_goal', toolArgs, needsConfirmation: true },
                    '[DONE]',
                ])
            )

            const onInterrupt = jest.fn()
            await chatService.agentStream('set a goal', 'thread-1', {
                onToken: jest.fn(),
                onInterrupt,
                onError: jest.fn(),
            })

            expect(onInterrupt).toHaveBeenCalledWith({ toolName: 'create_goal', toolArgs })
        })

        it('calls onError for error events', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                makeSseResponse([{ type: 'error', content: 'LLM quota exceeded' }, '[DONE]'])
            )

            const onError = jest.fn()
            await chatService.agentStream('hi', 'thread-1', {
                onToken: jest.fn(),
                onInterrupt: jest.fn(),
                onError,
            })

            expect(onError).toHaveBeenCalledWith('LLM quota exceeded')
        })

        it('calls onError when fetch response is not ok', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(makeErrorResponse(500))

            const onError = jest.fn()
            await chatService.agentStream('hi', 'thread-1', {
                onToken: jest.fn(),
                onInterrupt: jest.fn(),
                onError,
            })

            expect(onError).toHaveBeenCalledWith('Failed to connect to agent')
        })

        it('silently skips malformed SSE lines', async () => {
            const encoder = new TextEncoder()
            const body = new ReadableStream({
                start(c) {
                    c.enqueue(encoder.encode('data: NOT_JSON\n\ndata: {"type":"thinking","content":"ok"}\n\n'))
                    c.close()
                },
            })
            ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, body } as unknown as Response)

            const onToken = jest.fn()
            await chatService.agentStream('hi', 'thread-1', {
                onToken,
                onInterrupt: jest.fn(),
                onError: jest.fn(),
            })

            expect(onToken).toHaveBeenCalledWith('ok')
        })
    })

    // ── resumeAgent ──────────────────────────────────────────────────────────

    describe('resumeAgent', () => {
        it('sends approve decision to /chat/agent/resume', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(makeSseResponse(['[DONE]']))

            await chatService.resumeAgent('thread-1', { type: 'approve' }, {
                onToken: jest.fn(),
                onError: jest.fn(),
            })

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/chat/agent/resume'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ threadId: 'thread-1', decision: { type: 'approve' } }),
                    credentials: 'include',
                })
            )
        })

        it('sends reject decision correctly', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(makeSseResponse(['[DONE]']))

            await chatService.resumeAgent('thread-1', { type: 'reject' }, {
                onToken: jest.fn(),
                onError: jest.fn(),
            })

            const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
            expect(body.decision.type).toBe('reject')
        })

        it('sends edit decision with editedArgs', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(makeSseResponse(['[DONE]']))

            const editedArgs = { title: 'Updated goal' }
            await chatService.resumeAgent('thread-1', { type: 'edit', editedArgs }, {
                onToken: jest.fn(),
                onError: jest.fn(),
            })

            const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body)
            expect(body.decision).toEqual({ type: 'edit', editedArgs })
        })

        it('calls onToken for response tokens after resume', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(
                makeSseResponse([{ type: 'response', content: 'Goal saved!' }, '[DONE]'])
            )

            const onToken = jest.fn()
            await chatService.resumeAgent('thread-1', { type: 'approve' }, {
                onToken,
                onError: jest.fn(),
            })

            expect(onToken).toHaveBeenCalledWith('Goal saved!')
        })

        it('calls onError when fetch response is not ok', async () => {
            ;(global.fetch as jest.Mock).mockResolvedValue(makeErrorResponse(503))

            const onError = jest.fn()
            await chatService.resumeAgent('thread-1', { type: 'approve' }, {
                onToken: jest.fn(),
                onError,
            })

            expect(onError).toHaveBeenCalledWith('Failed to resume agent')
        })
    })
})
