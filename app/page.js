// app/page.js
"use client";
import { useChat } from '@/frontend/hooks/useChat';
import ChatList from '@/frontend/components/ChatList';
import  ChatInput  from '@/frontend/components/ChatInput';

export default function Home() {
  const { messages, sendMessage, loading, error } = useChat();

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <header className="py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">ChatApp AI 🤖</h1>
        <p className="text-gray-500 text-sm">Next.js + Prisma + Groq</p>
      </header>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center text-xs">
          {error}
        </div>
      )}

      <ChatList messages={messages} />
      
      <ChatInput onSendMessage={sendMessage} isLoading={loading} />

      <footer className="py-4 text-center text-[10px] text-gray-400">
        Propulsé par SQLite & Groq Cloud
      </footer>
    </div>
  );
}