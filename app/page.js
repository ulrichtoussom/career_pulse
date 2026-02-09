"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/backend/lib/supabase';
import ChatList from '@/frontend/components/ChatList';
import ChatInput from '@/frontend/components/ChatInput';
import { useChat } from '@/frontend/hooks/useChat';

export default function Home() {
  const [user, setUser] = useState(null);
  const { messages, sendMessage, loading, error } = useChat();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Écran de connexion (Style épuré)
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f8fafd]">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full mb-6" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Bienvenue sur le Chat IA DE ULRICH TOUSSOM</h1>
        <p className="text-gray-500 mb-6">Connectez-vous pour commencer à explorer.</p>
        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-all shadow-lg font-medium">
          Se connecter
        </a>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen bg-white text-[#1f1f1f]">
      {/* Header Gemini-style */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Chat-app AI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {user.email}
          </span>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Déconnexion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Zone de conversation (Largeur contrôlée pour la lisibilité) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-8">
          {messages.length === 0 && !loading && (
            <div className="mt-20 mb-12">
               <h2 className="text-4xl md:text-5xl font-medium text-gray-300">
                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-red-400">
                   Bonjour, {user.email?.split('@')[0]}
                 </span><br />
                 En quoi puis-je vous aider ?
               </h2>
            </div>
          )}
          
          <ChatList messages={messages} loading={loading} />
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-4 border border-red-100 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Barre de saisie "flottante" */}
      <footer className="w-full pb-8 pt-2">
        <div className="max-w-4xl mx-auto px-4">
          <ChatInput onSendMessage={sendMessage} disabled={loading} />
          <p className="text-[11px] text-center mt-4 text-gray-400 font-light">
            Chat-app AI peut afficher des informations inexactes.
          </p>
        </div>
      </footer>
    </main>
  );
}