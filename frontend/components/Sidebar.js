// frontend/components/Sidebar.js
import { useEffect, useState } from 'react';
import { supabase } from '@/backend/lib/supabase';

export default function Sidebar({ onSelectChat, currentChatId }) {
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

    // Optionnel : Écouter les changements en temps réel
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
      {/* Bouton Nouvelle Discussion */}
      <button
        onClick={() => onSelectChat(null)}
        className="flex items-center gap-3 bg-[#e6eaf1] hover:bg-[#d8dce3] text-gray-700 px-4 py-3 rounded-2xl transition-all mb-8 font-medium text-sm shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nouvelle discussion
      </button>

      <div className="flex-1 overflow-y-auto">
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
                onClick={() => onSelectChat(chat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm transition-colors truncate ${
                  currentChatId === chat.id 
                    ? 'bg-[#d3e3fd] text-[#041e49] font-medium' 
                    : 'text-gray-700 hover:bg-[#e1e5ea]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h3m-6.75 4.512l14.474-7.031a.75.75 0 000-1.362L3.226 3.088a.75.75 0 00-1.094.906l1.373 5.494c.068.272.261.494.518.601l11.666 4.86c.257.107.45.33.518.601l1.373 5.494a.75.75 0 001.094.906z" />
                </svg>
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Footer Sidebar (User Info) */}
      <div className="mt-auto pt-4 border-t border-gray-200 text-[11px] text-gray-500 px-2 uppercase tracking-tighter font-bold">
        Api chat AI  2026
      </div>
    </aside>
  );
}