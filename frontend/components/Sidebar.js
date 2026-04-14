// frontend/components/Sidebar.js
'use client';
import { useEffect, useState } from 'react';

const AI_MODELS = [
  {
    id: 'auto',
    label: 'Auto',
    description: 'Sélection automatique avec fallback',
    premium: false,
    icon: '⚡',
  },
  {
    id: 'groq',
    label: 'LLaMA 3.3',
    description: 'Groq — rapide et gratuit',
    premium: false,
    icon: '🦙',
  },
  {
    id: 'openai',
    label: 'GPT-4o mini',
    description: 'OpenAI — équilibré',
    premium: false,
    icon: '🤖',
  },
  {
    id: 'gemini',
    label: 'Gemini 1.5',
    description: 'Google — multimodal',
    premium: false,
    icon: '✦',
  },
  {
    id: 'claude',
    label: 'Claude Haiku',
    description: 'Anthropic — premium uniquement',
    premium: true,
    icon: '◆',
  },
];

export default function Sidebar({ setView, currentView, selectedModel, onModelChange }) {
  const [userPlan, setUserPlan] = useState('free');
  const [modelOpen, setModelOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Charger le profil (plan + modèle préféré)
  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.plan) setUserPlan(data.plan);
        if (data.preferred_ai_model && onModelChange) {
          onModelChange(data.preferred_ai_model);
        }
      })
      .catch(() => {});
  }, []);

  const handleModelSelect = async (modelId) => {
    const model = AI_MODELS.find((m) => m.id === modelId);
    if (model?.premium && userPlan !== 'premium') return; // Bloqué côté UI

    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferred_ai_model: modelId }),
      });
      if (res.ok) {
        onModelChange?.(modelId);
        setToastMsg(`Modèle changé : ${model.label}`);
        setTimeout(() => setToastMsg(''), 2500);
      }
    } finally {
      setSaving(false);
      setModelOpen(false);
    }
  };

  const activeModel = AI_MODELS.find((m) => m.id === selectedModel) ?? AI_MODELS[0];

  return (
    <aside className="w-[280px] bg-[#f0f4f9] h-full flex flex-col p-4 transition-all duration-300">

      {/* ── NAVIGATION ── */}
      <div className="mb-6 space-y-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          Menu
        </h3>

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

      {/* ── SÉLECTEUR DE MODÈLE IA ── */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
          Modèle IA
        </h3>

        {/* Bouton déclencheur */}
        <button
          onClick={() => setModelOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:border-gray-300 transition-all"
        >
          <span className="flex items-center gap-2">
            <span>{activeModel.icon}</span>
            <span>{activeModel.label}</span>
            {saving && <span className="text-[10px] text-gray-400">...</span>}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${modelOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {/* Dropdown */}
        {modelOpen && (
          <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
            {AI_MODELS.map((model) => {
              const locked = model.premium && userPlan !== 'premium';
              const isActive = selectedModel === model.id;

              return (
                <button
                  key={model.id}
                  onClick={() => !locked && handleModelSelect(model.id)}
                  disabled={locked}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-all
                    ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <span className="text-base mt-0.5">{model.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>
                        {model.label}
                      </span>
                      {model.premium && (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-linear-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full">
                          Premium
                        </span>
                      )}
                      {isActive && (
                        <svg className="w-3.5 h-3.5 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">{model.description}</p>
                    {locked && (
                      <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Passer au plan Premium</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Badge plan premium */}
      {userPlan === 'premium' && (
        <div className="mx-2 mb-4 px-3 py-2 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <p className="text-[11px] font-black text-amber-700 uppercase tracking-wider">✦ Compte Premium</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Tous les modèles IA disponibles</p>
        </div>
      )}

      {/* Toast confirmation */}
      {toastMsg && (
        <div className="mx-2 mb-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-[11px] font-semibold text-emerald-700">{toastMsg}</p>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div className="mt-auto pt-4 border-t border-gray-200 text-[11px] text-gray-500 px-2 uppercase tracking-tighter font-bold">
        CareerPulse 2026
      </div>
    </aside>
  );
}
