import React from 'react';

export default function LandingPage() {
  
  // Fonction pour scroller manuellement si besoin (optionnel avec le CSS smooth)
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic">
              Career<span className="text-blue-600 font-black">Pulse</span>
            </span>
          </div>

          {/* Liens de navigation avec Smooth Scroll */}
          <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            <a href="#features" className="hover:text-blue-600 transition-colors">Fonctionnalités</a>
            <a href="#vision" className="hover:text-blue-600 transition-colors">Notre Vision</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Impact</a>
          </div>

          <a href="/login" className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
            Connexion
          </a>
        </div>
      </nav>

      {/* --- HERO BANNER (Section id="top") --- */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
             <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
             Système Intelligent V3.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
            Propulsez votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Carrière</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            L'IA de recrutement la plus avancée pour transformer vos expériences en opportunités concrètes. 
            Générez, personnalisez et dominez.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a href="/login" className="w-full md:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-blue-200">
              Démarrer l'expérience
            </a>
            <button 
                onClick={() => scrollToSection('features')}
                className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
                En savoir plus ↓
            </button>
          </div>
        </div>
      </section>

      {/* --- FONCTIONNALITÉS (Section id="features") --- */}
      <section id="features" className="py-32 bg-gray-50/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-4">L'Arsenal de Candidature</h2>
            <p className="text-3xl font-black uppercase italic tracking-tighter">Tout ce dont vous avez besoin</p>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
                title="CV Architect" 
                desc="Structurez vos compétences selon les standards de l'industrie avec nos templates Elite."
                icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
            <FeatureCard 
                title="Smart Cover" 
                desc="Des lettres de motivation de +400 mots, ultra-personnalisées et basées sur l'offre."
                icon="M13 10V3L4 14h7v7l9-11h-7z"
                color="purple"
            />
            <FeatureCard 
                title="ATS-Friendly" 
                desc="Optimisé pour passer les filtres automatiques des plus grandes entreprises tech."
                icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                color="emerald"
            />
          </div>
        </div>
      </section>

      {/* --- VISION / STORYTELLING (Section id="vision") --- */}
      <section id="vision" className="py-32 px-6 scroll-mt-20 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-8 leading-[0.9]">
                    Nous ne créons pas de CV.<br />
                    <span className="text-blue-600">Nous forgeons des carrières.</span>
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                    Dans un monde où chaque seconde compte, votre candidature doit frapper fort et juste. CareerPulse utilise la puissance de l'IA pour extraire l'essence même de votre talent.
                </p>
                <ul className="space-y-4">
                    {['Analyse sémantique profonde', 'Génération contextuelle STAR', 'Design haute fidélité'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                            <span className="w-2 h-2 bg-blue-600 rounded-full" /> {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-gray-100 rounded-[40px] rotate-3 border-8 border-gray-50 shadow-2xl flex items-center justify-center">
                 <span className="text-6xl">🚀</span>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="stats" className="py-20 border-t border-gray-100 bg-gray-50 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex gap-2 items-center mb-8 opacity-40 grayscale">
            <div className="w-6 h-6 bg-gray-900 rounded-md" />
            <span className="font-black uppercase tracking-tighter italic">CareerPulse AI</span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] leading-loose">
            © 2026 Montpellier, France — Conçu par Ulrich Toussom <br /> 
            AI & Software Architecture Elite Tooling
          </p>
        </div>
      </footer>
    </div>
  );
}

// Petit sous-composant pour les cartes de fonctionnalités
function FeatureCard({ title, desc, icon, color = "blue" }) {
    const colors = {
        blue: "bg-blue-100 text-blue-600 hover:bg-blue-600",
        purple: "bg-purple-100 text-purple-600 hover:bg-purple-600",
        emerald: "bg-emerald-100 text-emerald-600 hover:bg-emerald-600",
    };

    return (
        <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-8 group-hover:text-white transition-colors`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}/>
                </svg>
            </div>
            <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">{title}</h3>
            <p className="text-gray-400 text-[13px] leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    );
}