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
    // 1. Vérifier si un utilisateur est déjà connecté au chargement
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 2. Écouter les changements d'état (connexion/déconnexion)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Bienvenue sur le Chat IA</h1>
        <p>Veuillez vous connecter pour discuter avec l'IA.</p>
        <a href="/login" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Se connecter</a>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Chat IA (Connecté en tant que {user.email})</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-red-500 text-sm">Déconnexion</button>
      </div>
      
      {/* Les composants consomment les données du hook mis à jour */}
      <ChatList messages={messages} loading={loading} />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <ChatInput onSendMessage={sendMessage} disabled={loading} />
    </main>
  );
}