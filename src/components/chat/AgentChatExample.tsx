// Example React component for Agent Chat with Human-in-the-Loop
// This demonstrates the complete flow of streaming, interrupts, and confirmations
"use client";
import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import { toastService } from '@/services/toast.service';

interface StreamEvent {
  type: 'thinking' | 'interrupt' | 'response' | 'error';
  content?: string;
  toolName?: string;
  toolArgs?: any;
  interruptId?: string;
  needsConfirmation?: boolean;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isToolCall?: boolean;
}

interface PendingToolCall {
  name: string;
  args: any;
}

// Separate function to handle agent streaming
async function streamAgentChat(
  message: string,
  threadId: string,
  onEvent: (event: StreamEvent) => void,
  onError: (error: Error) => void
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/chat/agent/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookies
        body: JSON.stringify({ message, threadId }),
      }
    );

    if (!response.ok) throw new Error('Stream failed');

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');

      // Keep incomplete line in buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const event: StreamEvent = JSON.parse(data);
            onEvent(event);
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    }
  } catch (error: any) {
    onError(error);
  }
}

// Separate function to resume agent execution after user decision
async function resumeAgentExecution(
  threadId: string,
  decision: { type: 'approve' | 'edit' | 'reject'; editedArgs?: any },
  onEvent: (event: StreamEvent) => void,
  onError: (error: Error) => void
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/chat/agent/resume`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send httpOnly cookies
        body: JSON.stringify({ threadId, decision }),
      }
    );

    if (!response.ok) throw new Error('Resume failed');

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const event: StreamEvent = JSON.parse(data);
            onEvent(event);
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    }
  } catch (error: any) {
    onError(error);
  }
}

export default function AgentChatExample() {
  const [threadId] = useState(() => `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingTool, setPendingTool] = useState<PendingToolCall | null>(null);
  const [editedArgs, setEditedArgs] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const streamAgentMessage = async (message: string) => {
    setIsStreaming(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setInput('');

    let currentResponse = '';

    await streamAgentChat(
      message,
      threadId,
      (event: StreamEvent) => {
        switch (event.type) {
          case 'thinking':
            if (event.content) {
              currentResponse += event.content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && !last.isToolCall) {
                  return [...prev.slice(0, -1), { ...last, content: currentResponse }];
                }
                return [...prev, { role: 'assistant', content: currentResponse }];
              });
            }
            break;

          case 'interrupt':
            if (event.needsConfirmation && event.toolName && event.toolArgs) {
              setPendingTool({
                name: event.toolName,
                args: event.toolArgs,
              });
              setEditedArgs(event.toolArgs);
              setMessages(prev => [
                ...prev,
                {
                  role: 'system',
                  content: `🔔 I need your confirmation to execute: ${event.toolName}`,
                  isToolCall: true,
                },
              ]);
            }
            break;

          case 'response':
            if (event.content) {
              setMessages(prev => [...prev, { role: 'assistant', content: event.content! }]);
            }
            break;

          case 'error':
            toastService.error('Agent Error', event.content || 'An error occurred');
            break;
        }
      },
      (error: Error) => {
        toastService.error('Stream Error', error.message);
        setIsStreaming(false);
      }
    );

    setIsStreaming(false);
  };

  const handleDecision = async (type: 'approve' | 'edit' | 'reject') => {
    if (!pendingTool) return;

    setIsStreaming(true);
    const decision: any = { type };

    if (type === 'edit' && editedArgs) {
      decision.editedArgs = editedArgs;
    }

    setMessages(prev => [
      ...prev,
      {
        role: 'system',
        content:
          type === 'approve'
            ? `✅ Approved: ${pendingTool.name}`
            : type === 'reject'
            ? `❌ Rejected: ${pendingTool.name}`
            : `✏️ Edited: ${pendingTool.name}`,
        isToolCall: true,
      },
    ]);

    await resumeAgentExecution(
      threadId,
      decision,
      (event: StreamEvent) => {
        if (event.type === 'response' && event.content) {
          setMessages(prev => [...prev, { role: 'assistant', content: event.content! }]);
        }
      },
      (error: Error) => {
        toastService.error('Execution Error', error.message);
        setIsStreaming(false);
      }
    );

    setPendingTool(null);
    setEditedArgs(null);
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Agent Chat (with Tools)</h2>
        <p className="text-sm text-gray-500">Try: "Create a weekly fitness goal" or "Save today's journal"</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : msg.role === 'system'
                  ? 'bg-yellow-100 text-yellow-900 border-2 border-yellow-300'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Tool Confirmation Modal */}
      {pendingTool && (
        <div className="mb-4 p-4 bg-white border-2 border-indigo-500 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Confirm Tool: {pendingTool.name}</h3>
          
          {/* Editable Args */}
          <div className="space-y-2 mb-4">
            {Object.entries(editedArgs || {}).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key}
                </label>
                <input
                  type="text"
                  value={String(value)}
                  onChange={(e) => setEditedArgs({ ...editedArgs, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleDecision('approve')}
              disabled={isStreaming}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              ✅ Approve
            </button>
            <button
              onClick={() => handleDecision('edit')}
              disabled={isStreaming}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              ✏️ Save Edits
            </button>
            <button
              onClick={() => handleDecision('reject')}
              disabled={isStreaming}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isStreaming && input && streamAgentMessage(input)}
          placeholder="Type your message..."
          disabled={isStreaming}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={() => streamAgentMessage(input)}
          disabled={isStreaming || !input}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isStreaming ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
