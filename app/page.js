'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient'
import Sidebar from '@/frontend/components/Sidebar';
import CareerModule from '@/frontend/components/CareerModule';
import ChatModule from '@/frontend/components/ChatModule';
import LandingPage from '@/frontend/components/landingPage';
import ResumeBuilder from '@/frontend/components/manualBuilder/ResumeBuilder';

export default function Home() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('hub'); // 'hub', 'career', 'chat'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) return <LandingPage />;

  // --- NAVIGATION HUB ---
  if (view === 'hub') {
    return (
      <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans">
        {/* NAV BAR */}
        <nav className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-black text-xl tracking-tighter uppercase text-blue-600">
                CareerPulse
            </span>
            <div className="hidden md:flex gap-6">
              <button onClick={() => setView('career')} className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">Générer votre CV</button>
              <button onClick={() => setView('chat')} className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">IA Career Coach</button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-700">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
              title="Déconnexion"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </nav>

        {/* BODY / DASHBOARD */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <header className="mb-16">
            <h1 className="text-5xl font-black tracking-tight mb-4">Tableau de bord</h1>
            <p className="text-xl text-gray-500">Sélectionnez un outil pour propulser votre candidature.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* CARD 1: ELITE CV DESIGNER */}
            <div 
              onClick={() => setView('career')}
              className="group cursor-pointer bg-white border border-gray-100 p-12 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300 min-h-[400px] flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </div>
                <h2 className="text-4xl font-black mb-4">Elite CV Designer</h2>
                <p className="text-lg text-gray-500 leading-relaxed max-w-sm">
                  Créez des dossiers de candidature sur-mesure optimisés pour les algorithmes de recrutement.
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                Lancer l'outil <span>→</span>
              </div>
            </div>

            {/* CARD 2: IA CAREER COACH */}
            <div 
              onClick={() => setView('chat')}
              className="group cursor-pointer bg-white border border-gray-100 p-12 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-purple-100 transition-all duration-300 min-h-[400px] flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <h2 className="text-4xl font-black mb-4">IA Career Coach</h2>
                <p className="text-lg text-gray-500 leading-relaxed max-w-sm">
                  Discutez avec une intelligence spécialisée pour affiner votre stratégie et vos entretiens.
                </p>
              </div>
              <div className="flex items-center gap-2 text-purple-600 font-bold">
                Ouvrir le chat <span>→</span>
              </div>
            </div>

            {/* CARD 3: MANUAL BUILDER */}

            <div 
              onClick={() => setView('builder')}
              className="group cursor-pointer bg-white border border-gray-100 p-12 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-purple-100 transition-all duration-300 min-h-[400px] flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                </div>
                <h2 className="text-4xl font-black mb-4">Manual Builder</h2>
                <p className="text-lg text-gray-500 leading-relaxed max-w-sm">
                  Préférez-vous la touche humaine ? Construisez votre dossier de candidature à votre rythme.
                </p>
              </div>
              <div className="flex items-center gap-2 text-purple-600 font-bold">
                Construction Manuelle <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE APPLICATION (Avec Sidebar) ---
  return (
    <main className="flex h-screen bg-white overflow-hidden relative">
      {/* Sidebar - Apparaît seulement ici */}
      <div className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'} transition-all duration-300 border-r border-gray-100 bg-white h-full overflow-hidden`}>
        <Sidebar setView={setView} currentView={view} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <button onClick={() => setView('hub')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                ← Retour au Hub
            </button>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold">{user.email}</span>
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                {user.email[0].toUpperCase()}
             </div>
             <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
              title="Déconnexion"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>

            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {view === 'career' && <CareerModule />}
          {view === 'chat' && <ChatModule />}
          {view === 'builder' && <ResumeBuilder />}
        </div>
      </div>
    </main>
  );
}