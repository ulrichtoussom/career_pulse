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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 14.15m17.25 0V12.82c0-1.288-.614-2.483-1.734-3.216L12 5.25 5.484 9.604c-1.12.733-1.734 1.928-1.734 3.216v1.33" />
          </svg>
          Assistant Carrière
        </button>
      </div>

      <hr className="border-gray-200/50 mb-6" />

       <button
          onClick={() => setView('builder')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            currentView === 'builder' ? 'bg-white shadow-sm text-purple-600 font-bold' : 'text-gray-600 hover:bg-[#e1e5ea]'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 14.15m17.25 0V12.82c0-1.288-.614-2.483-1.734-3.216L12 5.25 5.484 9.604c-1.12.733-1.734 1.928-1.734 3.216v1.33" />
          </svg>
          Manual Builder
        </button>
     

        {/* --- ANCIENNE SECTION : CONVERSATIONS --- */}
      <div className="mt-auto pt-4 border-t border-gray-200 text-[11px] text-gray-500 px-2 uppercase tracking-tighter font-bold">
        Api chat AI  2026
      </div>
    </aside>
  );
}