'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  ArrowPathIcon,
  ClockIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon as XIcon,
} from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import chatService, { Message, Conversation } from '@/services/chat.service';
import ChatHistoryModal from './ChatHistoryModal';

interface ChatComponentProps {
  conversationId?: string;
}

export default function ChatComponent({ conversationId }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(
    conversationId
  );
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history if conversationId is provided
  useEffect(() => {
    const loadConversation = async () => {
      if (currentConversationId) {
        try {
          const conv = await chatService.getConversation(currentConversationId);
          setConversation(conv);
          setMessages(conv.messages);
        } catch (error) {
          console.error('Failed to load conversation:', error);
        }
      }
    };

    loadConversation();
  }, [currentConversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userInput = input;

    // Add user message to messages
    const userMessage: Message = {
      role: 'user',
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreaming(true);

    try {
      // Stream the response
      let assistantContent = '';

      await chatService.streamMessage(
        userInput,
        currentConversationId,
        undefined,
        {
          onChunk: (chunk) => {
            assistantContent += chunk;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];

              // If last message is from assistant, update it
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content = assistantContent;
              } else {
                // Add new assistant message
                newMessages.push({
                  role: 'assistant',
                  content: assistantContent,
                });
              }

              return newMessages;
            });
          },
        }
      );

      // If we got a response, set the conversation ID for future messages
      if (!currentConversationId) {
        setCurrentConversationId(currentConversationId);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      // Remove the last user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear this chat?')) {
      setMessages([]);
      setCurrentConversationId(undefined);
      setConversation(null);
      toast.success('Chat cleared');
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setCurrentConversationId(conv.id);
    setConversation(conv);
    setMessages(conv.messages);
    setShowHistory(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between gap-3">
            {/* Left Side - Title and Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  AI Chat
                </h1>
              </div>
              {conversation && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {conversation.title}
                </p>
              )}
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Chat history"
              >
                <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={handleClearChat}
                disabled={messages.length === 0 || loading}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear chat"
              >
                <TrashIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-3 sm:space-y-4 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center px-4">
            <div className="space-y-4">
              <SparklesIcon className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600 mx-auto opacity-50" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Start a Conversation
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                  Ask me anything about your journals, goals, or your journey. I'm here to help! 💭
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                {message.createdAt && (
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        {loading && !streaming && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2 items-center">
                <ArrowPathIcon className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-4xl mx-auto w-full space-y-2 sm:space-y-3">
          <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Type your message..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Your chats are saved and use your journals & goals for context
          </p>
        </div>
      </div>

      {/* Chat History Modal */}
      {showHistory && (
        <ChatHistoryModal
          onSelectConversation={handleSelectConversation}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
