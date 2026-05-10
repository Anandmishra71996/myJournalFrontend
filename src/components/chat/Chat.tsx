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
  PencilSquareIcon,
} from '@heroicons/react/24/solid';
import chatService, { Message, Conversation, AgentInterruptEvent } from '@/services/chat.service';
import ChatHistoryModal from './ChatHistoryModal';

interface ChatComponentProps {
  conversationId?: string;
}

interface PendingInterrupt {
  toolName: string;
  toolArgs: Record<string, unknown>;
}

// Suggested prompts shown on empty state
const SUGGESTED_PROMPTS = [
  'What did I write this week?',
  'What am I struggling with this month?',
  'What should I focus on?',
  'What patterns have you noticed about me?',
  'Summarize my week',
];

export default function ChatComponent({ conversationId }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [pendingInterrupt, setPendingInterrupt] = useState<PendingInterrupt | null>(null);
  const [editedArgs, setEditedArgs] = useState<Record<string, unknown>>({});
  // threadId persists for the entire session so agent state is maintained
  const [threadId] = useState(
    () => `thread_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingInterrupt]);

  // Load conversation history when a conversationId is provided
  useEffect(() => {
    if (!currentConversationId) return;
    chatService.getConversation(currentConversationId).then((conv) => {
      setConversation(conv);
      setMessages(conv.messages);
    }).catch(() => {/* silently ignore stale id */});
  }, [currentConversationId]);

  const appendAssistantToken = (token: string) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === 'assistant') {
        return [...prev.slice(0, -1), { ...last, content: last.content + token }];
      }
      return [...prev, { role: 'assistant', content: token }];
    });
  };

  const handleSendMessage = async (e: React.FormEvent | null, overrideText?: string) => {
    e?.preventDefault();
    const userInput = (overrideText ?? input).trim();
    if (!userInput || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
    setInput('');
    setLoading(true);
    setStreaming(true);

    try {
      await chatService.agentStream(userInput, threadId, {
        onToken: appendAssistantToken,
        onConversationId: (id) => setCurrentConversationId(id),
        onInterrupt: (event: AgentInterruptEvent) => {
          setPendingInterrupt({ toolName: event.toolName, toolArgs: event.toolArgs });
          setEditedArgs(event.toolArgs);
          setLoading(false);
          setStreaming(false);
        },
        onError: (msg: string) => {
          toast.error(msg || 'Something went wrong');
          setMessages((prev) => prev.slice(0, -1));
        },
      }, currentConversationId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleDecision = async (type: 'approve' | 'edit' | 'reject') => {
    if (!pendingInterrupt) return;
    setPendingInterrupt(null);
    setLoading(true);
    setStreaming(true);

    const decision =
      type === 'approve' ? { type: 'approve' as const } :
      type === 'reject' ? { type: 'reject' as const } :
      { type: 'edit' as const, editedArgs };

    try {
      await chatService.resumeAgent(threadId, decision, {
        onToken: appendAssistantToken,
        onError: (msg: string) => toast.error(msg),
      }, currentConversationId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resume');
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleClearChat = () => {
    if (!confirm('Clear this conversation?')) return;
    setMessages([]);
    setCurrentConversationId(undefined);
    setConversation(null);
    setPendingInterrupt(null);
    toast.success('Chat cleared');
  };

  const handleSelectConversation = (conv: Conversation) => {
    setCurrentConversationId(conv.id);
    setConversation(conv);
    setMessages(conv.messages);
    setShowHistory(false);
  };

  const isBlocked = loading || !!pendingInterrupt;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  Personal Growth AI
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {conversation ? conversation.title : 'Analyze habits, uncover patterns, and stay accountable.'}
              </p>
            </div>
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
                disabled={messages.length === 0 || isBlocked}
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
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-6">
            <div className="space-y-2">
              <SparklesIcon className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600 mx-auto opacity-50" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Start a Conversation
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Ask about your journals, goals, patterns, or get a weekly summary.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(null, prompt)}
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                {message.createdAt && (
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        {loading && !streaming && !pendingInterrupt && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2 items-center">
                <ArrowPathIcon className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* HITL Interrupt Confirmation Card */}
      {pendingInterrupt && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-3">
          <div className="bg-white dark:bg-gray-800 border-2 border-indigo-400 dark:border-indigo-500 rounded-xl p-4 shadow-lg">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Confirm: <span className="font-mono text-indigo-600">{pendingInterrupt.toolName.replace(/_/g, ' ')}</span>
            </p>
            <div className="space-y-2 mb-4">
              {Object.entries(editedArgs).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="text"
                    value={String(value ?? '')}
                    onChange={(e) => setEditedArgs((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDecision('approve')}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <CheckIcon className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => handleDecision('edit')}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4" /> Save Edits
              </button>
              <button
                onClick={() => handleDecision('reject')}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <XIcon className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-4xl mx-auto w-full space-y-2 sm:space-y-3">
          <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isBlocked}
              placeholder={pendingInterrupt ? 'Waiting for your decision above...' : 'Ask about your journals, goals, patterns...'}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isBlocked || !input.trim()}
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
            Powered by your journals, goals, and behavioral patterns
          </p>
        </div>
      </div>

      {showHistory && (
        <ChatHistoryModal
          onSelectConversation={handleSelectConversation}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
