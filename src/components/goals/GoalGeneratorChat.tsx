"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Send, X, Check, Pencil } from "lucide-react";
import chatService, { Message } from "@/services/chat.service";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface GoalGeneratorChatProps {
  onClose: () => void;
  onGoalsCreated?: () => void;
}

interface EditableGoal {
  title: string;
  type: "weekly" | "monthly" | "yearly";
  category: string;
  why?: string;
  trackingMethods: string[];
  journalSignals: string[];
  successDefinition?: string;
  isRepetitive: boolean;
}

export default function GoalGeneratorChat({
  onClose,
  onGoalsCreated,
}: GoalGeneratorChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const [streaming, setStreaming] = useState(false);
  const [pendingToolCall, setPendingToolCall] = useState<any>(null);
  const [toolExecuting, setToolExecuting] = useState(false);
  const [editingGoals, setEditingGoals] = useState<EditableGoal[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, editingGoals]);

  // Auto-initialize with prompt and restore draft if exists
  useEffect(() => {
    // Check if user is returning from full edit
    const draftStr = localStorage.getItem("aiGoalDraft");
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        if (draft.allGoals && Array.isArray(draft.allGoals)) {
          // Restore all goals
          setEditingGoals(draft.allGoals);
          setMessages([
            {
              role: "assistant",
              content:
                "Welcome back! I've restored your AI-generated goals. You can continue editing them below or ask me to generate new ones.",
            },
          ]);
          return;
        }
      } catch (error) {
        console.error("Failed to parse AI draft:", error);
      }
    }

    const initPrompt =
      "I'll help you generate personalized goals based on your interests and journal history. What area would you like to focus on? (e.g., exams, career growth, health & fitness, learning new skills)";

    setMessages([
      {
        role: "assistant",
        content: initPrompt,
      },
    ]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userInput = input;
    const userMessage: Message = {
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setStreaming(true);

    try {
      let assistantContent = "";

      // Create goal generation conversation if first message
      if (!conversationId) {
        try {
          const response = await api.post("/chat/conversations", {
            title: "AI Goal Generation",
            metadata: { type: "goal_generation" },
          });
          if (response.data.success) {
            const newConvId = response.data.data._id || response.data.data.id;
            setConversationId(newConvId);
          }
        } catch (error) {
          console.error("Failed to create conversation:", error);
        }
      }

      await chatService.streamMessage(userInput, conversationId, undefined, {
        onChunk: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];

            if (lastMessage && lastMessage.role === "assistant") {
              lastMessage.content = assistantContent;
            } else {
              newMessages.push({
                role: "assistant",
                content: assistantContent,
              });
            }

            return newMessages;
          });
        },
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleEditGoal = (
    index: number,
    field: keyof EditableGoal,
    value: any,
  ) => {
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
      const response = await api.post("/goals/batch", {
        goals: editingGoals.map((g) => ({
          ...g,
          generatedBy: "agent",
          status: "active",
        })),
      });

      if (response.data.success) {
        toast.success(response.data.message || "Goals created successfully!");

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
            console.error("Failed to update conversation:", error);
          }
        }

        // Add success message to chat
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
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
      toast.error(error.response?.data?.error || "Failed to create goals");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${error.response?.data?.error || "Failed to create goals"}`,
        },
      ]);
    } finally {
      setToolExecuting(false);
    }
  };

  const handleCancelGoals = async () => {
    if (!pendingToolCall) return;

    try {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Goal creation cancelled. Feel free to try again with different preferences!",
        },
      ]);
    } catch (error) {
      console.error("Failed to cancel:", error);
    } finally {
      setEditingGoals([]);
      setPendingToolCall(null);
    }
  };

  const handleConfirmSingleGoal = async () => {
    if (!pendingToolCall) return;

    setToolExecuting(true);

    try {
      // Tool execution is handled by the agent automatically
      toast.success("Goal created successfully!");

      // Add success message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "✅ Goal created successfully!",
        },
      ]);

      // Clear pending state
      setPendingToolCall(null);

      // Notify parent and close after short delay
      setTimeout(() => {
        onGoalsCreated?.();
        onClose();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to create goal");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${error.message || "Failed to create goal"}`,
        },
      ]);
    } finally {
      setToolExecuting(false);
    }
  };

  const handleEditFullDetails = (goalIndex: number) => {
    const goalToEdit = editingGoals[goalIndex];

    // Store the goal data in localStorage
    localStorage.setItem(
      "aiGoalDraft",
      JSON.stringify({
        ...goalToEdit,
        fromAI: true,
        allGoals: editingGoals, // Save all goals in case user wants to come back
        editingIndex: goalIndex,
      }),
    );

    toast.info("Opening full editor...");

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
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user" ? "text-white" : ""
              }`}
              style={
                message.role === "user"
                  ? {
                      background:
                        "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
                    }
                  : {
                      backgroundColor: "var(--color-surface-container-high)",
                      color: "var(--color-text-primary)",
                      outline:
                        "1px solid color-mix(in srgb, var(--color-outline-variant) 25%, transparent)",
                    }
              }
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {/* Pending Tool Call Display with Confirmation */}
        {pendingToolCall && pendingToolCall.toolName === "create_goal" && (
          <div
            className="rounded-xl p-4 space-y-3"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, transparent), color-mix(in srgb, var(--color-secondary) 8%, transparent))",
              outline:
                "2px solid color-mix(in srgb, var(--color-primary) 25%, transparent)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  🎯 Goal Creation Detected
                </h4>
                <div
                  className="text-sm whitespace-pre-wrap"
                  style={{ color: "var(--color-text-secondary)" }}
                  dangerouslySetInnerHTML={{
                    __html: pendingToolCall.displayMessage
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>

            <div
              className="flex items-center justify-end gap-2 pt-2"
              style={{
                borderTop:
                  "1px solid color-mix(in srgb, var(--color-outline-variant) 25%, transparent)",
              }}
            >
              <button
                onClick={handleCancelGoals}
                disabled={toolExecuting}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  backgroundColor: "var(--color-surface-container-high)",
                  color: "var(--color-text-secondary)",
                  outline:
                    "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
                }}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleConfirmSingleGoal}
                disabled={toolExecuting}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
                }}
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
        {pendingToolCall &&
          pendingToolCall.toolName === "generate_goals_preview" &&
          editingGoals.length > 0 && (
            <div className="flex justify-start">
              <div
                className="max-w-[85%] rounded-2xl px-4 py-3"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 9%, transparent)",
                  outline:
                    "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  ✨ I've generated some goal suggestions for you! Review and
                  edit them below, then click "Save Selected Goals" when ready.
                </p>
              </div>
            </div>
          )}

        {/* Goal Preview Cards (Inline Editing) */}
        {editingGoals.length > 0 && (
          <div className="space-y-3 mt-4">
            <div
              className="text-sm font-medium mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              📝 Review & Edit Your Goals
            </div>

            {editingGoals.map((goal, index) => (
              <div
                key={index}
                className="rounded-xl p-4"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 7%, transparent)",
                  outline:
                    "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)",
                }}
              >
                {/* Title */}
                <div className="mb-2">
                  <label
                    className="text-xs font-medium"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Goal Title
                  </label>
                  <input
                    type="text"
                    value={goal.title}
                    onChange={(e) =>
                      handleEditGoal(index, "title", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: "var(--color-surface-container-lowest)",
                      color: "var(--color-text-primary)",
                      outline:
                        "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
                    }}
                    maxLength={80}
                  />
                </div>

                {/* Type & Category */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label
                      className="text-xs font-medium"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      Type
                    </label>
                    <select
                      value={goal.type}
                      onChange={(e) =>
                        handleEditGoal(index, "type", e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor:
                          "var(--color-surface-container-lowest)",
                        color: "var(--color-text-primary)",
                        outline:
                          "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
                      }}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      Category
                    </label>
                    <select
                      value={goal.category}
                      onChange={(e) =>
                        handleEditGoal(index, "category", e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor:
                          "var(--color-surface-container-lowest)",
                        color: "var(--color-text-primary)",
                        outline:
                          "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
                      }}
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
                    <label
                      className="text-xs font-medium"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      Why
                    </label>
                    <textarea
                      value={goal.why}
                      onChange={(e) =>
                        handleEditGoal(index, "why", e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm resize-none"
                      style={{
                        backgroundColor:
                          "var(--color-surface-container-lowest)",
                        color: "var(--color-text-primary)",
                        outline:
                          "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
                      }}
                      rows={2}
                      maxLength={200}
                    />
                  </div>
                )}

                {/* Quick Info */}
                <div
                  className="text-xs space-y-1"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <div>
                    <span className="font-medium">Tracking:</span>{" "}
                    {goal.trackingMethods.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Signals:</span>{" "}
                    {goal.journalSignals.join(", ")}
                  </div>
                </div>

                {/* Edit Full Details Button */}
                <button
                  onClick={() => handleEditFullDetails(index)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: "var(--color-surface-container-high)",
                    color: "var(--color-text-secondary)",
                    outline:
                      "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
                  }}
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
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
                }}
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
                className="px-4 py-3 font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  backgroundColor: "var(--color-surface-container-high)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Streaming Indicator */}
        {streaming && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-3"
              style={{
                backgroundColor: "var(--color-surface-container-high)",
                outline:
                  "1px solid color-mix(in srgb, var(--color-outline-variant) 25%, transparent)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      animationDelay: "0ms",
                    }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      animationDelay: "150ms",
                    }}
                  />
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      animationDelay: "300ms",
                    }}
                  />
                </div>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="p-4"
        style={{
          borderTop:
            "1px solid color-mix(in srgb, var(--color-outline-variant) 25%, transparent)",
        }}
      >
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading || editingGoals.length > 0}
            className="flex-1 px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--color-surface-container-lowest)",
              color: "var(--color-text-primary)",
              outline:
                "1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent)",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || editingGoals.length > 0}
            className="px-4 py-3 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))",
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {editingGoals.length > 0 && (
          <p
            className="text-xs mt-2 text-center"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Review your goals above before saving
          </p>
        )}
      </div>
    </div>
  );
}
