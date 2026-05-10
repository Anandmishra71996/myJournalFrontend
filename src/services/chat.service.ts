import api from '@/lib/api';

export interface Message {
    id?: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt?: string;
}

export interface StreamCallbacks {
    onChunk?: (chunk: string) => void;
}

export interface AgentInterruptEvent {
    toolName: string;
    toolArgs: Record<string, unknown>;
}

export interface AgentStreamCallbacks {
    onToken: (token: string) => void;
    onInterrupt: (event: AgentInterruptEvent) => void;
    onError: (msg: string) => void;
    /** Called once on the first message of a new conversation with the persisted conversation ID. */
    onConversationId?: (id: string) => void;
}

export interface AgentResumeCallbacks {
    onToken: (token: string) => void;
    onError: (msg: string) => void;
}

export type AgentDecision =
    | { type: 'approve' }
    | { type: 'reject' }
    | { type: 'edit'; editedArgs: Record<string, unknown> };

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

export interface ChatResponse {
    conversationId: string;
    message: Message;
}

class ChatService {
    /**
     * Send a message and get a response
     */
    async sendMessage(
        message: string,
        conversationId?: string,
        systemPrompt?: string
    ): Promise<ChatResponse> {
        try {
            const response = await api.post('/chat/send', {
                message,
                conversationId,
                systemPrompt,
            });
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to send message'
            );
        }
    }

    /**
     * Stream a message response
     */
    async streamMessage(
        message: string,
        conversationId?: string,
        systemPrompt?: string,
        callbacks?: StreamCallbacks
    ): Promise<string> {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/chat/stream`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Send httpOnly cookies
                    body: JSON.stringify({
                        message,
                        conversationId,
                        systemPrompt,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to stream message');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            if (!reader) throw new Error('No response body');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.type === 'content' && parsed.content) {
                                fullResponse += parsed.content;
                                callbacks?.onChunk?.(parsed.content);
                            }
                        } catch (e) {
                            // Skip malformed JSON
                        }
                    }
                }
            }

            return fullResponse;
        } catch (error: any) {
            throw new Error(
                error.message || 'Failed to stream message'
            );
        }
    }

    /**
     * Get chat history for a conversation
     */
    async getChatHistory(conversationId: string): Promise<Conversation> {
        try {
            const response = await api.get(`/chat/history/${conversationId}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to fetch chat history'
            );
        }
    }

    /**
     * Get all conversations for the user
     */
    async getConversations(page: number = 1, limit: number = 10): Promise<{
        conversations: Conversation[];
        total: number;
        page: number;
        pages: number;
    }> {
        try {
            const response = await api.get(`/chat/conversations`, {
                params: { page, limit },
            });
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to fetch conversations'
            );
        }
    }

    /**
     * Get a specific conversation
     */
    async getConversation(conversationId: string): Promise<Conversation> {
        try {
            const response = await api.get(`/chat/conversations/${conversationId}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to fetch conversation'
            );
        }
    }

    /**
     * Delete a conversation
     */
    async deleteConversation(conversationId: string): Promise<void> {
        try {
            await api.delete(`/chat/conversations/${conversationId}`);
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to delete conversation'
            );
        }
    }

    /**
     * Create a new conversation
     */
    async createConversation(title: string): Promise<Conversation> {
        try {
            const response = await api.post('/chat/conversations', { title });
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to create conversation'
            );
        }
    }

    /**
     * Stream a message through the agent (with tools and HITL support).
     * Pass conversationId to continue an existing session; omit to start a new one.
     * The backend will emit a conversation_id event on the first message of a new session.
     */
    async agentStream(
        message: string,
        threadId: string,
        callbacks: AgentStreamCallbacks,
        conversationId?: string,
    ): Promise<void> {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/chat/agent/stream`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ message, threadId, conversationId }),
            }
        );

        if (!response.ok) {
            callbacks.onError('Failed to connect to agent');
            return;
        }

        await this._readSseStream(response, {
            conversation_id: (content) => callbacks.onConversationId?.(content),
            thinking: (content) => callbacks.onToken(content),
            response: (content) => callbacks.onToken(content),
            interrupt: (_content, raw) => {
                if (raw.toolName && raw.toolArgs) {
                    callbacks.onInterrupt({ toolName: raw.toolName as string, toolArgs: raw.toolArgs as Record<string, unknown> });
                }
            },
            error: (content) => callbacks.onError(content),
        });
    }

    /**
     * Resume agent after a HITL decision (approve / edit / reject).
     * Pass conversationId so the backend can append the assistant's response.
     */
    async resumeAgent(
        threadId: string,
        decision: AgentDecision,
        callbacks: AgentResumeCallbacks,
        conversationId?: string,
    ): Promise<void> {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/chat/agent/resume`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ threadId, decision, conversationId }),
            }
        );

        if (!response.ok) {
            callbacks.onError('Failed to resume agent');
            return;
        }

        await this._readSseStream(response, {
            thinking: (content) => callbacks.onToken(content),
            response: (content) => callbacks.onToken(content),
            error: (content) => callbacks.onError(content),
        });
    }

    private async _readSseStream(
        response: Response,
        handlers: Partial<Record<string, (content: string, raw: Record<string, unknown>) => void>>,
    ): Promise<void> {
        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split('\n\n');
            buffer = events.pop() ?? '';

            for (const event of events) {
                if (!event.startsWith('data: ')) continue;
                const data = event.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data) as Record<string, unknown>;
                    const type = parsed.type as string | undefined;
                    const content = (parsed.content as string) ?? '';
                    if (type && handlers[type]) {
                        handlers[type]!(content, parsed);
                    }
                } catch {
                    // skip malformed SSE lines
                }
            }
        }
    }

    /**
     * Get user's journals for context (with RAG)
     */
    async getJournalsForContext(): Promise<any[]> {
        try {
            const response = await api.get('/journals?limit=10&sort=-createdAt');
            return response.data.data;
        } catch (error: any) {
            console.error('Failed to fetch journals:', error);
            return [];
        }
    }

    /**
     * Get user's goals for context
     */
    async getGoalsForContext(): Promise<any[]> {
        try {
            const response = await api.get('/goals?limit=10');
            return response.data.data;
        } catch (error: any) {
            console.error('Failed to fetch goals:', error);
            return [];
        }
    }

    /**
     * Note: Authentication now uses httpOnly cookies
     * Tokens are automatically sent with all API requests via credentials
     * No need to manually retrieve or attach tokens
     */
}

export default new ChatService();
