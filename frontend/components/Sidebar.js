// frontend/components/Sidebar.js
import { useEffect, useState } from 'react';
import { supabase } from '@/backend/lib/supabase';

export default function Sidebar({ onSelectChat, currentChatId, setView, currentView }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setConversations(data);
      setLoading(false);
    };

    fetchConversations();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'conversations' }, 
        () => fetchConversations()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <aside className="w-[280px] bg-[#f0f4f9] h-full flex flex-col p-4 transition-all duration-300">
      
      {/* --- NOUVELLE SECTION : NAVIGATION --- */}
      <div className="mb-6 space-y-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          Menu
        </h3>
        
        {/* Bouton Chat */}
        <button
          onClick={() => setView('chat')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            currentView === 'chat' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-600 hover:bg-[#e1e5ea]'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h3" />
          </svg>
          Chat IA
        </button>

        {/* Bouton Assistant Carrière */}
        <button
          onClick={() => setView('career')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            currentView === 'career' ? 'bg-white shadow-sm text-purple-600 font-bold' : 'text-gray-600 hover:bg-[#e1e5ea]'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 14.15m17.25 0V12.82c0-1.288-.614-2.483-1.734-3.216L12 5.25 5.484 9.604c-1.12.733-1.734 1.928-1.734 3.216v1.33" />
          </svg>
          Assistant Carrière
        </button>
      </div>

      <hr className="border-gray-200/50 mb-6" />

      {/* --- SECTION HISTORIQUE CHAT --- */}
      {/* On n'affiche l'historique que si on est en mode Chat pour ne pas surcharger */}
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => { setView('chat'); onSelectChat(null); }}
          className="flex items-center gap-3 bg-[#e6eaf1] hover:bg-[#d8dce3] text-gray-700 px-4 py-3 rounded-2xl transition-all mb-8 font-medium text-sm shadow-sm w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouvelle discussion
        </button>

        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
          Récent
        </h3>
        
        {loading ? (
          <div className="space-y-3 animate-pulse px-2">
            {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-full" />)}
          </div>
        ) : (
          <nav className="space-y-1">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => { setView('chat'); onSelectChat(chat.id); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm transition-colors truncate ${
                  currentChatId === chat.id && currentView === 'chat'
                    ? 'bg-[#d3e3fd] text-[#041e49] font-medium' 
                    : 'text-gray-700 hover:bg-[#e1e5ea]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h3" />
                </svg>
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 text-[11px] text-gray-500 px-2 uppercase tracking-tighter font-bold">
        Api chat AI  2026
      </div>
    </aside>
  );
}