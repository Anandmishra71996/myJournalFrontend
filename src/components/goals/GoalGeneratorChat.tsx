'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Send, X, Check, Pencil } from 'lucide-react';
import chatService, { Message, ToolCallData } from '@/services/chat.service';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface GoalGeneratorChatProps {
    onClose: () => void;
    onGoalsCreated?: () => void;
}

interface EditableGoal {
    title: string;
    type: 'weekly' | 'monthly' | 'yearly';
    category: string;
    why?: string;
    trackingMethods: string[];
    journalSignals: string[];
    successDefinition?: string;
    isRepetitive: boolean;
}

export default function GoalGeneratorChat({ onClose, onGoalsCreated }: GoalGeneratorChatProps) {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string>();
    const [streaming, setStreaming] = useState(false);
    const [pendingToolCall, setPendingToolCall] = useState<ToolCallData | null>(null);
    const [toolExecuting, setToolExecuting] = useState(false);
    const [editingGoals, setEditingGoals] = useState<EditableGoal[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, editingGoals]);

    // Auto-initialize with prompt and restore draft if exists
    useEffect(() => {
        // Check if user is returning from full edit
        const draftStr = localStorage.getItem('aiGoalDraft');
        if (draftStr) {
            try {
                const draft = JSON.parse(draftStr);
                if (draft.allGoals && Array.isArray(draft.allGoals)) {
                    // Restore all goals
                    setEditingGoals(draft.allGoals);
                    setMessages([{
                        role: 'assistant',
                        content: "Welcome back! I've restored your AI-generated goals. You can continue editing them below or ask me to generate new ones.",
                    }]);
                    return;
                }
            } catch (error) {
                console.error('Failed to parse AI draft:', error);
            }
        }

        const initPrompt = "I'll help you generate personalized goals based on your interests and journal history. What area would you like to focus on? (e.g., exams, career growth, health & fitness, learning new skills)";
        
        setMessages([{
            role: 'assistant',
            content: initPrompt,
        }]);
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userInput = input;
        const userMessage: Message = {
            role: 'user',
            content: userInput,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setStreaming(true);

        try {
            let assistantContent = '';

            // Create goal generation conversation if first message
            if (!conversationId) {
                try {
                    const response = await api.post('/chat/conversations', {
                        title: 'AI Goal Generation',
                        metadata: { type: 'goal_generation' },
                    });
                    if (response.data.success) {
                        const newConvId = response.data.data._id || response.data.data.id;
                        setConversationId(newConvId);
                    }
                } catch (error) {
                    console.error('Failed to create conversation:', error);
                }
            }

            await chatService.streamMessage(
                userInput,
                conversationId,
                undefined,
                {
                    onChunk: (chunk) => {
                        assistantContent += chunk;
                        setMessages((prev) => {
                            const newMessages = [...prev];
                            const lastMessage = newMessages[newMessages.length - 1];

                            if (lastMessage && lastMessage.role === 'assistant') {
                                lastMessage.content = assistantContent;
                            } else {
                                newMessages.push({
                                    role: 'assistant',
                                    content: assistantContent,
                                });
                            }

                            return newMessages;
                        });
                    },
                    onToolCall: (toolCall) => {
                        setPendingToolCall(toolCall);
                        
                        // If it's a generate_goals_preview tool, fetch and parse the goals
                        if (toolCall.toolName === 'generate_goals_preview') {
                            (async () => {
                                try {
                                    const toolCallDetails = await chatService.getPendingToolCall(toolCall.toolCallId);
                                    if (toolCallDetails && toolCallDetails.params && toolCallDetails.params.goalsPreview) {
                                        setEditingGoals(toolCallDetails.params.goalsPreview);
                                    }
                                } catch (error) {
                                    console.error('Failed to fetch tool call details:', error);
                                }
                            })();
                        }
                        
                        if (toolCall.conversationId && !conversationId) {
                            setConversationId(toolCall.conversationId);
                        }
                    },
                },
                true // Enable agent tools
            );
        } catch (error: any) {
            toast.error(error.message || 'Failed to send message');
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
            setStreaming(false);
        }
    };

    const handleEditGoal = (index: number, field: keyof EditableGoal, value: any) => {
        setEditingGoals((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSaveGoals = async () => {
        if (editingGoals.length === 0) return;

        setToolExecuting(true);

        try {
            // Create goals via batch endpoint
            const response = await api.post('/goals/batch', {
                goals: editingGoals.map(g => ({
                    ...g,
                    generatedBy: 'agent',
                    status: 'active',
                })),
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Goals created successfully!');
                
                // Mark conversation as complete
                if (conversationId) {
                    try {
                        await api.patch(`/chat/conversations/${conversationId}`, {
                            metadata: {
                                goalGenerationCompleted: true,
                                goalsCreated: editingGoals.length,
                            },
                        });
                    } catch (error) {
                        console.error('Failed to update conversation:', error);
                    }
                }
                
                // Add success message to chat
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: `✅ ${response.data.message}`,
                    },
                ]);

                // Clear editing state
                setEditingGoals([]);
                setPendingToolCall(null);

                // Notify parent and close after short delay
                setTimeout(() => {
                    onGoalsCreated?.();
                    onClose();
                }, 1500);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create goals');
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `⚠️ ${error.response?.data?.error || 'Failed to create goals'}`,
                },
            ]);
        } finally {
            setToolExecuting(false);
        }
    };

    const handleCancelGoals = async () => {
        if (!pendingToolCall) return;

        try {
            await chatService.confirmToolExecution(pendingToolCall.toolCallId, false);
            
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Goal creation cancelled. Feel free to try again with different preferences!',
                },
            ]);
        } catch (error) {
            console.error('Failed to cancel:', error);
        } finally {
            setEditingGoals([]);
            setPendingToolCall(null);
        }
    };

    const handleConfirmSingleGoal = async () => {
        if (!pendingToolCall) return;

        setToolExecuting(true);

        try {
            const result = await chatService.confirmToolExecution(pendingToolCall.toolCallId, true);

            if (result.success) {
                toast.success(result.message || 'Goal created successfully!');
                
                // Add success message to chat
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: `✅ ${result.message}`,
                    },
                ]);

                // Clear pending state
                setPendingToolCall(null);

                // Notify parent and close after short delay
                setTimeout(() => {
                    onGoalsCreated?.();
                    onClose();
                }, 1500);
            } else {
                throw new Error(result.message || 'Failed to create goal');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create goal');
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `⚠️ ${error.message || 'Failed to create goal'}`,
                },
            ]);
        } finally {
            setToolExecuting(false);
        }
    };

    const handleEditFullDetails = (goalIndex: number) => {
        const goalToEdit = editingGoals[goalIndex];
        
        // Store the goal data in localStorage
        localStorage.setItem('aiGoalDraft', JSON.stringify({
            ...goalToEdit,
            fromAI: true,
            allGoals: editingGoals, // Save all goals in case user wants to come back
            editingIndex: goalIndex,
        }));
        
        toast.info('Opening full editor...');
        
        // Navigate to create page with AI mode flag
        router.push(`/goals/create?type=${goalToEdit.type}&mode=ai-edit`);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                message.role === 'user'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Pending Tool Call Display with Confirmation */}
                {pendingToolCall && pendingToolCall.toolName === 'create_goal' && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    🎯 Goal Creation Detected
                                </h4>
                                <div
                                    className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{
                                        __html: pendingToolCall.displayMessage
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\n/g, '<br />')
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-200 dark:border-indigo-700">
                            <button
                                onClick={handleCancelGoals}
                                disabled={toolExecuting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSingleGoal}
                                disabled={toolExecuting}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {toolExecuting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Create Goal
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Preview Message for generate_goals_preview */}
                {pendingToolCall && pendingToolCall.toolName === 'generate_goals_preview' && editingGoals.length > 0 && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl px-4 py-3">
                            <p className="text-sm text-blue-900 dark:text-blue-200">
                                ✨ I've generated some goal suggestions for you! Review and edit them below, then click "Save Selected Goals" when ready.
                            </p>
                        </div>
                    </div>
                )}

                {/* Goal Preview Cards (Inline Editing) */}
                {editingGoals.length > 0 && (
                    <div className="space-y-3 mt-4">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            📝 Review & Edit Your Goals
                        </div>
                        
                        {editingGoals.map((goal, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4"
                            >
                                {/* Title */}
                                <div className="mb-2">
                                    <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                        Goal Title
                                    </label>
                                    <input
                                        type="text"
                                        value={goal.title}
                                        onChange={(e) =>
                                            handleEditGoal(index, 'title', e.target.value)
                                        }
                                        className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                        maxLength={80}
                                    />
                                </div>

                                {/* Type & Category */}
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                            Type
                                        </label>
                                        <select
                                            value={goal.type}
                                            onChange={(e) =>
                                                handleEditGoal(index, 'type', e.target.value)
                                            }
                                            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                            Category
                                        </label>
                                        <select
                                            value={goal.category}
                                            onChange={(e) =>
                                                handleEditGoal(index, 'category', e.target.value)
                                            }
                                            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                        >
                                            <option value="Health">Health</option>
                                            <option value="Career">Career</option>
                                            <option value="Learning">Learning</option>
                                            <option value="Mindset">Mindset</option>
                                            <option value="Relationships">Relationships</option>
                                            <option value="Personal">Personal</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Why */}
                                {goal.why && (
                                    <div className="mb-2">
                                        <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                            Why
                                        </label>
                                        <textarea
                                            value={goal.why}
                                            onChange={(e) =>
                                                handleEditGoal(index, 'why', e.target.value)
                                            }
                                            className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm resize-none"
                                            rows={2}
                                            maxLength={200}
                                        />
                                    </div>
                                )}

                                {/* Quick Info */}
                                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                    <div>
                                        <span className="font-medium">Tracking:</span>{' '}
                                        {goal.trackingMethods.join(', ')}
                                    </div>
                                    <div>
                                        <span className="font-medium">Signals:</span>{' '}
                                        {goal.journalSignals.join(', ')}
                                    </div>
                                </div>

                                {/* Edit Full Details Button */}
                                <button
                                    onClick={() => handleEditFullDetails(index)}
                                    className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit Full Details
                                </button>
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleSaveGoals}
                                disabled={toolExecuting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {toolExecuting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Save Selected Goals
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancelGoals}
                                disabled={toolExecuting}
                                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Streaming Indicator */}
                {streaming && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={loading || editingGoals.length > 0}
                        className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim() || editingGoals.length > 0}
                        className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                
                {editingGoals.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Review your goals above before saving
                    </p>
                )}
            </div>
        </div>
    );
}
