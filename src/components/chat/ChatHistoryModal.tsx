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

interface ChatHistoryModalProps {
  onSelectConversation: (conversation: Conversation) => void;
  onClose: () => void;
}

export default function ChatHistoryModal({
  onSelectConversation,
  onClose,
}: ChatHistoryModalProps) {
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
      const result = await chatService.getConversations(page, 12);
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-in">
      {/* Modal */}
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:w-full sm:max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
            Chat History
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Close"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="m-4 px-4 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <PlusIcon className="w-5 h-5" />
          New Chat
        </button>

        {/* Conversations Grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
          {loading ? (
            <div className="flex items-center justify-center h-24">
              <ArrowPathIcon className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-2">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all border-2 ${
                    selectedId === conversation.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div
                    onClick={() => {
                      setSelectedId(conversation.id);
                      onSelectConversation(conversation);
                    }}
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {conversation.title}
                    </h3>
                    <div className="flex gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <span>💬 {conversation.messages.length}</span>
                      <span>📅 {new Date(conversation.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conversation.id);
                    }}
                    disabled={deleting === conversation.id}
                    className="opacity-0 group-hover:opacity-100 mt-2 w-full p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all disabled:opacity-50 flex items-center justify-center gap-1 text-sm"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
