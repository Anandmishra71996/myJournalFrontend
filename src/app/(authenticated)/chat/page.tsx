import AgentChatExample from '@/components/chat/AgentChatExample';
import { notFound } from 'next/navigation';

export default function ChatPage() {
  const isLocalEnv = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_NODE_ENV === 'local';

  if (!isLocalEnv) {
    notFound();
  }

  return (
    <div className="w-full h-screen">
      <AgentChatExample />
    </div>
  );
}
