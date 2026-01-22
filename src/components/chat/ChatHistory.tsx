'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import chatService, { Conversation } from '@/services/chat.service';

interface ChatHistoryProps {
  onSelectConversation: (conversation: Conversation) => void;
  onClose: () => void;
}

export default function ChatHistory({
  onSelectConversation,
  onClose,
}: ChatHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, [page]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const result = await chatService.getConversations(page, 15);
      setConversations(result.conversations);
      setTotalPages(result.pages);
    } catch (error: any) {
      toast.error('Failed to load conversations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (conversationId: string) => {
    if (!confirm('Delete this conversation?')) return;

    try {
      setDeleting(conversationId);
      await chatService.deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((c) => c.id !== conversationId)
      );
      toast.success('Conversation deleted');
    } catch (error: any) {
      toast.error('Failed to delete conversation');
    } finally {
      setDeleting(null);
    }
  };

  const handleNewChat = () => {
    onSelectConversation({
      id: '',
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          Chat History
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Close"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="m-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        New Chat
      </button>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <ArrowPathIcon className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-2">Start a new chat to begin</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group p-3 rounded-lg cursor-pointer transition-all ${
                selectedId === conversation.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div
                onClick={() => {
                  setSelectedId(conversation.id);
                  onSelectConversation(conversation);
                }}
                className="flex-1"
              >
                <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {conversation.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {conversation.messages.length} messages
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(conversation.id);
                }}
                disabled={deleting === conversation.id}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all disabled:opacity-50"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
