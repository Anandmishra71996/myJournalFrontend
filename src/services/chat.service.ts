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
                        Authorization: `Bearer ${this.getToken()}`,
                    },
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
     * Helper to get token from localStorage
     */
    private getToken(): string {
        if (typeof window === 'undefined') return '';
        try {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                const { state } = JSON.parse(authStorage);
                return state?.token || '';
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return '';
    }
}

export default new ChatService();
