// frontend/components/CareerModule.js
import { useState } from 'react';
import { supabase } from '@/backend/lib/supabase'; // Import manquant ajouté
import CVTemplateModerne from './templates/CVTemplate';
import CVTemplateEpure from './templates/CVTemplateEpure';
import CVTemplateCreatif from './templates/CVTemplateCreatif';

export default function CareerModule() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('cv'); 
    
    // --- NOUVEL ÉTAT POUR LE CHOIX DU TEMPLATE ---
    const [selectedTemplate, setSelectedTemplate] = useState('moderne');

    // Mapping des composants de templates
    const templates = {
        moderne: CVTemplateModerne,
        epure: CVTemplateEpure,
        creatif: CVTemplateCreatif
    };

    const SelectedCV = templates[selectedTemplate];

    const generate = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const form = new FormData(e.target);
            const payload = Object.fromEntries(form.entries());
            const { data: { session } } = await supabase.auth.getSession();

            const res = await fetch('/api/career', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.structured_data) {
                setResult(data.structured_data);
            }
        } catch (error) {
            console.error("Erreur de génération:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f9fa]">
            <div className="flex flex-1 overflow-hidden">
                {/* FORMULAIRE (Partie gauche) */}
                <div className="w-full md:w-[350px] bg-white border-r p-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-lg font-bold mb-6 italic">Career Studio</h2>
                    
                    {/* SÉLECTEUR DE TEMPLATES */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">1. Style du CV</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(templates).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedTemplate(t)}
                                    className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border-2 transition-all ${
                                        selectedTemplate === t 
                                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={generate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">2. Mon Profil</label>
                            <textarea name="profile_summary" placeholder="Expériences, diplômes..." className="w-full h-40 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">3. L Annonce</label>
                            <textarea name="job_description" placeholder="Collez l'offre ici..." className="w-full h-40 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                        </div>
                        <button disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
                            {loading ? "IA en cours..." : "Générer le dossier"}
                        </button>
                    </form>
                </div>

                {/* ZONE DE TRAVAIL (Partie droite) */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-white border-b px-8 py-2 flex gap-4">
                        {['cv', 'letter', 'analysis'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                    activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {tab === 'cv' ? '📄 Mon CV' : tab === 'letter' ? '✉️ Lettre' : '🔍 Analyse'}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200 shadow-inner">
                        {result ? (
                            <div className="scale-90 origin-top transition-all duration-500">
                                {/* UTILISATION DU COMPOSANT DYNAMIQUE SELON LE TEMPLATE CHOISI */}
                                {activeTab === 'cv' && <SelectedCV data={result} />}
                                
                                {activeTab === 'letter' && (
                                    <div className="bg-white shadow-2xl p-16 w-[794px] min-h-[1120px] text-sm leading-loose">
                                        <p className="text-right mb-12">Fait le {new Date().toLocaleDateString()}</p>
                                        <div className="whitespace-pre-wrap font-serif text-gray-700">{result.letter}</div>
                                    </div>
                                )}

                                {activeTab === 'analysis' && (
                                    <div className="bg-white shadow-2xl p-10 w-[794px] rounded-xl">
                                        <h2 className="text-xl font-bold text-purple-600 mb-6 border-b pb-2">Analyse Stratégique</h2>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="bg-green-50 p-6 rounded-2xl">
                                                <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2">✅ Points Forts</h4>
                                                <ul className="space-y-3 text-sm text-green-800">{result.analysis.strengths.map((s,i) => <li key={i} className="flex gap-2"><span>•</span>{s}</li>)}</ul>
                                            </div>
                                            <div className="bg-red-50 p-6 rounded-2xl">
                                                <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">⚠️ Points à surveiller</h4>
                                                <ul className="space-y-3 text-sm text-red-800">{result.analysis.gaps.map((g,i) => <li key={i} className="flex gap-2"><span>•</span>{g}</li>)}</ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-full mb-4 animate-spin-slow"></div>
                                <p className="italic font-light">Prêt à transformer votre carrière...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}