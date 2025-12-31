import { create } from 'zustand';
import api from '@/lib/api';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

interface Conversation {
    _id: string;
    title: string;
    messages: Message[];
    updatedAt: Date;
}

interface ChatState {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    loading: boolean;

    fetchConversations: () => Promise<void>;
    createConversation: (title?: string) => Promise<void>;
    setCurrentConversation: (id: string) => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
    streamMessage: (message: string) => Promise<void>;
    clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,

    fetchConversations: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/conversations');
            set({ conversations: response.data.data.conversations });
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            set({ loading: false });
        }
    },

    createConversation: async (title?: string) => {
        try {
            const response = await api.post('/conversations', { title });
            const conversation = response.data.data;
            set((state) => ({
                conversations: [conversation, ...state.conversations],
                currentConversation: conversation,
                messages: [],
            }));
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    },

    setCurrentConversation: async (id: string) => {
        try {
            const response = await api.get(`/conversations/${id}`);
            const conversation = response.data.data;
            set({
                currentConversation: conversation,
                messages: conversation.messages,
            });
        } catch (error) {
            console.error('Error setting conversation:', error);
        }
    },

    sendMessage: async (message: string) => {
        const { currentConversation } = get();

        // Add user message immediately
        set((state) => ({
            messages: [...state.messages, { role: 'user', content: message, timestamp: new Date() }],
        }));

        try {
            const response = await api.post('/chat/message', {
                message,
                conversationId: currentConversation?._id,
            });

            const assistantMessage = response.data.data.message;

            set((state) => ({
                messages: [...state.messages, { role: 'assistant', content: assistantMessage, timestamp: new Date() }],
                currentConversation: response.data.data.conversationId
                    ? { ...state.currentConversation!, _id: response.data.data.conversationId }
                    : state.currentConversation,
            }));
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    streamMessage: async (message: string) => {
        const { currentConversation } = get();

        // Add user message immediately
        set((state) => ({
            messages: [...state.messages, { role: 'user', content: message, timestamp: new Date() }],
        }));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': api.defaults.headers.common['Authorization'] as string,
                },
                body: JSON.stringify({
                    message,
                    conversationId: currentConversation?._id,
                }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            // Add empty assistant message
            set((state) => ({
                messages: [...state.messages, { role: 'assistant', content: '', timestamp: new Date() }],
            }));

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);
                            assistantMessage += parsed.content;

                            // Update last message
                            set((state) => ({
                                messages: state.messages.map((msg, idx) =>
                                    idx === state.messages.length - 1
                                        ? { ...msg, content: assistantMessage }
                                        : msg
                                ),
                            }));
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error streaming message:', error);
            throw error;
        }
    },

    clearMessages: () => {
        set({ messages: [], currentConversation: null });
    },
}));
