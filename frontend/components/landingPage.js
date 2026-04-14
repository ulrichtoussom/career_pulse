'use client'
import { useState } from 'react';

// ── Icons ──────────────────────────────────────────────────────────────────────
function IconDoc() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  );
}
function IconBolt() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  );
}
function IconTarget() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
    </svg>
  );
}
function IconArrow() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
    </svg>
  );
}
function IconMenu() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  );
}
function IconX() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
    </svg>
  );
}

// ── Landing Page ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
              </svg>
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900">
              Career<span className="text-blue-600">Pulse</span>
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Comment ça marche</a>
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Fonctionnalités</a>
            <a href="#results" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Résultats</a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a href="/login" className="hidden md:inline text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Connexion
            </a>
            <a href="/login" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
              Commencer gratuitement
            </a>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
            <a href="#how" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Comment ça marche</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Fonctionnalités</a>
            <a href="#results" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">Résultats</a>
            <a href="/login" className="block mt-2 py-2.5 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Connexion</a>
          </div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            IA Recrutement · Gratuit
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900 mb-5 md:mb-6">
            Votre CV,{' '}
            <span className="text-blue-600">adapté à chaque offre</span>{' '}
            en 30 secondes
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-10">
            Collez une annonce. Notre IA réécrit votre CV avec les bons mots-clés ATS,
            génère une lettre de motivation personnalisée et analyse votre compatibilité — automatiquement.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
            >
              Générer mon CV gratuitement
              <IconArrow />
            </a>
            <a
              href="#how"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm px-8 py-4 rounded-xl transition-all hover:bg-slate-50"
            >
              Voir comment ça marche
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-5 text-xs text-slate-400 font-medium">
            Aucune carte bancaire requise · Accès immédiat · Données sécurisées
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto mt-14 md:mt-20 grid grid-cols-3 gap-4 md:gap-8">
          {[
            { value: '12 400+', label: 'CVs générés' },
            { value: '30 sec', label: 'Temps de génération' },
            { value: '89%', label: 'Taux de succès ATS' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-xs md:text-sm text-slate-500 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="how" className="py-16 md:py-24 px-4 md:px-6 bg-slate-50 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Processus</p>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
              Trois étapes, un dossier parfait
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-500 max-w-xl mx-auto">
              Pas de configuration, pas de temps perdu. Remplissez, collez, téléchargez.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                step: '01',
                icon: <IconDoc />,
                title: 'Décrivez votre profil',
                desc: 'Collez votre ancien CV ou décrivez votre parcours en quelques lignes. Notre IA extrait toutes les informations importantes.',
                color: 'blue',
              },
              {
                step: '02',
                icon: <IconTarget />,
                title: "Collez l'offre d'emploi",
                desc: "Ajoutez la description du poste. L'IA identifie les mots-clés ATS critiques et adapte votre candidature en temps réel.",
                color: 'violet',
              },
              {
                step: '03',
                icon: <IconBolt />,
                title: 'Téléchargez votre dossier',
                desc: 'CV optimisé, lettre de motivation et analyse de matching générés en 30 secondes. Export PDF haute qualité en un clic.',
                color: 'emerald',
              },
            ].map((item) => {
              const colorMap = {
                blue: { bg: 'bg-blue-50', icon: 'bg-blue-600 text-white', step: 'text-blue-600', border: 'border-blue-100' },
                violet: { bg: 'bg-violet-50', icon: 'bg-violet-600 text-white', step: 'text-violet-600', border: 'border-violet-100' },
                emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-600 text-white', step: 'text-emerald-600', border: 'border-emerald-100' },
              };
              const c = colorMap[item.color];
              return (
                <div key={item.step} className={`relative bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm`}>
                  <div className={`absolute top-6 right-6 text-3xl font-black ${c.step} opacity-20`}>{item.step}</div>
                  <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center mb-5`}>
                    {item.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 md:py-24 px-4 md:px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Fonctionnalités</p>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
              Tout ce qu'il faut pour décrocher le poste
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: '📄',
                title: 'CV sur-mesure IA',
                desc: "Chaque CV est réécrit et structuré selon les exigences spécifiques de l'offre. Fini les candidatures génériques.",
              },
              {
                icon: '✉️',
                title: 'Lettre de motivation',
                desc: "Lettre personnalisée au format professionnel français, pré-remplie avec vos données et adaptée au poste.",
              },
              {
                icon: '🎯',
                title: 'Score ATS',
                desc: "Analyse de compatibilité entre votre profil et l'offre. Points forts, lacunes et recommandations concrètes.",
              },
              {
                icon: '🎨',
                title: '8 templates premium',
                desc: "Design classique, moderne, créatif ou sidebar — des templates de niveau agence, exportables en PDF.",
              },
              {
                icon: '🔧',
                title: 'Builder manuel',
                desc: "Préférez le contrôle total ? Construisez votre CV section par section avec notre éditeur visuel en temps réel.",
              },
              {
                icon: '📤',
                title: 'Export PDF haute qualité',
                desc: "Téléchargez votre dossier complet en PDF A4, prêt à l'envoi. Mise en page préservée à 100%.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS / SOCIAL PROOF ───────────────────────────────────────────── */}
      <section id="results" className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Résultats</p>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Conçu pour passer les filtres automatiques
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-400 max-w-xl mx-auto">
              Les recruteurs passent 7 secondes sur un CV. Les ATS en éliminent 75% avant lecture humaine.
              CareerPulse optimise les deux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                check: 'Mots-clés ATS extraits automatiquement de chaque offre',
              },
              {
                check: "Structure JSON Resume standardisée, compatible tous les ATS du marché",
              },
              {
                check: "Analyse sémantique profonde — au-delà des simples mots-clés",
              },
              {
                check: "Lettre de motivation adaptée au poste, à l'entreprise et au secteur",
              },
              {
                check: "Templates haute fidélité lisibles par tous les parsers de CV",
              },
              {
                check: "Historique complet de vos candidatures accessible à tout moment",
              },
            ].map((item) => (
              <div key={item.check} className="flex items-start gap-3 bg-slate-800/50 rounded-xl px-5 py-4 border border-slate-700/50">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                  <IconCheck />
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{item.check}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-4">
            Prêt à décrocher votre prochain poste ?
          </h2>
          <p className="text-blue-100 text-sm md:text-base mb-8 leading-relaxed">
            Rejoignez des milliers de candidats qui utilisent CareerPulse pour candidater plus vite, mieux, et sans effort.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-black text-sm px-8 py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Créer mon premier CV gratuit
            <IconArrow />
          </a>
          <p className="mt-4 text-blue-200 text-xs font-medium">
            Aucune carte bancaire · Accès illimité · Données sécurisées
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="py-10 md:py-14 px-4 md:px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/>
              </svg>
            </div>
            <span className="font-black text-sm tracking-tight text-slate-700">
              Career<span className="text-blue-600">Pulse</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 font-medium text-center">
            © 2026 CareerPulse — Conçu par Ulrich Toussom · Montpellier, France
          </p>

          <div className="flex items-center gap-6">
            <a href="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Connexion</a>
            <a href="/login" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Inscription</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
