// frontend/components/Sidebar.js
import { useEffect, useState } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient'
import CareerHistory from './career/CareerHistory';

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

        {/* Bouton Assistant Carrière */}
        <button
          onClick={() => setView('career')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            currentView === 'career' ? 'bg-white shadow-sm text-purple-600 font-bold' : 'text-gray-600 hover:bg-[#e1e5ea]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
          </svg>
          Elite CV Designer
        </button>

        {/* Bouton IA Career Coach */}
        <button
          onClick={() => setView('chat')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            currentView === 'chat' ? 'bg-white shadow-sm text-violet-600 font-bold' : 'text-gray-600 hover:bg-[#e1e5ea]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
          IA Career Coach
        </button>

        {/* Bouton Manual Builder */}
        <button
          onClick={() => setView('builder')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            currentView === 'builder' ? 'bg-white shadow-sm text-purple-600 font-bold' : 'text-gray-600 hover:bg-[#e1e5ea]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Manual Builder
        </button>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-auto pt-4 border-t border-gray-200 text-[11px] text-gray-500 px-2 uppercase tracking-tighter font-bold">
        CareerPulse 2026
      </div>
    </aside>
  );
}