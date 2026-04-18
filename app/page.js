'use client'

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/frontend/lib/supabaseClient'
import Sidebar from '@/frontend/components/Sidebar';
import CareerModule from '@/frontend/components/CareerModule';
import LandingPage from '@/frontend/components/landingPage';
import ResumeBuilder from '@/frontend/components/manualBuilder/ResumeBuilder';
import CoachModule from '@/frontend/components/iaCareerCoach/CoachModule';

export default function Home() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('hub');
  const [selectedModel, setSelectedModel] = useState('auto');

  // ── Sidebar : états séparés mobile / desktop ────────────────
  // Mobile  → tiroir fixe, géré par translate-x (isMobileOpen)
  // Desktop → colonne inline, géré par width    (isDesktopOpen)
  const [isMobileOpen, setIsMobileOpen]   = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  const SIDEBAR_MIN     = 200;
  const SIDEBAR_MAX     = 480;
  const SIDEBAR_DEFAULT = 280;
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const isResizing = useRef(false);

  // Le bouton hamburger toggle le bon état selon la taille de l'écran
  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsDesktopOpen(o => !o);
    } else {
      setIsMobileOpen(o => !o);
    }
  };

  const startResize = () => {
    isResizing.current = true;
    document.body.style.cursor    = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = Math.min(Math.max(e.clientX, SIDEBAR_MIN), SIDEBAR_MAX);
      setSidebarWidth(newWidth);
    };
    const onMouseUp = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      document.body.style.cursor    = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, []);

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

  // Ferme uniquement le tiroir mobile lors de la navigation
  const navigateTo = (v) => {
    setView(v);
    setIsMobileOpen(false);
  };

  if (!user) return <LandingPage />;

  // --- NAVIGATION HUB ---
  if (view === 'hub') {
    const firstName = user.email.split('@')[0];
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    const tools = [
      {
        key: 'career',
        accent: 'blue',
        badge: 'IA · 30 secondes',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        ),
        title: 'Elite CV Designer',
        desc: "Collez une offre d'emploi, notre IA génère un CV sur-mesure optimisé ATS, une lettre de motivation et un score de compatibilité — instantanément.",
        features: ['CV adapté mot à mot à chaque offre', 'Lettre de motivation incluse', 'Score ATS + analyse de matching'],
        cta: 'Lancer le générateur',
      },
      {
        key: 'chat',
        accent: 'violet',
        badge: 'IA · 24h/24',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
        ),
        title: 'IA Career Coach',
        desc: "Un expert recrutement disponible à tout moment pour préparer vos entretiens, affiner votre pitch et répondre à toutes vos questions carrière.",
        features: ["Préparation d'entretiens ciblée", 'Stratégie de candidature', 'Conseils personnalisés en temps réel'],
        cta: 'Ouvrir le coach',
      },
      {
        key: 'builder',
        accent: 'emerald',
        badge: 'Manuel · Contrôle total',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        ),
        title: 'Manual Builder',
        desc: 'Construisez votre CV section par section avec notre éditeur visuel temps réel. 8 templates premium, personnalisation totale, export PDF immédiat.',
        features: ['8 templates premium inclus', 'Éditeur visuel en temps réel', 'Export PDF haute qualité'],
        cta: 'Construire mon CV',
      },
    ];

    const accentStyles = {
      blue:   { bar: 'bg-blue-600',   badge: 'bg-blue-50 text-blue-700 border-blue-100',   icon: 'bg-blue-600 text-white',   bullet: 'bg-blue-500',   btn: 'bg-blue-600 hover:bg-blue-700 text-white' },
      violet: { bar: 'bg-violet-600', badge: 'bg-violet-50 text-violet-700 border-violet-100', icon: 'bg-violet-600 text-white', bullet: 'bg-violet-500', btn: 'bg-violet-600 hover:bg-violet-700 text-white' },
      emerald:{ bar: 'bg-emerald-600',badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',icon: 'bg-emerald-600 text-white',bullet: 'bg-emerald-500',btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
    };

    return (
      <div className="min-h-screen bg-slate-50 font-sans antialiased">

        {/* NAV */}
        <nav className="sticky top-0 z-50 h-14 bg-white border-b border-slate-100 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
              </svg>
            </div>
            <span className="font-black text-base tracking-tight text-slate-900">
              Career<span className="text-blue-600">Pulse</span>
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {user.email[0].toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-600 max-w-[180px] truncate">{user.email}</span>
            </div>
            <div className="md:hidden w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.email[0].toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Déconnexion"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">

          {/* GREETING */}
          <div className="mb-8 md:mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Espace de travail</p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Bonjour, {displayName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quel outil souhaitez-vous utiliser aujourd{"'"}hui ?
            </p>
          </div>

          {/* TOOL CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {tools.map((tool) => {
              const s = accentStyles[tool.accent];
              return (
                <div
                  key={tool.key}
                  onClick={() => setView(tool.key)}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Accent bar */}
                  <div className={`h-1 ${s.bar}`} />

                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className={`w-9 h-9 md:w-10 md:h-10 ${s.icon} rounded-xl flex items-center justify-center shrink-0`}>
                        {tool.icon}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider border px-2 py-1 rounded-md whitespace-nowrap ${s.badge}`}>
                        {tool.badge}
                      </span>
                    </div>

                    {/* Text */}
                    <h2 className="text-base font-black text-slate-900 mb-2">{tool.title}</h2>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-5 flex-1">{tool.desc}</p>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-5">
                      {tool.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.bullet}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button className={`w-full ${s.btn} text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5`}>
                      {tool.cta}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER HINT */}
          <p className="text-center text-xs text-slate-400 font-medium mt-8 md:mt-10">
            CareerPulse · Vos données sont chiffrées et sécurisées
          </p>
        </main>
      </div>
    );
  }

  // --- VUE APPLICATION (Avec Sidebar) ---
  return (
    <main className="flex h-screen bg-white overflow-hidden relative">

      {/* ── MOBILE : backdrop + tiroir fixe ───────────────────── */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 h-full
          border-r border-gray-100 bg-white overflow-hidden shrink-0
          transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
        style={{ width: SIDEBAR_DEFAULT }}
      >
        <Sidebar setView={navigateTo} currentView={view}
          selectedModel={selectedModel} onModelChange={setSelectedModel} />
      </div>

      {/* ── DESKTOP : colonne inline redimensionnable ──────────── */}
      <div
        className="hidden md:block h-full border-r border-gray-100 bg-white overflow-hidden shrink-0
          transition-[width] duration-200"
        style={{ width: isDesktopOpen ? sidebarWidth : 0 }}
      >
        {/* Contenu à largeur fixe pour éviter l'écrasement pendant l'animation */}
        <div style={{ width: sidebarWidth }} className="h-full">
          <Sidebar setView={navigateTo} currentView={view}
            selectedModel={selectedModel} onModelChange={setSelectedModel} />
        </div>
      </div>

      {/* Poignée resize — visible uniquement si sidebar desktop ouverte */}
      {isDesktopOpen && (
        <div
          onMouseDown={startResize}
          className="hidden md:flex items-center justify-center w-2 shrink-0
            cursor-col-resize group relative z-10"
        >
          <div className="w-px h-full bg-gray-100 group-hover:bg-blue-400 transition-colors" />
          <div className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-1
            opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 bg-blue-400 rounded-full" />
            <div className="w-1 h-1 bg-blue-400 rounded-full" />
            <div className="w-1 h-1 bg-blue-400 rounded-full" />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <button onClick={() => navigateTo('hub')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
              ← Hub
            </button>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden md:inline text-xs font-bold">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
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

        <div className="flex-1 overflow-y-auto min-h-0">
          {view === 'career' && <CareerModule selectedModel={selectedModel} />}
          {view === 'builder' && <ResumeBuilder selectedModel={selectedModel} />}
          {view === 'chat' && <CoachModule selectedModel={selectedModel} />}
        </div>
      </div>
    </main>
  );
}
